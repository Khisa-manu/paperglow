import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const legalController = {
  // Matters
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

  // Clients
  async getClients(req: AuthenticatedRequest, res: Response) {
    try {
      const clients = await dbService.find('legal_clients', { organization_id: req.organizationId! });
      return sendSuccess(res, clients);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createClient(req: AuthenticatedRequest, res: Response) {
    try {
      const client = await dbService.create('legal_clients', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, client, 'Client added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Hearings / Court Dates
  async getHearings(req: AuthenticatedRequest, res: Response) {
    try {
      const hearings = await dbService.find('court_dates', { organization_id: req.organizationId! });
      return sendSuccess(res, hearings);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createHearing(req: AuthenticatedRequest, res: Response) {
    try {
      const hearing = await dbService.create('court_dates', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, hearing, 'Hearing scheduled', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Time Entries
  async getTimeEntries(req: AuthenticatedRequest, res: Response) {
    try {
      const entries = await dbService.find('time_entries', { organization_id: req.organizationId! });
      return sendSuccess(res, entries);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createTimeEntry(req: AuthenticatedRequest, res: Response) {
    try {
      const entry = await dbService.create('time_entries', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, entry, 'Billable time logged', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
