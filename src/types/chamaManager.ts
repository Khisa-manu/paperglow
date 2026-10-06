export type ChamaModule =
  | 'dashboard'
  | 'group'
  | 'members'
  | 'documents'
  | 'contributions'
  | 'loans'
  | 'welfare'
  | 'meetings'
  | 'finance'
  | 'assets'
  | 'reports'
  | 'notifications'
  | 'roles';

export type MemberRole =
  | 'Chairperson'
  | 'Vice-Chairperson'
  | 'Secretary'
  | 'Treasurer'
  | 'Welfare Coordinator'
  | 'Committee Member'
  | 'Member';

export type MemberStatus = 'active' | 'probation' | 'dormant' | 'exited';

export interface Member {
  id: string;
  membershipNumber: string; // e.g. "UB-001"
  fullName: string;
  email: string;
  phone: string;
  idNumber: string; // Kenyan National ID
  residentialArea: string;
  occupation: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  role: MemberRole;
  status: MemberStatus;
  dateJoined: string;
  avatarUrl?: string;
  totalContributionsKes: number;
  currentLoanBalanceKes: number;
  welfareContributionsKes: number;
  sharesUnits: number;
  notes?: string;
}

export interface GroupProfile {
  name: string;
  tagline: string;
  registrationNumber: string; // e.g., "REG/KOP/2018/0942"
  county: string;
  subCounty: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  mpesaPaybill: string;
  mpesaAccountNumber: string;
  monthlyContributionKes: number;
  monthlyWelfareKes: number;
  latePenaltyKes: number;
  loanInterestRatePercent: number; // e.g., 10%
  loanMaxMultiplier: number; // e.g., 3x savings
  loanMaxDurationMonths: number;
  welfareBereavementCoverKes: number;
  welfareHospitalCoverKes: number;
  chairpersonName: string;
  secretaryName: string;
  treasurerName: string;
  patronName?: string;
  yearEstablished: number;
  objectives: string[];
}

export interface ContributionRecord {
  id: string;
  memberId: string;
  memberName: string;
  membershipNumber: string;
  month: string; // "October 2026"
  year: number;
  amountKes: number;
  welfareKes: number;
  penaltyKes: number;
  totalPaidKes: number;
  paymentDate: string;
  paymentMethod: 'mpesa' | 'bank_transfer' | 'cash' | 'cheque';
  transactionReference: string; // e.g., "QHL987123"
  recordedBy: string;
  status: 'confirmed' | 'pending_verification';
}

export interface LoanRecord {
  id: string;
  memberId: string;
  memberName: string;
  membershipNumber: string;
  loanType: 'Emergency Loan' | 'Development Loan' | 'School Fees Loan' | 'Business Booster';
  principalAmountKes: number;
  interestRatePercent: number;
  interestAmountKes: number;
  totalRepayableKes: number;
  durationMonths: number;
  monthlyInstallmentKes: number;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  status: 'pending_approval' | 'approved' | 'active' | 'cleared' | 'defaulted' | 'rejected';
  amountRepaidKes: number;
  balanceKes: number;
  guarantors: { memberId: string; memberName: string; amountPledgedKes: number }[];
  purpose: string;
  repayments: {
    id: string;
    date: string;
    amountKes: number;
    reference: string;
    method: 'mpesa' | 'bank_transfer' | 'cash';
  }[];
}

export interface WelfareClaim {
  id: string;
  memberId: string;
  memberName: string;
  membershipNumber: string;
  claimType: 'Bereavement' | 'Hospitalization' | 'Maternity / Paternity' | 'Disaster Relief';
  description: string;
  amountRequestedKes: number;
  amountApprovedKes: number;
  requestDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  status: 'pending' | 'approved' | 'disbursed' | 'rejected';
  approvedBy?: string;
  recipientName: string;
  paymentReference?: string;
}

export interface Meeting {
  id: string;
  title: string;
  meetingType: 'Monthly General Meeting' | 'AGM (Annual General Meeting)' | 'Executive Committee' | 'Emergency Meeting';
  date: string;
  time: string;
  venue: string; // e.g. "PrideInn Westlands / Zoom"
  status: 'scheduled' | 'completed' | 'canceled';
  agenda: string[];
  minutesSummary?: string;
  actionItems?: { task: string; assignee: string; deadline: string; done: boolean }[];
  attendance: {
    memberId: string;
    memberName: string;
    present: boolean;
    apology: boolean;
    finePaidKes?: number;
  }[];
}

export interface CashTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category:
    | 'Member Contributions'
    | 'Loan Repayments'
    | 'Loan Interest'
    | 'Registration Fees'
    | 'Fines & Penalties'
    | 'Dividend Payout'
    | 'Loan Disbursement'
    | 'Welfare Payout'
    | 'Bank Charges'
    | 'Meeting Refreshments'
    | 'Administrative & Legal'
    | 'Asset Acquisition';
  amountKes: number;
  description: string;
  reference: string;
  recordedBy: string;
  approvedBy?: string;
}

export interface GroupAsset {
  id: string;
  name: string;
  category: 'Land & Real Estate' | 'Money Market Fund' | 'Treasury Bills' | 'Equipment / Furniture' | 'Fixed Deposit';
  purchaseDate: string;
  purchaseCostKes: number;
  currentValuationKes: number;
  location: string;
  documentNumber: string; // e.g., Title Deed No, Account No
  status: 'active' | 'sold' | 'maturing';
  notes: string;
}

export interface ChamaNotification {
  id: string;
  title: string;
  message: string;
  type: 'contribution_reminder' | 'meeting' | 'loan_due' | 'welfare' | 'announcement';
  date: string;
  targetRole?: MemberRole | 'all';
  isRead: boolean;
}

export interface MembershipCertificateData {
  certificateNumber: string;
  member: Member;
  group: GroupProfile;
  issueDate: string;
  expiryDate?: string;
  chairpersonSignature: string;
  secretarySignature: string;
  qrVerificationUrl: string;
}

export interface MembershipIdCardData {
  idNumber: string;
  member: Member;
  group: GroupProfile;
  issueDate: string;
  validUntil: string;
  qrVerificationUrl: string;
}
