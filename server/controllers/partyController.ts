import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const partyController = {
  // Members
  async getMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const members = await dbService.find('party_members', { organization_id: req.organizationId! });
      return sendSuccess(res, members);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createMember(req: AuthenticatedRequest, res: Response) {
    try {
      const memNum = req.body.member_number || `PM-${Math.floor(1000 + Math.random() * 9000)}`;
      const member = await dbService.create('party_members', {
        ...req.body,
        member_number: memNum,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, member, 'Party member registered', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateMember(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('party_members', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Party member updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async deleteMember(req: AuthenticatedRequest, res: Response) {
    try {
      await dbService.delete('party_members', req.params.id, req.organizationId!);
      return sendSuccess(res, true, 'Party member deleted');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Branches
  async getBranches(req: AuthenticatedRequest, res: Response) {
    try {
      const branches = await dbService.find('party_branches', { organization_id: req.organizationId! });
      return sendSuccess(res, branches);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createBranch(req: AuthenticatedRequest, res: Response) {
    try {
      const branch = await dbService.create('party_branches', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, branch, 'Branch created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Events
  async getEvents(req: AuthenticatedRequest, res: Response) {
    try {
      const events = await dbService.find('party_events', { organization_id: req.organizationId! });
      return sendSuccess(res, events);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const event = await dbService.create('party_events', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, event, 'Event created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Finance Transactions
  async getFinance(req: AuthenticatedRequest, res: Response) {
    try {
      const txs = await dbService.find('party_finance', { organization_id: req.organizationId! });
      return sendSuccess(res, txs);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createFinance(req: AuthenticatedRequest, res: Response) {
    try {
      const ref = req.body.reference || `TX-PT-${Date.now().toString().slice(-6)}`;
      const tx = await dbService.create('party_finance', {
        ...req.body,
        reference: ref,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, tx, 'Financial record added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
