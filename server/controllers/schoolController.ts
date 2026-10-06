import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const schoolController = {
  // Students
  async getStudents(req: AuthenticatedRequest, res: Response) {
    try {
      const students = await dbService.find('school_students', { organization_id: req.organizationId! });
      return sendSuccess(res, students);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createStudent(req: AuthenticatedRequest, res: Response) {
    try {
      const adm = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
      const student = await dbService.create('school_students', {
        ...req.body,
        admission_number: req.body.admission_number || adm,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, student, 'Student admitted', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updateStudent(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('school_students', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Student updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async deleteStudent(req: AuthenticatedRequest, res: Response) {
    try {
      await dbService.delete('school_students', req.params.id, req.organizationId!);
      return sendSuccess(res, true, 'Student deleted');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Classes
  async getClasses(req: AuthenticatedRequest, res: Response) {
    try {
      const classes = await dbService.find('school_classes', { organization_id: req.organizationId! });
      return sendSuccess(res, classes);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createClass(req: AuthenticatedRequest, res: Response) {
    try {
      const cls = await dbService.create('school_classes', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, cls, 'Class added', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Teachers
  async getTeachers(req: AuthenticatedRequest, res: Response) {
    try {
      const teachers = await dbService.find('school_teachers', { organization_id: req.organizationId! });
      return sendSuccess(res, teachers);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const teacher = await dbService.create('school_teachers', { ...req.body, organization_id: req.organizationId! });
      return sendSuccess(res, teacher, 'Teacher registered', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  // Fee payments
  async getFeePayments(req: AuthenticatedRequest, res: Response) {
    try {
      const payments = await dbService.find('school_fee_payments', { organization_id: req.organizationId! });
      return sendSuccess(res, payments);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createFeePayment(req: AuthenticatedRequest, res: Response) {
    try {
      const receiptNo = `RCT-SCH-${Math.floor(1000 + Math.random() * 9000)}`;
      const payment = await dbService.create('school_fee_payments', {
        ...req.body,
        receipt_number: req.body.receipt_number || receiptNo,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, payment, 'Fee payment recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
