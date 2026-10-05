export type PartyModule =
  | 'dashboard'
  | 'organization'
  | 'members'
  | 'branches'
  | 'events'
  | 'tasks'
  | 'communications'
  | 'documents'
  | 'finance'
  | 'reports'
  | 'admin';

export type MemberStatus = 'active' | 'pending' | 'suspended' | 'expired' | 'honorary';
export type MemberTier = 'regular' | 'executive' | 'delegate' | 'youth_rep' | 'elder_council';
export type DuesStatus = 'paid' | 'overdue' | 'exempt' | 'partial';

export interface PartyMember {
  id: string;
  membershipNumber: string;
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  county: string;
  constituency: string;
  ward: string;
  branchId: string;
  department?: string;
  status: MemberStatus;
  tier: MemberTier;
  joinDate: string;
  expiryDate: string;
  duesStatus: DuesStatus;
  outstandingDues: number;
  lastDuesPaymentDate?: string;
  notes?: string;
  roles?: string[];
}

export interface PartyBranch {
  id: string;
  code: string;
  name: string;
  region: string;
  county: string;
  officeAddress: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  memberCount: number;
  status: 'active' | 'provisional' | 'restructuring';
  establishedDate: string;
  budgetAllocation: number;
  spentBudget: number;
}

export interface PartyDepartment {
  id: string;
  name: string;
  code: string;
  leadName: string;
  leadTitle: string;
  memberCount: number;
  description: string;
  contactEmail: string;
}

export type EventType =
  | 'national_nec'
  | 'branch_agm'
  | 'caucuses'
  | 'county_delegate'
  | 'executive_briefing'
  | 'committee_session';

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  status: 'pending' | 'done';
}

export interface PartyEvent {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  time: string;
  venue: string;
  branchId?: string;
  attendeesExpected: number;
  attendeesRecorded: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  agendaItems: string[];
  minutesSummary?: string;
  actionItems: ActionItem[];
}

export interface PartyTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  branchId?: string;
  department?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface PartyCommunication {
  id: string;
  title: string;
  messageType: 'circular' | 'executive_memo' | 'resolution' | 'announcement';
  channel: 'internal_portal' | 'sms_gateway' | 'email_blast' | 'whatsapp_notice';
  targetAudience: string;
  body: string;
  senderName: string;
  senderRole: string;
  sentAt: string;
  recipientCount: number;
  deliveryRate: number; // percentage
  status: 'sent' | 'draft' | 'scheduled';
}

export interface PartyDocument {
  id: string;
  title: string;
  category:
    | 'constitution_bylaws'
    | 'party_policy'
    | 'nec_resolutions'
    | 'meeting_minutes'
    | 'financial_audit'
    | 'compliance_return';
  branchId?: string;
  fileFormat: 'pdf' | 'doc' | 'sheet';
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  accessLevel: 'public_members' | 'delegates_only' | 'nec_executive_only';
  downloadCount: number;
  referenceNumber: string;
  description: string;
}

export interface PartyFinanceTransaction {
  id: string;
  referenceNo: string;
  type:
    | 'membership_dues'
    | 'contribution'
    | 'nomination_fee'
    | 'branch_grant'
    | 'office_expense'
    | 'event_logistics'
    | 'legal_compliance';
  direction: 'income' | 'expense';
  amount: number;
  date: string;
  partyOrMemberName: string;
  branchId?: string;
  paymentChannel: 'mpesa_paybill' | 'bank_transfer' | 'cheque' | 'direct_deposit';
  status: 'verified' | 'pending_audit' | 'flagged';
  description: string;
}

export interface PartyAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: PartyModule;
  details: string;
  ipAddress: string;
}

export interface PartyAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'secretary_general' | 'finance_director' | 'branch_coordinator' | 'auditor';
  branchId?: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

export interface PartyOrganizationSettings {
  name: string;
  abbreviation: string;
  slogan: string;
  registeredName: string;
  registrarRefNo: string;
  pinNumber: string;
  headquartersAddress: string;
  postalAddress: string;
  telephone: string;
  officialEmail: string;
  website: string;
  foundingYear: number;
  partyLeader: string;
  nationalChairperson: string;
  secretaryGeneral: string;
  nationalTreasurer: string;
  currency: 'KES';
  annualDuesAmount: number;
  paybillNumber: string;
  complianceStatus: 'fully_compliant' | 'pending_annual_return' | 'under_review';
}
