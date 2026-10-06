import { Request, Response } from 'express';
import { getDbHealth } from '../database/connection';
import { sendSuccess } from '../utils/response';

export const healthController = {
  check(req: Request, res: Response) {
    const dbHealth = getDbHealth();
    const isHealthy = dbHealth.status === 'connected' || dbHealth.status === 'local_storage_active';

    const healthData = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      environment: process.env.NODE_ENV || 'production',
      platform: 'Paperglow SaaS Multi-Tenant Platform',
      database: dbHealth,
      version: '1.0.0',
    };

    return res.status(isHealthy ? 200 : 503).json(healthData);
  },
};
