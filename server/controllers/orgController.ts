import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';
import { auditService } from '../services/auditService';

export const orgController = {
  /**
   * Get current organization details
   */
  async getCurrent(req: AuthenticatedRequest, res: Response) {
    try {
      const org = await dbService.findById('organizations', req.organizationId!);
      if (!org) {
        return sendError(res, 'Organization not found', 404);
      }
      return sendSuccess(res, org);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Update organization details
   */
  async updateCurrent(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, phone, billing_email, tax_id, address_line1, city, county_state } = req.body;
      const updateData: Record<string, any> = {};

      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (billing_email) updateData.billing_email = billing_email;
      if (tax_id) updateData.tax_id = tax_id;
      if (address_line1) updateData.address_line1 = address_line1;
      if (city) updateData.city = city;
      if (county_state) updateData.county_state = county_state;

      const updated = await dbService.update('organizations', req.organizationId!, updateData);
      await auditService.log(req, 'org.updated', 'organizations', req.organizationId!, 'Updated organization profile');

      return sendSuccess(res, updated, 'Organization updated successfully.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * List members of current organization
   */
  async listMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const memberships = await dbService.find('organization_members', { organization_id: req.organizationId! });
      const members = [];

      for (const m of memberships) {
        const user = await dbService.findById('users', m.user_id);
        const role = m.role_id ? await dbService.findById('roles', m.role_id) : null;
        if (user) {
          members.push({
            id: m.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: role?.name || m.role_name || 'member',
            status: m.status,
            joinedAt: m.joined_at,
          });
        }
      }

      return sendSuccess(res, members);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Invite member to organization
   */
  async inviteMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, roleName = 'member' } = req.body;
      if (!email) {
        return sendError(res, 'Email is required', 400);
      }

      // Find user if exists
      let user = await dbService.findOne('users', { email: email.toLowerCase().trim() });
      if (!user) {
        return sendError(res, 'User with this email not registered on Paperglow yet. Please ask them to register first.', 404);
      }

      // Check existing membership
      const existing = await dbService.findOne('organization_members', {
        organization_id: req.organizationId!,
        user_id: user.id,
      });

      if (existing) {
        return sendError(res, 'User is already a member of this organization.', 409);
      }

      // Resolve role
      let role = await dbService.findOne('roles', { name: roleName });
      if (!role) {
        role = await dbService.findOne('roles', { name: 'member' });
      }

      const membership = await dbService.create('organization_members', {
        organization_id: req.organizationId!,
        user_id: user.id,
        role_id: role?.id || null,
        role_name: roleName,
        status: 'active',
      });

      await auditService.log(req, 'org.member_added', 'organization_members', membership.id, `Added ${user.email} as ${roleName}`);

      return sendSuccess(res, membership, `Member ${user.email} added to organization.`, 201);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },
};
