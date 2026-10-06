import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const businessController = {
  // Customers
  async getCustomers(req: AuthenticatedRequest, res: Response) {
    try {
      const customers = await dbService.find('bm_customers', { organization_id: req.organizationId! });
      return sendSuccess(res, customers);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const customer = await dbService.create('bm_customers', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, customer, 'Customer created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async updateCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('bm_customers', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Customer updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async deleteCustomer(req: AuthenticatedRequest, res: Response) {
    try {
      await dbService.delete('bm_customers', req.params.id, req.organizationId!);
      return sendSuccess(res, true, 'Customer deleted');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Products
  async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const products = await dbService.find('bm_products', { organization_id: req.organizationId! });
      return sendSuccess(res, products);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const product = await dbService.create('bm_products', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, product, 'Product created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Invoices
  async getInvoices(req: AuthenticatedRequest, res: Response) {
    try {
      const invoices = await dbService.find('bm_invoices', { organization_id: req.organizationId! });
      return sendSuccess(res, invoices);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createInvoice(req: AuthenticatedRequest, res: Response) {
    try {
      const invNumber = req.body.invoice_number || `INV-${Date.now().toString().slice(-4)}`;
      const invoice = await dbService.create('bm_invoices', { ...req.body, invoice_number: invNumber, organization_id: req.organizationId! });
      return sendSuccess(res, invoice, 'Invoice created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Expenses
  async getExpenses(req: AuthenticatedRequest, res: Response) {
    try {
      const expenses = await dbService.find('bm_expenses', { organization_id: req.organizationId! });
      return sendSuccess(res, expenses);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createExpense(req: AuthenticatedRequest, res: Response) {
    try {
      const expense = await dbService.create('bm_expenses', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, expense, 'Expense recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Employees
  async getEmployees(req: AuthenticatedRequest, res: Response) {
    try {
      const employees = await dbService.find('bm_employees', { organization_id: req.organizationId! });
      return sendSuccess(res, employees);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createEmployee(req: AuthenticatedRequest, res: Response) {
    try {
      const employee = await dbService.create('bm_employees', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, employee, 'Employee added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Orders
  async getOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await dbService.find('bm_orders', { organization_id: req.organizationId! });
      return sendSuccess(res, orders);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await dbService.create('bm_orders', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, order, 'Order created', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Appointments
  async getAppointments(req: AuthenticatedRequest, res: Response) {
    try {
      const appointments = await dbService.find('bm_appointments', { organization_id: req.organizationId! });
      return sendSuccess(res, appointments);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createAppointment(req: AuthenticatedRequest, res: Response) {
    try {
      const appointment = await dbService.create('bm_appointments', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, appointment, 'Appointment scheduled', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Payments
  async getPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const payments = await dbService.find('bm_payments', { organization_id: req.organizationId! });
      return sendSuccess(res, payments);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
  async createPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const payment = await dbService.create('bm_payments', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, payment, 'Payment recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
