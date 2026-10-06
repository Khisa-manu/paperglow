import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const bookingController = {
  async getBookings(req: AuthenticatedRequest, res: Response) {
    try {
      const bookings = await dbService.find('bookings', { organization_id: req.organizationId! });
      return sendSuccess(res, bookings);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createBooking(req: AuthenticatedRequest, res: Response) {
    try {
      const booking = await dbService.create('bookings', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, booking, 'Booking created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateBooking(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('bookings', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Booking updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async deleteBooking(req: AuthenticatedRequest, res: Response) {
    try {
      await dbService.delete('bookings', req.params.id, req.organizationId!);
      return sendSuccess(res, true, 'Booking deleted');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
