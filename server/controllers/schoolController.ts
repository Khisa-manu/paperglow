import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const schoolController = {
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
};
