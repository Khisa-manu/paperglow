export type PMModule =
  | 'dashboard'
  | 'properties'
  | 'tenants'
  | 'rent'
  | 'leases'
  | 'maintenance'
  | 'expenses'
  | 'reports'
  | 'notifications';

export type PropertyType = 'apartment_building' | 'commercial' | 'gated_villas' | 'mixed_use';

export interface Property {
  id: string;
  name: string;
  propertyType: PropertyType;
  location: string; // e.g. "Kilimani, Nairobi"
  address: string;
  county: string;
  totalUnits: number;
  yearBuilt: number;
  caretakerName: string;
  caretakerPhone: string;
  amenities: string[];
  imageUrl: string;
  notes?: string;
}

export type UnitType =
  | 'Studio'
  | '1 Bedroom'
  | '2 Bedroom Master Ensuite'
  | '3 Bedroom'
  | 'Penthouse'
  | 'Commercial Office';

export type UnitStatus = 'occupied' | 'vacant' | 'under_maintenance';

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string; // e.g. "A102", "B4"
  floor: number;
  unitType: UnitType;
  monthlyRentKes: number;
  depositKes: number;
  status: UnitStatus;
  currentTenantId?: string;
  sizeSqFt: number;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string; // e.g. "+254 712 345 678"
  nationalIdOrPassport: string;
  emergencyContact: string;
  emergencyPhone: string;
  employer: string;
  propertyId: string;
  unitId: string;
  leaseId: string;
  balanceKes: number; // positive = owes, negative = prepaid, 0 = balanced
  moveInDate: string;
  status: 'active' | 'notice_given' | 'past';
  notes?: string;
}

export type LeaseStatus = 'active' | 'expiring_soon' | 'terminated' | 'month_to_month';

export interface Lease {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRentKes: number;
  depositKes: number;
  status: LeaseStatus;
  paymentDayOfMonth: number; // e.g. 5th of every month
  leaseDocumentTitle: string;
  termsText: string;
}

export type PaymentMethod = 'mpesa' | 'bank_eft' | 'cash' | 'cheque';

export interface RentPayment {
  id: string;
  receiptNumber: string; // e.g. "RCT-2026-0042"
  propertyId: string;
  unitId: string;
  tenantId: string;
  amountKes: number;
  monthFor: string; // e.g. "October 2026"
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionReference: string; // e.g. "QGH88129LK"
  status: 'confirmed' | 'pending';
  notes?: string;
}

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'borehole_water'
  | 'painting_structure'
  | 'appliance'
  | 'security';

export type MaintenancePriority = 'urgent' | 'high' | 'medium' | 'low';
export type MaintenanceStatus = 'reported' | 'in_progress' | 'resolved';

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string; // e.g. "MNT-2026-019"
  propertyId: string;
  unitId: string;
  tenantId?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedTo: string;
  estimatedCostKes: number;
  actualCostKes: number;
  reportedDate: string;
  resolvedDate?: string;
}

export type ExpenseCategory =
  | 'utilities'
  | 'security_guards'
  | 'caretaker_wages'
  | 'repairs_maintenance'
  | 'taxes_county_rates'
  | 'waste_management'
  | 'supplies';

export interface PropertyExpense {
  id: string;
  voucherNumber: string;
  propertyId: string;
  category: ExpenseCategory;
  description: string;
  amountKes: number;
  expenseDate: string;
  paidTo: string;
  paymentMethod: PaymentMethod;
  receiptAttachment?: string;
}

export interface PropertyNotification {
  id: string;
  title: string;
  message: string;
  type: 'rent_reminder' | 'lease_expiry' | 'maintenance_update' | 'general';
  date: string;
  read: boolean;
  propertyId?: string;
  tenantId?: string;
}

export interface PropertyManagerSettings {
  agencyName: string;
  contactEmail: string;
  contactPhone: string;
  mpesaPaybill: string;
  mpesaAccountFormat: string;
  bankName: string;
  bankAccount: string;
  bankBranch: string;
  currency: string;
  kraPin: string;
  signatureName: string;
}
