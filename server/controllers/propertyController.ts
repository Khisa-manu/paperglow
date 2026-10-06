import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const propertyController = {
  // Properties
  async getProperties(req: AuthenticatedRequest, res: Response) {
    try {
      const properties = await dbService.find('pm_properties', { organization_id: req.organizationId! });
      return sendSuccess(res, properties);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const property = await dbService.create('pm_properties', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, property, 'Property created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Tenants
  async getTenants(req: AuthenticatedRequest, res: Response) {
    try {
      const tenants = await dbService.find('pm_tenants', { organization_id: req.organizationId! });
      return sendSuccess(res, tenants);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createTenant(req: AuthenticatedRequest, res: Response) {
    try {
      const tenant = await dbService.create('pm_tenants', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, tenant, 'Tenant registered', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Rent Payments
  async getRentPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const payments = await dbService.find('pm_rent_payments', { organization_id: req.organizationId! });
      return sendSuccess(res, payments);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createRentPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const ref = req.body.reference || `MP-${Date.now().toString().slice(-6)}`;
      const payment = await dbService.create('pm_rent_payments', { ...req.body, reference: ref, organization_id: req.organizationId! });
      return sendSuccess(res, payment, 'Rent payment recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Maintenance
  async getMaintenance(req: AuthenticatedRequest, res: Response) {
    try {
      const items = await dbService.find('pm_maintenance', { organization_id: req.organizationId! });
      return sendSuccess(res, items);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createMaintenance(req: AuthenticatedRequest, res: Response) {
    try {
      const item = await dbService.create('pm_maintenance', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, item, 'Maintenance request created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async updateMaintenance(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('pm_maintenance', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Maintenance request updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
