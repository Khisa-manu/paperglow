import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const ticketingController = {
  async getTickets(req: AuthenticatedRequest, res: Response) {
    try {
      const tickets = await dbService.find('tickets', { organization_id: req.organizationId! });
      return sendSuccess(res, tickets);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const ticketCode = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
      const ticket = await dbService.create('tickets', {
        ...req.body,
        ticket_code: ticketCode,
        organization_id: req.organizationId!,
        status: req.body.status || 'Open',
      });
      return sendSuccess(res, ticket, 'Ticket created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('tickets', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Ticket updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async getMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const messages = await dbService.find('ticket_messages', { ticket_id: req.params.ticketId });
      return sendSuccess(res, messages);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async addMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const msg = await dbService.create('ticket_messages', {
        ticket_id: req.params.ticketId,
        sender_type: 'agent',
        sender_name: req.user?.name || 'Agent',
        message: req.body.message,
      });
      return sendSuccess(res, msg, 'Message sent', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
