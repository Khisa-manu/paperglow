export type ClinicModule =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'queue'
  | 'consultations'
  | 'billing'
  | 'services'
  | 'staff'
  | 'documents'
  | 'notifications'
  | 'reports'
  | 'settings';

export interface ClinicProfile {
  name: string;
  tagline: string;
  kmpdcLicense: string;
  kraPin: string;
  county: string;
  locationAddress: string;
  phone: string;
  emergencyHotline: string;
  email: string;
  mpesaPaybill: string;
  mpesaAccountNumber: string;
  defaultConsultationFeeKes: number;
  specialistConsultationFeeKes: number;
  workingHours: string;
  emergencyService24x7: boolean;
  departments: string[];
}

export interface Patient {
  id: string;
  patientNumber: string; // e.g. CLN-2026-0182
  fullName: string;
  gender: 'Female' | 'Male' | 'Other';
  dateOfBirth: string;
  age: number;
  phone: string;
  email: string;
  nationalId: string;
  residentialArea: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: string[];
  chronicConditions: string[];
  paymentModePreference: 'Cash / M-Pesa' | 'SHA / NHIF' | 'Private Insurance';
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  dateRegistered: string;
  lastVisitDate: string;
  totalVisits: number;
  outstandingBalanceKes: number;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_queue'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType = 'Consultation' | 'Follow-up' | 'Review' | 'Vaccination' | 'Antenatal' | 'Emergency';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientNumber: string;
  patientPhone: string;
  practitionerId: string;
  practitionerName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 09:30 AM
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  reminderSent: boolean;
}

export type QueueStage = 'triage' | 'waiting' | 'in_consultation' | 'ready_for_billing' | 'completed';
export type QueuePriority = 'Normal' | 'Urgent' | 'Emergency';

export interface QueueItem {
  id: string;
  queueNumber: number;
  patientId: string;
  patientName: string;
  patientNumber: string;
  arrivalTime: string;
  triageCompleted: boolean;
  stage: QueueStage;
  priority: QueuePriority;
  assignedPractitionerId: string;
  assignedPractitionerName: string;
  consultingRoom: string;
  waitTimeMinutes: number;
  vitalSignsRecorded?: boolean;
}

export interface VitalSigns {
  bpSystolic: number; // mmHg
  bpDiastolic: number; // mmHg
  pulseRate: number; // bpm
  temperatureCelsius: number; // °C
  respiratoryRate: number; // breaths/min
  oxygenSaturationSpO2: number; // %
  weightKg: number; // kg
  heightCm: number; // cm
  bmi: number;
  recordedAt: string;
  recordedBy: string;
}

export interface PrescriptionItem {
  drugName: string;
  dosage: string;
  frequency: string; // e.g. 1 tab tid (3 times daily)
  durationDays: number;
  instructions: string; // e.g. Take after meals
}

export interface ConsultationRecord {
  id: string;
  visitNumber: string;
  patientId: string;
  patientName: string;
  patientNumber: string;
  patientAge: number;
  patientGender: string;
  practitionerId: string;
  practitionerName: string;
  practitionerRole: string;
  date: string;
  time: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitals: VitalSigns;
  examinationFindings: string;
  clinicalImpressionDiagnosis: string; // User entered, NOT automated
  treatmentPlan: string;
  prescriptions: PrescriptionItem[];
  labRequests: string[];
  followUpDate?: string;
  clinicalNotes: string;
  consultationFeeKes: number;
  billed: boolean;
}

export interface MedicalService {
  id: string;
  code: string;
  name: string;
  category: 'Consultation' | 'Laboratory' | 'Diagnostics' | 'Nursing & Procedures' | 'Dispensary';
  priceKes: number;
  defaultPractitionerRole: string;
  turnaroundTime: string;
  description: string;
  active: boolean;
}

export type StaffRole =
  | 'Doctor / Physician'
  | 'Clinical Officer'
  | 'Registered Nurse'
  | 'Receptionist'
  | 'Lab Technologist'
  | 'Clinic Administrator';

export interface StaffMember {
  id: string;
  staffNumber: string;
  fullName: string;
  role: StaffRole;
  department: string;
  qualification: string;
  kmpdcRegistrationNo?: string;
  phone: string;
  email: string;
  consultingRoom?: string;
  scheduleDays: string[];
  shiftHours: string;
  onDuty: boolean;
  status: 'Available' | 'In Consultation' | 'Off Duty' | 'On Leave';
  totalConsultationsCompleted: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitPriceKes: number;
  amountKes: number;
}

export type PaymentMethod = 'M-Pesa' | 'Cash' | 'Credit Card' | 'SHA / NHIF' | 'Private Insurance';
export type InvoiceStatus = 'paid' | 'partial' | 'pending';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0812
  patientId: string;
  patientName: string;
  patientNumber: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalKes: number;
  discountKes: number;
  totalAmountKes: number;
  amountPaidKes: number;
  balanceKes: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  servedBy: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientNumber: string;
  date: string;
  amountPaidKes: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  receivedBy: string;
}

export type DocumentType =
  | 'medical_summary'
  | 'sick_off'
  | 'referral'
  | 'lab_request'
  | 'receipt';

export interface ClinicDocument {
  id: string;
  documentNumber: string;
  patientId: string;
  patientName: string;
  patientNumber: string;
  type: DocumentType;
  title: string;
  issuedDate: string;
  practitionerName: string;
  practitionerRole: string;
  summary: string;
  content: {
    diagnosisNotice?: string;
    recommendedRestDays?: number;
    excusedStartDate?: string;
    excusedEndDate?: string;
    referredFacility?: string;
    reasonForReferral?: string;
    specialistType?: string;
    investigationsOrdered?: string[];
    clinicalRemarks?: string;
  };
}

export interface ClinicNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'queue' | 'payment' | 'followup' | 'announcement';
  date: string;
  targetRole: string;
  isRead: boolean;
}
