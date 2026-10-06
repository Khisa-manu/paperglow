export type AppViewType =
  | 'home'
  | 'applications'
  | 'application-detail'
  | 'account'
  | 'branding'
  | 'invoice-generator'
  | 'business-manager'
  | 'property-manager'
  | 'pharmacy-manager'
  | 'party-manager'
  | 'ticketing'
  | 'booking'
  | 'stock-inventory'
  | 'legal-practice'
  | 'school-manager'
  | 'chama-manager'
  | 'clinic-manager';

export interface NavAppItem {
  id: string;
  name: string;
  shortDesc: string;
  category:
    | 'Business'
    | 'Property'
    | 'Healthcare'
    | 'Groups'
    | 'Professional'
    | 'Education'
    | 'Operations';
  view?: AppViewType;
  catalogAppId: string;
  featured?: boolean;
  badge?: string;
}

export const APP_NAV_CATEGORIES: Array<{
  id: NavAppItem['category'];
  label: string;
  description: string;
}> = [
  {
    id: 'Business',
    label: 'Business',
    description: 'Core operations, invoicing, CRM & stock',
  },
  {
    id: 'Property',
    label: 'Property',
    description: 'Real estate, rent & tenant leases',
  },
  {
    id: 'Healthcare',
    label: 'Healthcare',
    description: 'Dispensary POS & outpatient clinic',
  },
  {
    id: 'Groups',
    label: 'Groups',
    description: 'Chamas, SACCOs & member organizations',
  },
  {
    id: 'Professional',
    label: 'Professional',
    description: 'Law firm matters, dockets & contracts',
  },
  {
    id: 'Education',
    label: 'Education',
    description: 'Admissions, academics & fee collection',
  },
  {
    id: 'Operations',
    label: 'Operations',
    description: 'Scheduling, support desk & team boards',
  },
];

export const CATEGORIZED_NAV_APPS: NavAppItem[] = [
  // Business — Business Manager, Invoice, CRM, Inventory
  {
    id: 'nav-business-manager',
    name: 'Business Manager',
    shortDesc: 'All-in-one sales, POS, M-Pesa, stock & payroll',
    category: 'Business',
    view: 'business-manager',
    catalogAppId: 'paperglow-business-manager',
    featured: true,
    badge: 'Flagship',
  },
  {
    id: 'nav-invoice',
    name: 'Invoice',
    shortDesc: 'Instant branded invoices, quotes & PDF receipts',
    category: 'Business',
    view: 'invoice-generator',
    catalogAppId: 'paperglow-invoice-generator',
    featured: true,
  },
  {
    id: 'nav-crm',
    name: 'CRM',
    shortDesc: 'Client pipelines, deals & follow-up automation',
    category: 'Business',
    catalogAppId: 'paperglow-crm',
  },
  {
    id: 'nav-inventory',
    name: 'Inventory',
    shortDesc: 'Multi-store stock control, LPOs & reorder alerts',
    category: 'Business',
    view: 'stock-inventory',
    catalogAppId: 'paperglow-stock-inventory',
    featured: true,
  },

  // Property — Property Manager
  {
    id: 'nav-property-manager',
    name: 'Property Manager',
    shortDesc: 'Units, tenants, rent collection & arrears ledger',
    category: 'Property',
    view: 'property-manager',
    catalogAppId: 'paperglow-property-manager',
    featured: true,
  },

  // Healthcare — Pharmacy Manager, Clinic Manager
  {
    id: 'nav-pharmacy-manager',
    name: 'Pharmacy Manager',
    shortDesc: 'Batch expiry alerts, dispensary POS & FEFO stock',
    category: 'Healthcare',
    view: 'pharmacy-manager',
    catalogAppId: 'paperglow-pharmacy-manager',
    featured: true,
  },
  {
    id: 'nav-clinic-manager',
    name: 'Clinic Manager',
    shortDesc: 'Patient triage queue, consultations, vitals & SHA',
    category: 'Healthcare',
    view: 'clinic-manager',
    catalogAppId: 'paperglow-clinic-manager',
  },

  // Groups — Chama Manager, Organization Manager
  {
    id: 'nav-chama-manager',
    name: 'Chama Manager',
    shortDesc: 'Member contributions, table banking loans & welfare',
    category: 'Groups',
    view: 'chama-manager',
    catalogAppId: 'paperglow-chama-manager',
    featured: true,
  },
  {
    id: 'nav-organization-manager',
    name: 'Organization Manager',
    shortDesc: 'National & county branches, membership & compliance',
    category: 'Groups',
    view: 'party-manager',
    catalogAppId: 'paperglow-party-manager',
  },

  // Professional — Legal Practice Manager, Contracts
  {
    id: 'nav-legal-practice',
    name: 'Legal Practice Manager',
    shortDesc: 'Court dockets, case files, deadlines & advocate trust',
    category: 'Professional',
    view: 'legal-practice',
    catalogAppId: 'paperglow-legal-practice',
  },
  {
    id: 'nav-contracts',
    name: 'Contracts',
    shortDesc: 'Digital agreements, e-signatures & audit trails',
    category: 'Professional',
    catalogAppId: 'paperglow-contracts',
  },

  // Education — School Manager
  {
    id: 'nav-school-manager',
    name: 'School Manager',
    shortDesc: 'Student admissions, CBC/8-4-4 exams & fee receipts',
    category: 'Education',
    view: 'school-manager',
    catalogAppId: 'paperglow-school-manager',
  },

  // Operations — Booking, Ticketing, Team
  {
    id: 'nav-booking',
    name: 'Booking',
    shortDesc: 'Online appointments, staff calendars & deposits',
    category: 'Operations',
    view: 'booking',
    catalogAppId: 'paperglow-booking',
  },
  {
    id: 'nav-ticketing',
    name: 'Ticketing',
    shortDesc: 'Customer support desk, SLA queues & event passes',
    category: 'Operations',
    view: 'ticketing',
    catalogAppId: 'paperglow-ticketing',
  },
  {
    id: 'nav-team',
    name: 'Team',
    shortDesc: 'Kanban boards, milestones & cross-team tasks',
    category: 'Operations',
    catalogAppId: 'paperglow-team-board',
  },
];

export const WORKSPACE_VIEWS: AppViewType[] = [
  'business-manager',
  'property-manager',
  'pharmacy-manager',
  'party-manager',
  'ticketing',
  'booking',
  'stock-inventory',
  'legal-practice',
  'school-manager',
  'chama-manager',
  'clinic-manager',
  'invoice-generator',
];
