import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const legalController = {
  async getMatters(req: AuthenticatedRequest, res: Response) {
    try {
      const matters = await dbService.find('legal_matters', { organization_id: req.organizationId! });
      return sendSuccess(res, matters);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createMatter(req: AuthenticatedRequest, res: Response) {
    try {
      const matterNumber = `MAT-${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}`;
      const matter = await dbService.create('legal_matters', {
        ...req.body,
        matter_number: req.body.matter_number || matterNumber,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, matter, 'Matter opened', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateMatter(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('legal_matters', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Matter updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
