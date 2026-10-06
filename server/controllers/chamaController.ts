import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const chamaController = {
  // Members
  async getMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const members = await dbService.find('chama_members', { organization_id: req.organizationId! });
      return sendSuccess(res, members);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createMember(req: AuthenticatedRequest, res: Response) {
    try {
      const memNum = `CHM-${Math.floor(100 + Math.random() * 900)}`;
      const member = await dbService.create('chama_members', {
        ...req.body,
        member_number: req.body.member_number || memNum,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, member, 'Member enrolled', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateMember(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('chama_members', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Member updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Contributions
  async getContributions(req: AuthenticatedRequest, res: Response) {
    try {
      const contributions = await dbService.find('chama_contributions', { organization_id: req.organizationId! });
      return sendSuccess(res, contributions);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createContribution(req: AuthenticatedRequest, res: Response) {
    try {
      const ref = req.body.reference || `CHM-MP-${Date.now().toString().slice(-6)}`;
      const contribution = await dbService.create('chama_contributions', {
        ...req.body,
        reference: ref,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, contribution, 'Contribution recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Loans
  async getLoans(req: AuthenticatedRequest, res: Response) {
    try {
      const loans = await dbService.find('chama_loans', { organization_id: req.organizationId! });
      return sendSuccess(res, loans);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createLoan(req: AuthenticatedRequest, res: Response) {
    try {
      const loanCode = `LN-${Math.floor(1000 + Math.random() * 9000)}`;
      const loan = await dbService.create('chama_loans', {
        ...req.body,
        loan_code: loanCode,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, loan, 'Loan applied', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Group Profile
  async getGroup(req: AuthenticatedRequest, res: Response) {
    try {
      let group = await dbService.findOne('chama_groups', { organization_id: req.organizationId! });
      return sendSuccess(res, group);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateGroup(req: AuthenticatedRequest, res: Response) {
    try {
      let group = await dbService.findOne('chama_groups', { organization_id: req.organizationId! });
      if (group) {
        group = await dbService.update('chama_groups', group.id, req.body, req.organizationId!);
      } else {
        group = await dbService.create('chama_groups', { ...req.body, organization_id: req.organizationId! });
      }
      return sendSuccess(res, group, 'Chama profile saved');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
