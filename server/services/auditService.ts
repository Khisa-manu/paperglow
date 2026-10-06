import { Request } from 'express';
import { dbService } from './dbService';

export const auditService = {
  async log(req: Request, action: string, entityType: string, entityId?: number, details?: string) {
    try {
      const orgId = (req as any).organizationId || (req as any).user?.organizationId;
      const userId = (req as any).user?.userId;
      const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || '';

      await dbService.create('audit_logs', {
        organization_id: orgId,
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        ip_address: ipAddress,
        user_agent: userAgent,
        details: details || '',
      });
    } catch (err) {
      console.warn('[AuditService] Failed to record audit log:', err);
    }
  },
};
