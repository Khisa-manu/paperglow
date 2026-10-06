import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const bookingController = {
  // Appointments
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

  // Customers
  async getCustomers(req: AuthenticatedRequest, res: Response) {
    try {
      const customers = await dbService.find('booking_customers', { organization_id: req.organizationId! });
      return sendSuccess(res, customers);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const customer = await dbService.create('booking_customers', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, customer, 'Customer created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Services
  async getServices(req: AuthenticatedRequest, res: Response) {
    try {
      const services = await dbService.find('booking_services', { organization_id: req.organizationId! });
      return sendSuccess(res, services);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createService(req: AuthenticatedRequest, res: Response) {
    try {
      const service = await dbService.create('booking_services', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, service, 'Service added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Staff
  async getStaff(req: AuthenticatedRequest, res: Response) {
    try {
      const staff = await dbService.find('booking_staff', { organization_id: req.organizationId! });
      return sendSuccess(res, staff);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createStaff(req: AuthenticatedRequest, res: Response) {
    try {
      const staffMember = await dbService.create('booking_staff', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, staffMember, 'Staff member added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Payments
  async getPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const payments = await dbService.find('booking_payments', { organization_id: req.organizationId! });
      return sendSuccess(res, payments);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const payment = await dbService.create('booking_payments', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, payment, 'Payment recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
