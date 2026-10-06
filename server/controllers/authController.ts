import { Request, Response } from 'express';
import crypto from 'crypto';
import { dbService } from '../services/dbService';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { auditService } from '../services/auditService';
import { AuthenticatedRequest } from '../middleware/auth';

export const authController = {
  /**
   * Register a new user and organization
   */
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, companyName, phone } = req.body;

      if (!name || !email || !password) {
        return sendError(res, 'Name, email, and password are required.', 400);
      }

      const strength = validatePasswordStrength(password);
      if (!strength.valid) {
        return sendError(res, strength.reason || 'Invalid password.', 400);
      }

      // Check if email already registered
      const existingUser = await dbService.findOne('users', { email: email.toLowerCase().trim() });
      if (existingUser) {
        return sendError(res, 'An account with this email address already exists.', 409);
      }

      const passwordHash = await hashPassword(password);
      const userUuid = crypto.randomUUID();
      const orgUuid = crypto.randomUUID();

      // 1. Create Organization
      const orgName = companyName && companyName.trim() ? companyName.trim() : `${name.trim()}'s Organization`;
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 10000);

      const org = await dbService.create('organizations', {
        uuid: orgUuid,
        name: orgName,
        slug: orgSlug,
        billing_email: email.toLowerCase().trim(),
        phone: phone || null,
        tax_id: null,
        city: 'Nairobi',
        county_state: 'Nairobi County',
        country_code: 'KE',
        preferred_currency: 'KES',
        status: 'active',
      });

      // 2. Create User
      const user = await dbService.create('users', {
        uuid: userUuid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        phone: phone || null,
        two_factor_enabled: 0,
        status: 'active',
      });

      // 3. Ensure 'owner' role exists
      let ownerRole = await dbService.findOne('roles', { name: 'owner' });
      if (!ownerRole) {
        ownerRole = await dbService.create('roles', {
          name: 'owner',
          display_name: 'Organization Owner',
          description: 'Full administrative access and billing control',
          is_system: 1,
        });
      }

      // 4. Create Organization Member record
      await dbService.create('organization_members', {
        organization_id: org.id,
        user_id: user.id,
        role_id: ownerRole.id,
        role_name: 'owner',
        status: 'active',
      });

      // 5. Default Subscriptions for demo apps
      const apps = ['paperglow-business-manager', 'paperglow-property-manager', 'paperglow-pharmacy-manager', 'paperglow-ticketing', 'paperglow-booking', 'paperglow-stock-inventory', 'paperglow-legal-practice', 'paperglow-school-manager', 'paperglow-chama-manager', 'paperglow-clinic-manager'];
      for (const appSlug of apps) {
        await dbService.create('subscriptions', {
          organization_id: org.id,
          app_slug: appSlug,
          plan_slug: 'professional',
          billing_cadence: 'monthly',
          status: 'active',
          price_kes: 3800,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        });
      }

      // 6. Generate Token
      const token = signToken({
        userId: user.id,
        email: user.email,
        organizationId: org.id,
        roleName: 'owner',
      });

      // Set cookie
      res.cookie('paperglow_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await auditService.log(req, 'user.registered', 'users', user.id, `User registered and created organization: ${org.name}`);

      return sendSuccess(res, {
        token,
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          twoFactorEnabled: false,
        },
        organization: org,
      }, 'Account successfully registered and organization created.', 201);
    } catch (err: any) {
      return sendError(res, `Registration failed: ${err.message}`, 500);
    }
  },

  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email and password are required.', 400);
      }

      const user = await dbService.findOne('users', { email: email.toLowerCase().trim() });
      if (!user) {
        return sendError(res, 'Invalid email or password.', 401);
      }

      const hash = user.password_hash || user.passwordHash;
      if (!hash) {
        return sendError(res, 'Invalid email or password.', 401);
      }

      const isValidPassword = await comparePassword(password, hash);
      if (!isValidPassword) {
        return sendError(res, 'Invalid email or password.', 401);
      }

      if (user.status === 'suspended') {
        return sendError(res, 'Your account has been suspended. Please contact support.', 403);
      }

      // Find user's organizations
      const memberships = await dbService.find('organization_members', { user_id: user.id, status: 'active' });
      let currentOrg: any = null;
      let roleName = 'owner';

      if (memberships.length > 0) {
        const firstMembership = memberships[0];
        currentOrg = await dbService.findById('organizations', firstMembership.organization_id);
        const role = firstMembership.role_id ? await dbService.findById('roles', firstMembership.role_id) : null;
        roleName = role?.name || firstMembership.role_name || 'owner';
      }

      if (!currentOrg && (user.defaultOrganizationId || user.default_organization_id)) {
        currentOrg = await dbService.findById('organizations', user.defaultOrganizationId || user.default_organization_id);
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        organizationId: currentOrg?.id || 1,
        roleName,
      });

      res.cookie('paperglow_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await auditService.log(req, 'user.login', 'users', user.id, `User logged in`);

      return sendSuccess(res, {
        token,
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          twoFactorEnabled: Boolean(user.two_factor_enabled),
        },
        organization: currentOrg,
      }, 'Login successful.');
    } catch (err: any) {
      return sendError(res, `Login failed: ${err.message}`, 500);
    }
  },

  /**
   * Logout user
   */
  async logout(req: Request, res: Response) {
    res.clearCookie('paperglow_token');
    res.clearCookie('token');
    return sendSuccess(res, null, 'Logged out successfully.');
  },

  /**
   * Current user profile & organization state
   */
  async me(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthorized', 401);
      }

      const user = await dbService.findById('users', req.user.userId);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      // Load all organizations user belongs to
      const memberships = await dbService.find('organization_members', { user_id: user.id, status: 'active' });
      const organizations = [];

      for (const m of memberships) {
        const org = await dbService.findById('organizations', m.organization_id);
        if (org) {
          const role = m.role_id ? await dbService.findById('roles', m.role_id) : null;
          organizations.push({
            ...org,
            role: role?.name || m.role_name || 'owner',
          });
        }
      }

      if (organizations.length === 0 && (user.defaultOrganizationId || user.default_organization_id)) {
        const defaultOrg = await dbService.findById('organizations', user.defaultOrganizationId || user.default_organization_id);
        if (defaultOrg) {
          organizations.push({ ...defaultOrg, role: 'owner' });
        }
      }

      const activeOrgId = req.organizationId || req.user.organizationId || organizations[0]?.id;
      const currentOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0] || null;

      // Active subscriptions for this organization
      const subscriptions = currentOrg ? await dbService.find('subscriptions', { organization_id: currentOrg.id, status: 'active' }) : [];

      return sendSuccess(res, {
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          twoFactorEnabled: Boolean(user.two_factor_enabled),
        },
        organization: currentOrg,
        organizations,
        role: currentOrg?.role || 'owner',
        subscriptions,
      });
    } catch (err: any) {
      return sendError(res, `Failed to load profile: ${err.message}`, 500);
    }
  },

  /**
   * Switch active organization
   */
  async switchOrg(req: AuthenticatedRequest, res: Response) {
    try {
      const { organizationId } = req.body;
      if (!organizationId) {
        return sendError(res, 'Target organization ID is required.', 400);
      }

      const membership = await dbService.findOne('organization_members', {
        organization_id: Number(organizationId),
        user_id: req.user!.userId,
        status: 'active',
      });

      if (!membership) {
        return sendError(res, 'You are not a member of this organization.', 403);
      }

      const org = await dbService.findById('organizations', organizationId);
      const role = membership.role_id ? await dbService.findById('roles', membership.role_id) : null;
      const roleName = role?.name || membership.role_name || 'member';

      const newToken = signToken({
        userId: req.user!.userId,
        email: req.user!.email,
        organizationId: Number(organizationId),
        roleName,
      });

      res.cookie('paperglow_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, {
        token: newToken,
        organization: org,
        role: roleName,
      }, `Switched to ${org?.name}`);
    } catch (err: any) {
      return sendError(res, `Switch organization failed: ${err.message}`, 500);
    }
  },

  /**
   * Update profile
   */
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, phone, twoFactorEnabled } = req.body;
      const updateData: Record<string, any> = {};

      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (twoFactorEnabled !== undefined) updateData.two_factor_enabled = twoFactorEnabled ? 1 : 0;

      const updated = await dbService.update('users', req.user!.userId, updateData);

      return sendSuccess(res, {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        twoFactorEnabled: Boolean(updated.two_factor_enabled),
      }, 'Profile updated successfully.');
    } catch (err: any) {
      return sendError(res, `Update profile failed: ${err.message}`, 500);
    }
  },
};
