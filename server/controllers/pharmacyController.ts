import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const pharmacyController = {
  // Medicines
  async getMedicines(req: AuthenticatedRequest, res: Response) {
    try {
      const medicines = await dbService.find('pharm_medicines', { organization_id: req.organizationId! });
      return sendSuccess(res, medicines);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createMedicine(req: AuthenticatedRequest, res: Response) {
    try {
      const medicine = await dbService.create('pharm_medicines', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, medicine, 'Medicine registered', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async updateMedicine(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('pharm_medicines', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Medicine updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Sales
  async getSales(req: AuthenticatedRequest, res: Response) {
    try {
      const sales = await dbService.find('pharm_sales', { organization_id: req.organizationId! });
      return sendSuccess(res, sales);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createSale(req: AuthenticatedRequest, res: Response) {
    try {
      const receiptNumber = req.body.receipt_number || `RX-${Date.now().toString().slice(-5)}`;
      const sale = await dbService.create('pharm_sales', { ...req.body, receipt_number: receiptNumber, organization_id: req.organizationId! });
      return sendSuccess(res, sale, 'Sale completed', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Stock movements
  async getMovements(req: AuthenticatedRequest, res: Response) {
    try {
      const movements = await dbService.find('pharm_stock_movements', { organization_id: req.organizationId! }, { orderBy: 'id', orderDirection: 'DESC' });
      return sendSuccess(res, movements);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createMovement(req: AuthenticatedRequest, res: Response) {
    try {
      const movement = await dbService.create('pharm_stock_movements', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, movement, 'Pharmacy movement logged', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Suppliers
  async getSuppliers(req: AuthenticatedRequest, res: Response) {
    try {
      const suppliers = await dbService.find('pharm_suppliers', { organization_id: req.organizationId! });
      return sendSuccess(res, suppliers);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createSupplier(req: AuthenticatedRequest, res: Response) {
    try {
      const supplier = await dbService.create('pharm_suppliers', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, supplier, 'Supplier registered', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
