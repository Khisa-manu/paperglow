import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { storageService } from '../services/storageService';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';
import { auditService } from '../services/auditService';

export const documentController = {
  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const { category, entityType, entityId } = req.query;
      const filters: any = { organization_id: req.organizationId! };

      if (category) filters.category = category;
      if (entityType) filters.entity_type = entityType;
      if (entityId) filters.entity_id = entityId;

      const docs = await dbService.find('documents', filters, { orderBy: 'id', orderDirection: 'DESC' });
      return sendSuccess(res, docs);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  async upload(req: AuthenticatedRequest, res: Response) {
    try {
      const file = (req as any).file;
      if (!file) {
        return sendError(res, 'No file uploaded.', 400);
      }

      const { category = 'other', title, entityType, entityId } = req.body;

      const doc = await storageService.storeDocument({
        organizationId: req.organizationId!,
        userId: req.user?.userId,
        category,
        title: title || file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileBuffer: file.buffer,
        entityType,
        entityId,
      });

      await auditService.log(req, 'document.uploaded', 'documents', doc.id, `Uploaded ${file.originalname}`);

      return sendSuccess(res, doc, 'Document stored successfully.', 201);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  async download(req: AuthenticatedRequest, res: Response) {
    try {
      const fileInfo = await storageService.getDocumentPath(req.params.id, req.organizationId!);
      if (!fileInfo) {
        return sendError(res, 'Document not found or access denied.', 404);
      }

      res.setHeader('Content-Type', fileInfo.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileInfo.originalName)}"`);
      return res.sendFile(fileInfo.path);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const success = await storageService.deleteDocument(req.params.id, req.organizationId!);
      if (!success) {
        return sendError(res, 'Document not found or could not be deleted.', 404);
      }

      await auditService.log(req, 'document.deleted', 'documents', Number(req.params.id), 'Deleted document');
      return sendSuccess(res, true, 'Document deleted successfully.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },
};
