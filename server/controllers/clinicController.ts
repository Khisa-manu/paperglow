import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const clinicController = {
  async getPatients(req: AuthenticatedRequest, res: Response) {
    try {
      const patients = await dbService.find('clinic_patients', { organization_id: req.organizationId! });
      return sendSuccess(res, patients);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createPatient(req: AuthenticatedRequest, res: Response) {
    try {
      const opd = `OPD-${Math.floor(1000 + Math.random() * 9000)}`;
      const patient = await dbService.create('clinic_patients', {
        ...req.body,
        opd_number: req.body.opd_number || opd,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, patient, 'Patient registered', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async updatePatient(req: AuthenticatedRequest, res: Response) {
    try {
      const updated = await dbService.update('clinic_patients', req.params.id, req.body, req.organizationId!);
      return sendSuccess(res, updated, 'Patient updated');
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async getAppointments(req: AuthenticatedRequest, res: Response) {
    try {
      const appointments = await dbService.find('clinic_appointments', { organization_id: req.organizationId! });
      return sendSuccess(res, appointments);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createAppointment(req: AuthenticatedRequest, res: Response) {
    try {
      const appointment = await dbService.create('clinic_appointments', {
        ...req.body,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, appointment, 'Appointment booked', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async getVisits(req: AuthenticatedRequest, res: Response) {
    try {
      const visits = await dbService.find('clinic_visits', { organization_id: req.organizationId! });
      return sendSuccess(res, visits);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },

  async createVisit(req: AuthenticatedRequest, res: Response) {
    try {
      const visitNum = `VST-${Math.floor(1000 + Math.random() * 9000)}`;
      const visit = await dbService.create('clinic_visits', {
        ...req.body,
        visit_number: req.body.visit_number || visitNum,
        organization_id: req.organizationId!,
      });
      return sendSuccess(res, visit, 'Visit recorded', 201);
    } catch (e: any) { return sendError(res, e.message, 500); }
  },
};
