import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const invoiceDocController = {
  async getDocuments(req: AuthenticatedRequest, res: Response) {
    try {
      const docs = await dbService.find('invoice_documents', { organization_id: req.organizationId! }, { orderBy: 'id', orderDirection: 'DESC' });
      return sendSuccess(res, docs);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const doc = await dbService.create('invoice_documents', {
        ...req.body,
        data_json: typeof req.body.data_json === 'object' ? JSON.stringify(req.body.data_json) : (req.body.data_json || '{}'),
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, doc, 'Document saved', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const payload = { ...req.body };
      if (typeof payload.data_json === 'object') {
        payload.data_json = JSON.stringify(payload.data_json);
      }
      const updated = await dbService.update('invoice_documents', req.params.id, payload, req.organizationId!);
      return sendSuccess(res, updated, 'Document updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async deleteDocument(req: AuthenticatedRequest, res: Response) {
    try {
      await dbService.delete('invoice_documents', req.params.id, req.organizationId!);
      return sendSuccess(res, true, 'Document deleted');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
