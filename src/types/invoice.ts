export type DocumentType = 'invoice' | 'quotation';

export type DocumentStatus = 
  | 'draft' 
  | 'pending'
  | 'unpaid' 
  | 'paid' 
  | 'overdue' 
  | 'sent' 
  | 'accepted' 
  | 'declined' 
  | 'converted';

export interface InvoiceLineItem {
  id: string;
  title?: string;
  description: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent?: number;
  taxRatePercent?: number;
  total?: number;
}

export interface CompanyDetails {
  name: string;
  companyName?: string;
  tagline?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId: string; // KRA PIN
  taxPin?: string;
  website?: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  branchName?: string;
  swiftCode?: string;
  mpesaPaybill?: string;
  mpesaAccount?: string;
  mpesaAccountNo?: string;
  mpesaTill?: string;
  logoUrl?: string;
}

export type BusinessDetails = CompanyDetails;

export interface CustomerDetails {
  id?: string;
  name: string;
  clientName?: string;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  country?: string;
  taxId?: string;
  taxPin?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName?: string;
  swiftCode?: string;
  mpesaPaybill?: string;
  mpesaAccountNo?: string;
  mpesaTill?: string;
}

export interface InvoiceDocument {
  id: string;
  documentType: DocumentType;
  type?: DocumentType;
  documentNumber: string;
  referenceNumber?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // Due date or validity date
  status: DocumentStatus;
  currency: string; // 'KES'
  
  company: CompanyDetails;
  business?: CompanyDetails;
  customer: CustomerDetails;
  
  items: InvoiceLineItem[];
  
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  taxRatePercent?: number;
  shippingFee?: number;
  
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  amountPaid?: number;
  
  notes?: string;
  paymentTerms?: string;
  paymentDetails?: PaymentDetails;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceMetrics {
  totalInvoicesCount: number;
  totalQuotationsCount: number;
  totalInvoicedKes: number;
  totalPaidKes: number;
  totalOutstandingKes: number;
  totalQuotationValueKes: number;
  paidCount: number;
  unpaidCount: number;
  acceptedQuotesCount: number;
}

export type DocumentStats = InvoiceMetrics;
