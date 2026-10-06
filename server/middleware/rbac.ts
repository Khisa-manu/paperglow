import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { sendError } from '../utils/response';
import { dbService } from '../services/dbService';

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.orgRole) {
      return sendError(res, 'Role not resolved for this organization.', 403);
    }

    if (!allowedRoles.includes(req.orgRole) && req.orgRole !== 'owner') {
      return sendError(res, `Permission denied. Requires one of: ${allowedRoles.join(', ')}`, 403);
    }

    next();
  };
}

export function requireSubscription(appSlug: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.organizationId) {
      return sendError(res, 'Organization context required.', 403);
    }

    const sub = await dbService.findOne('subscriptions', {
      organization_id: req.organizationId,
      app_slug: appSlug,
      status: 'active',
    });

    if (!sub) {
      // Allow if trial/development or return clear message
      console.warn(`[RBAC] Organization ${req.organizationId} accessed ${appSlug}`);
    }

    next();
  };
}
