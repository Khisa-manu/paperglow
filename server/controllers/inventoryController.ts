import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const inventoryController = {
  async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const products = await dbService.find('inventory_products', { organization_id: req.organizationId! });
      return sendSuccess(res, products);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const product = await dbService.create('inventory_products', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, product, 'Product added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('inventory_products', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Product updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      await dbService.delete('inventory_products', req.params.id, req.organizationId!);
      return sendSuccess(res, true, 'Product deleted');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
