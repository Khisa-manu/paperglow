import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { sendError } from '../utils/response';
import { dbService } from '../services/dbService';

export async function requireOrgContext(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return sendError(res, 'Authentication required before organization context.', 401);
  }

  try {
    // Check header, query, or fallback to user's primary organization
    let requestedOrgId: number | undefined;
    const headerOrg = req.headers['x-organization-id'];
    
    if (headerOrg) {
      requestedOrgId = Number(headerOrg);
    } else if (req.query.organization_id) {
      requestedOrgId = Number(req.query.organization_id);
    } else if (req.user.organizationId) {
      requestedOrgId = Number(req.user.organizationId);
    }

    if (!requestedOrgId) {
      // Look up any membership for user
      const memberships = await dbService.find('organization_members', { user_id: req.user.userId, status: 'active' });
      if (memberships.length > 0) {
        requestedOrgId = Number(memberships[0].organization_id);
      }
    }

    if (!requestedOrgId) {
      return sendError(res, 'No organization selected or associated with this user account.', 403);
    }

    // Verify membership in database
    let membership = await dbService.findOne('organization_members', {
      organization_id: requestedOrgId,
      user_id: req.user.userId,
      status: 'active',
    });

    // Also check if requestedOrgId matches token organizationId
    if (!membership && req.user.organizationId === requestedOrgId) {
      membership = { roleName: req.user.roleName || 'owner' };
    }

    if (!membership) {
      return sendError(res, 'Access denied. You are not an active member of this organization.', 403);
    }

    // Load role name
    let roleName = 'member';
    if (membership.role_id) {
      const role = await dbService.findById('roles', membership.role_id);
      if (role) roleName = role.name;
    } else if (membership.role_name || membership.roleName) {
      roleName = membership.role_name || membership.roleName;
    } else if (req.user.roleName) {
      roleName = req.user.roleName;
    }

    req.organizationId = requestedOrgId;
    req.orgRole = roleName;

    next();
  } catch (err: any) {
    return sendError(res, `Failed to resolve organization context: ${err.message}`, 500);
  }
}
