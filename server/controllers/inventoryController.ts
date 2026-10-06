import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const inventoryController = {
  // Products
  async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const products = await dbService.find('inventory_products', { organization_id: req.organizationId! });
      return sendSuccess(res, products);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const product = await dbService.create('inventory_products', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, product, 'Product added to inventory cloud', 201);
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

  // Stock Movements
  async getMovements(req: AuthenticatedRequest, res: Response) {
    try {
      const movements = await dbService.find('inventory_stock_movements', { organization_id: req.organizationId! }, { orderBy: 'id', orderDirection: 'DESC' });
      return sendSuccess(res, movements);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createMovement(req: AuthenticatedRequest, res: Response) {
    try {
      const movement = await dbService.create('inventory_stock_movements', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, movement, 'Stock movement recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Suppliers
  async getSuppliers(req: AuthenticatedRequest, res: Response) {
    try {
      const suppliers = await dbService.find('inventory_suppliers', { organization_id: req.organizationId! });
      return sendSuccess(res, suppliers);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createSupplier(req: AuthenticatedRequest, res: Response) {
    try {
      const supplier = await dbService.create('inventory_suppliers', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, supplier, 'Supplier added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
