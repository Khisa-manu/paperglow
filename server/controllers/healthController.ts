import { Request, Response } from 'express';
import { getDbHealth } from '../database/connection';

export const healthController = {
  async check(req: Request, res: Response) {
    const dbHealth = await getDbHealth();
    const isHealthy = dbHealth.alive === true;

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
