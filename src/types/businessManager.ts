export type BMModule =
  | 'dashboard'
  | 'sales'
  | 'inventory'
  | 'customers'
  | 'expenses'
  | 'reports'
  | 'employees'
  | 'orders'
  | 'messages'
  | 'payments'
  | 'settings';

export type BMDocumentType = 'invoice' | 'quotation' | 'receipt';

export type BMDocumentStatus =
  | 'draft'
  | 'unpaid'
  | 'paid'
  | 'overdue'
  | 'sent'
  | 'accepted'
  | 'cancelled';

export interface BMDocumentLineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxRatePercent: number;
  total: number;
}

export interface BMSalesDocument {
  id: string;
  documentNumber: string;
  documentType: BMDocumentType;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerKraPin?: string;
  issueDate: string;
  dueDate: string;
  items: BMDocumentLineItem[];
  subtotal: number;
  taxRate: number; // e.g. 16 for 16%
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  amountPaid: number;
  notes: string;
  paymentTerms: string;
  status: BMDocumentStatus;
  paymentMethod?: string;
  paidAt?: string;
}

// Convenient aliases for Business Manager module
export type SalesDocument = BMSalesDocument;
export type DocumentLineItem = BMDocumentLineItem;

export type InventoryType = 'product' | 'service';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  type: InventoryType;
  category: string;
  stockQuantity: number;
  minStockThreshold: number;
  buyingPrice: number;
  sellingPrice: number;
  unit: string; // 'pcs', 'box', 'hours', 'reams', 'units'
  description: string;
  lastAdjusted: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  adjustmentType: 'restock' | 'damage' | 'recount' | 'return';
  quantityChange: number;
  newQuantity: number;
  reason: string;
  adjustedBy: string;
  date: string;
}

export interface CustomerNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  kraPin: string;
  outstandingBalance: number;
  totalSpent: number;
  notes: CustomerNote[];
  createdAt: string;
}

export type ExpenseCategory =
  | 'Rent & Utilities'
  | 'Payroll & Wages'
  | 'Raw Materials & Inventory'
  | 'Logistics & Delivery'
  | 'Software & Tech'
  | 'Marketing & Ads'
  | 'Office Supplies & Welfare'
  | 'Equipment & Maintenance'
  | 'Taxes & Compliance'
  | 'Miscellaneous';

export interface ExpenseRecord {
  id: string;
  voucherNumber: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  payee: string;
  paymentMethod: string;
  status: 'Paid' | 'Pending';
  receiptAttached?: boolean;
}

export type EmployeeRole =
  | 'Operations Manager'
  | 'Senior Sales Consultant'
  | 'Lead Designer'
  | 'Inventory & Logistics Officer'
  | 'Accountant / Cashier'
  | 'Production Technician'
  | 'Customer Support Lead';

export interface Employee {
  id: string;
  fullName: string;
  role: EmployeeRole;
  department: string;
  email: string;
  phone: string;
  baseSalary: number;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  todayStatus: 'Clocked In' | 'Clocked Out' | 'Off Duty';
  clockInTime?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day';
  notes?: string;
}

export type OrderAppointmentType = 'order' | 'appointment';
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface BusinessOrder {
  id: string;
  orderNumber: string;
  type: OrderAppointmentType;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  title: string;
  status: OrderStatus;
  scheduledDate: string;
  timeSlot?: string;
  assignedEmployee: string;
  totalAmount: number;
  depositPaid: number;
  notes?: string;
  createdAt: string;
}

export type MessageChannel = 'sms' | 'whatsapp' | 'email';

export interface MessageTemplate {
  id: string;
  title: string;
  category: 'invoice' | 'order' | 'appointment' | 'general';
  text: string;
}

export interface CustomerMessage {
  id: string;
  customerId?: string;
  customerName: string;
  recipientContact: string;
  channel: MessageChannel;
  subject?: string;
  content: string;
  status: 'sent' | 'queued' | 'simulated';
  sentAt: string;
}

export type PaymentMethod =
  | 'mpesa_paybill'
  | 'mpesa_till'
  | 'bank_transfer'
  | 'cash'
  | 'credit_card'
  | 'cheque';

export type PaymentStatus =
  | 'completed'
  | 'pending_verification'
  | 'reconciled'
  | 'failed';

export interface PaymentTransaction {
  id: string;
  transactionReference: string;
  documentId?: string;
  documentNumber?: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionDate: string;
  mpesaCode?: string;
  phoneNumber?: string;
  notes?: string;
}

export interface BusinessSettings {
  businessName: string;
  legalTradingName: string;
  tagline: string;
  logoUrl: string;
  email: string;
  phone: string;
  physicalAddress: string;
  city: string;
  county: string;
  kraPin: string;
  website: string;
  currency: string;
  currencySymbol: string;
  vatRatePercent: number;
  enableVat: boolean;
  invoicePrefix: string;
  quotationPrefix: string;
  receiptPrefix: string;
  orderPrefix: string;
  voucherPrefix: string;
  defaultPaymentTerms: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    swiftCode: string;
  };
  mpesaDetails: {
    paybillNumber: string;
    accountNumber: string;
    tillNumber: string;
  };
  integrations: {
    mpesaDarajaConnected: boolean;
    whatsappApiConnected: boolean;
    smsGatewayConnected: boolean;
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: BMModule;
  detail: string;
}
