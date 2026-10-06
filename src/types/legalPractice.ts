export type LegalModule =
  | 'dashboard'
  | 'matters'
  | 'clients'
  | 'court_deadlines'
  | 'documents'
  | 'tasks'
  | 'time_tracking'
  | 'billing'
  | 'calendar'
  | 'communications'
  | 'reports'
  | 'team'
  | 'settings';

export type MatterStatus =
  | 'open'
  | 'in_trial'
  | 'pending_court'
  | 'settlement'
  | 'closed'
  | 'on_hold';

export type MatterType =
  | 'Commercial Litigation'
  | 'Conveyancing & Real Estate'
  | 'Employment & Labour Relations'
  | 'Corporate & M&A'
  | 'Family & Succession'
  | 'Constitutional & Judicial Review'
  | 'Banking & Finance'
  | 'Intellectual Property';

export type ClientType = 'Individual' | 'Company / Corporate' | 'Government / Statutory';

export type CourtForum =
  | 'Supreme Court of Kenya'
  | 'Court of Appeal (Nairobi)'
  | 'High Court (Commercial & Tax Division)'
  | 'High Court (Civil Division)'
  | 'Environment and Land Court (ELC)'
  | 'Employment and Labour Relations Court (ELRC)'
  | 'Chief Magistrate Commercial Court (Milimani)'
  | 'Tax Appeals Tribunal (TAT)';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'under_review' | 'completed';

export type InvoiceStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue';
export type PaymentMethod = 'mpesa_paybill' | 'rtgs_wire' | 'bank_cheque' | 'cash';

export type StaffRole =
  | 'Managing Partner'
  | 'Senior Partner'
  | 'Senior Associate Advocate'
  | 'Associate Advocate'
  | 'Pupil / Legal Assistant'
  | 'Litigation Clerk'
  | 'Finance & Admin';

export interface LegalStaff {
  id: string;
  name: string;
  role: StaffRole;
  lskNumber?: string; // Law Society of Kenya Roll of Advocates number
  email: string;
  phone: string;
  hourlyRateKes: number;
  activeMattersCount: number;
  avatarUrl?: string;
  permissions: {
    canSignPleadings: boolean;
    canIssueInvoices: boolean;
    canViewFinancials: boolean;
    canDeleteDocuments: boolean;
    canManageTeam: boolean;
  };
}

export interface LegalClient {
  id: string;
  clientNumber: string;
  name: string;
  clientType: ClientType;
  contactPerson?: string;
  email: string;
  phone: string;
  idOrRegNumber: string; // National ID or Company Reg / KRA PIN
  address: string;
  city: string;
  notes: string;
  totalBilledKes: number;
  outstandingBalanceKes: number;
  createdAt: string;
}

export interface MatterTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  performedBy: string;
  category: 'pleading' | 'court_appearance' | 'ruling' | 'client_meeting' | 'settlement' | 'billing';
}

export interface LegalMatter {
  id: string;
  matterNumber: string; // e.g. HCCOMM/E412/2026
  title: string;
  clientId: string;
  clientName: string;
  clientType: ClientType;
  matterType: MatterType;
  courtForum?: CourtForum;
  courtDivision?: string;
  assignedAdvocateId: string;
  assignedAdvocateName: string;
  secondChairAdvocateId?: string;
  secondChairAdvocateName?: string;
  status: MatterStatus;
  filingDate: string;
  nextCourtDate?: string;
  nextCourtPurpose?: string; // Hearing, Mention, Judgment, Directions
  opposingParty?: string;
  opposingCounsel?: string;
  caseJudge?: string;
  disputeValueKes?: number;
  description: string;
  notes: string;
  totalBilledKes: number;
  totalPaidKes: number;
  outstandingBalanceKes: number;
  totalHoursRecorded: number;
  timeline: MatterTimelineEvent[];
  updatedAt: string;
}

export interface CourtHearingEvent {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  courtForum: CourtForum;
  courtRoom: string;
  presidingJudge: string;
  hearingType: 'Hearing' | 'Mention for Directions' | 'Ruling' | 'Judgment' | 'Pre-Trial Conference' | 'Formal Hearing';
  date: string;
  time: string;
  advocateInCharge: string;
  isVirtualCourt: boolean;
  virtualCourtLink?: string;
  reminderSent: boolean;
  notes?: string;
  status: 'upcoming' | 'completed' | 'adjourned' | 'vacated';
}

export interface LegalDeadline {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  title: string;
  deadlineType: 'Court Filing Deadline' | 'Statutory Limitation' | 'Submissions Due' | 'Client Response' | 'Discovery' | 'Stamp Duty & Registry';
  dueDate: string;
  assignedTo: string;
  isCompleted: boolean;
  priority: TaskPriority;
  notes?: string;
}

export interface LegalDocument {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  title: string;
  category:
    | 'Pleadings & Plaints'
    | 'Affidavits & Exhibits'
    | 'Court Rulings & Orders'
    | 'Commercial Contracts & Deeds'
    | 'Legal Opinions & Research'
    | 'Client ID & KYCLegals'
    | 'Correspondence & Letters';
  fileName: string;
  fileSize: string;
  fileType: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  summary: string;
  downloadUrl?: string;
}

export interface LegalTask {
  id: string;
  matterId?: string;
  matterNumber?: string;
  matterTitle?: string;
  title: string;
  description: string;
  assignedStaffId: string;
  assignedStaffName: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface TimeEntry {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  staffId: string;
  staffName: string;
  activityDate: string;
  durationMinutes: number; // e.g. 90 = 1.5 hrs
  hourlyRateKes: number;
  totalAmountKes: number;
  isBillable: boolean;
  description: string;
  activityCategory:
    | 'Court Appearance'
    | 'Drafting Pleadings'
    | 'Legal Research'
    | 'Client Consultation'
    | 'Opposing Counsel Negotiation'
    | 'Registry Filing & Service'
    | 'Document Review';
  invoiced: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  itemType: 'Professional Fees' | 'Disbursement / Court Fees' | 'Filing & Registry Expense' | 'Process Service';
  units: number; // hours or count
  rateKes: number;
  amountKes: number;
}

export interface LegalInvoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-081
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalKes: number;
  vatRatePercent: number; // 16% in Kenya
  vatAmountKes: number;
  disbursementsTotalKes: number;
  grandTotalKes: number;
  amountPaidKes: number;
  balanceDueKes: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  notes?: string;
}

export interface ClientCommunication {
  id: string;
  clientId: string;
  clientName: string;
  matterId?: string;
  matterNumber?: string;
  channel: 'Phone Call' | 'In-Person Conference' | 'Formal Letter' | 'Email' | 'WhatsApp / SMS';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  timestamp: string;
  advocateName: string;
  followUpDate?: string;
  followUpCompleted?: boolean;
}

export interface LawFirmSettings {
  firmName: string;
  tagline: string;
  lskFirmRegistration: string;
  kraPin: string;
  physicalOffice: string;
  postalAddress: string;
  city: string;
  telephone: string;
  email: string;
  website: string;
  defaultCurrency: string;
  standardVatPercent: number;
  defaultBillingHourlyRateKes: number;
  trustAccountBank: string;
  trustAccountNo: string;
  mpesaPaybill: string;
  mpesaAccountRef: string;
  courtRemindersSms: boolean;
  deadlineAlertsEmail: boolean;
}
