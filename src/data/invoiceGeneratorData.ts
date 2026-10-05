import {
  InvoiceDocument,
  CompanyDetails,
  CustomerDetails,
  InvoiceLineItem,
  InvoiceMetrics,
} from '../types/invoice';

export const DEFAULT_COMPANY_DETAILS: CompanyDetails = {
  name: 'Paperglow Creative Group Ltd',
  tagline: 'Business Applications & Commercial Branding Studio',
  email: 'billing@paperglow.co.ke',
  phone: '+254 712 345 678',
  address: '4th Floor, Kimathi House, Kimathi Street',
  city: 'Nairobi',
  country: 'Kenya',
  taxId: 'P051289192K', // Kenya Revenue Authority PIN
  website: 'www.paperglow.co.ke',
  bankName: 'KCB Bank Kenya Ltd (Nairobi Mega Branch)',
  bankAccountName: 'Paperglow Creative Group Ltd',
  bankAccountNumber: '1289045762',
  mpesaPaybill: '247247',
  mpesaAccount: '0712345678',
};

export const DEMO_CUSTOMERS: CustomerDetails[] = [
  {
    id: 'cust-1',
    name: 'Apex Logistics Kenya Ltd',
    contactPerson: 'David Mwangi',
    email: 'accounts@apexlogistics.co.ke',
    phone: '+254 722 100 200',
    address: 'Apex Tower, Mombasa Road, Industrial Area',
    city: 'Nairobi',
    taxId: 'P058190334M',
  },
  {
    id: 'cust-2',
    name: 'Kifaru Safari Lodges & Camps',
    contactPerson: 'Sarah Njeri',
    email: 'finance@kifarusafaris.com',
    phone: '+254 733 456 789',
    address: 'Kifaru House, Karen Road',
    city: 'Nairobi',
    taxId: 'P051928374L',
  },
  {
    id: 'cust-3',
    name: 'Mara Tech Hub Nairobi',
    contactPerson: 'Brian Otieno',
    email: 'ops@maratechhub.io',
    phone: '+254 710 987 654',
    address: 'Ngong Lane Office Park, Kilimani',
    city: 'Nairobi',
    taxId: 'P053891024K',
  },
  {
    id: 'cust-4',
    name: 'Savannah Agritech Corp',
    contactPerson: 'Grace Wanjiku',
    email: 'procurement@savannahagri.co.ke',
    phone: '+254 701 234 567',
    address: 'Westlands Commercial Square, Ring Road',
    city: 'Nairobi',
    taxId: 'P057819234R',
  },
  {
    id: 'cust-5',
    name: 'Urban Brew Coffeehouse',
    contactPerson: 'Michael Kariuki',
    email: 'manager@urbanbrew.co.ke',
    phone: '+254 790 112 233',
    address: 'Ground Floor, Galleria Mall, Langata',
    city: 'Nairobi',
    taxId: 'P056473829T',
  },
];

export const PRESET_LINE_ITEMS = [
  {
    description: 'Corporate Brand Identity & Visual Guidelines',
    category: 'Design Services',
    unitPrice: 75000,
    taxPercent: 16,
  },
  {
    description: 'Branded Heavyweight Crew T-Shirts (280 GSM)',
    category: 'Custom Apparel',
    unitPrice: 1200,
    taxPercent: 16,
  },
  {
    description: 'Embroidered Executive Polo Shirts',
    category: 'Workwear & Uniforms',
    unitPrice: 1850,
    taxPercent: 16,
  },
  {
    description: 'Retractable Pull-Up Banner Stand (33" x 81")',
    category: 'Signage & Displays',
    unitPrice: 9500,
    taxPercent: 16,
  },
  {
    description: 'Triple-Thick Uncoated Cotton Business Cards (500 pcs)',
    category: 'Print Collateral',
    unitPrice: 12500,
    taxPercent: 16,
  },
  {
    description: 'Monthly SaaS Business Workspace License',
    category: 'Software & Tech',
    unitPrice: 4900,
    taxPercent: 16,
  },
  {
    description: 'Annual Cloud Hosting & Maintenance Retainer',
    category: 'Software & Tech',
    unitPrice: 48000,
    taxPercent: 16,
  },
  {
    description: 'Exhibition Wall Graphic Vinyl Printing (Square Meter)',
    category: 'Signage & Displays',
    unitPrice: 3200,
    taxPercent: 16,
  },
];

export const INITIAL_INVOICE_DOCUMENTS: InvoiceDocument[] = [
  {
    id: 'doc-inv-1049',
    documentType: 'invoice',
    documentNumber: 'INV-2026-1049',
    status: 'paid',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    currency: 'KES',
    company: DEFAULT_COMPANY_DETAILS,
    customer: DEMO_CUSTOMERS[0],
    items: [
      {
        id: 'item-1',
        description: 'Corporate Brand Identity & Visual Guidelines',
        category: 'Design Services',
        quantity: 1,
        unitPrice: 85000,
        discountPercent: 0,
        taxPercent: 16,
      },
      {
        id: 'item-2',
        description: 'Branded Heavyweight Crew T-Shirts (280 GSM) - Left Chest Embroidery',
        category: 'Custom Apparel',
        quantity: 50,
        unitPrice: 1200,
        discountPercent: 5,
        taxPercent: 16,
      },
    ],
    notes: 'Thank you for choosing Paperglow. All digital design source files have been handed off.',
    paymentTerms: 'Payment received in full via Safaricom M-Pesa. Receipt: QGH8812K9P.',
    shippingFee: 0,
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-02T14:30:00Z',
  },
  {
    id: 'doc-inv-1050',
    documentType: 'invoice',
    documentNumber: 'INV-2026-1050',
    status: 'pending',
    issueDate: '2026-10-03',
    dueDate: '2026-10-17',
    currency: 'KES',
    company: DEFAULT_COMPANY_DETAILS,
    customer: DEMO_CUSTOMERS[1],
    items: [
      {
        id: 'item-3',
        description: 'Retractable Pull-Up Banner Stand (33" x 81") - High-Res UV Archival Ink',
        category: 'Signage & Displays',
        quantity: 4,
        unitPrice: 9500,
        discountPercent: 0,
        taxPercent: 16,
      },
      {
        id: 'item-4',
        description: 'Embroidered Executive Safari Staff Uniforms',
        category: 'Workwear & Uniforms',
        quantity: 25,
        unitPrice: 2000,
        discountPercent: 0,
        taxPercent: 16,
      },
    ],
    notes: 'Delivery to Karen lodge dispatch facility scheduled upon payment clearance.',
    paymentTerms: 'Payment due within 14 days of issue date. Settle via M-Pesa Paybill 247247 A/C 0712345678.',
    shippingFee: 2500,
    createdAt: '2026-10-03T11:20:00Z',
    updatedAt: '2026-10-03T11:20:00Z',
  },
  {
    id: 'doc-inv-1051',
    documentType: 'invoice',
    documentNumber: 'INV-2026-1051',
    status: 'overdue',
    issueDate: '2026-09-15',
    dueDate: '2026-09-29',
    currency: 'KES',
    company: DEFAULT_COMPANY_DETAILS,
    customer: DEMO_CUSTOMERS[2],
    items: [
      {
        id: 'item-5',
        description: 'Annual Cloud Software Workspace License & API Integration',
        category: 'Software & Tech',
        quantity: 1,
        unitPrice: 160000,
        discountPercent: 10,
        taxPercent: 16,
      },
      {
        id: 'item-6',
        description: 'Triple-Thick Uncoated Cotton Business Cards (500 pcs)',
        category: 'Print Collateral',
        quantity: 2,
        unitPrice: 12500,
        discountPercent: 0,
        taxPercent: 16,
      },
    ],
    notes: 'Friendly reminder: this invoice is now overdue. Please settle immediately to avoid workspace disruption.',
    paymentTerms: 'Overdue. Settle via KCB Bank Kenya Ltd Account 1289045762 or M-Pesa Paybill 247247.',
    shippingFee: 0,
    createdAt: '2026-09-15T08:15:00Z',
    updatedAt: '2026-09-30T10:00:00Z',
  },
  {
    id: 'doc-quo-0042',
    documentType: 'quotation',
    documentNumber: 'QUO-2026-0042',
    status: 'accepted',
    issueDate: '2026-10-02',
    dueDate: '2026-11-02',
    currency: 'KES',
    company: DEFAULT_COMPANY_DETAILS,
    customer: DEMO_CUSTOMERS[3],
    items: [
      {
        id: 'item-7',
        description: 'Exhibition Booth Wall Vinyl Wrap & Framework (24 sqm)',
        category: 'Signage & Displays',
        quantity: 24,
        unitPrice: 3500,
        discountPercent: 5,
        taxPercent: 16,
      },
      {
        id: 'item-8',
        description: 'Embroidered Agritech Field Jackets with Waterproof Coating',
        category: 'Workwear & Uniforms',
        quantity: 60,
        unitPrice: 3800,
        discountPercent: 10,
        taxPercent: 16,
      },
      {
        id: 'item-9',
        description: 'Conference Presentation Brochures (Soft-touch Lamination, 1,000 copies)',
        category: 'Print Collateral',
        quantity: 1000,
        unitPrice: 65,
        discountPercent: 0,
        taxPercent: 16,
      },
    ],
    notes: 'Quotation valid for 30 days. Client confirmed acceptance via procurement PO #AGRI-8812.',
    paymentTerms: '50% deposit on order placement, 50% upon final delivery and installation.',
    shippingFee: 5000,
    createdAt: '2026-10-02T13:45:00Z',
    updatedAt: '2026-10-04T16:00:00Z',
  },
  {
    id: 'doc-quo-0043',
    documentType: 'quotation',
    documentNumber: 'QUO-2026-0043',
    status: 'sent',
    issueDate: '2026-10-04',
    dueDate: '2026-11-04',
    currency: 'KES',
    company: DEFAULT_COMPANY_DETAILS,
    customer: DEMO_CUSTOMERS[4],
    items: [
      {
        id: 'item-10',
        description: 'Custom Kraft Coffee Bag Label Stickers (5,000 pcs, Gold Foil Accent)',
        category: 'Print Collateral',
        quantity: 5000,
        unitPrice: 8,
        discountPercent: 5,
        taxPercent: 16,
      },
      {
        id: 'item-11',
        description: 'Barista Aprons with Genuine Leather Crossback Straps',
        category: 'Workwear & Uniforms',
        quantity: 12,
        unitPrice: 2800,
        discountPercent: 0,
        taxPercent: 16,
      },
    ],
    notes: 'Digital proof included prior to production. Turnaround 5 business days after approval.',
    paymentTerms: 'Validity: 30 days from issue. Settle via M-Pesa Paybill 247247.',
    shippingFee: 1500,
    createdAt: '2026-10-04T10:30:00Z',
    updatedAt: '2026-10-04T10:30:00Z',
  },
];

// Calculation Helpers
export function calculateItemTotal(item: InvoiceLineItem): {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
} {
  const base = item.quantity * item.unitPrice;
  const discountAmount = Math.round(base * ((item.discountPercent || 0) / 100));
  const taxableAmount = base - discountAmount;
  const taxAmount = Math.round(taxableAmount * ((item.taxPercent || 0) / 100));
  const total = taxableAmount + taxAmount;

  return { subtotal: base, discountAmount, taxableAmount, taxAmount, total };
}

export function calculateDocumentTotals(doc: InvoiceDocument): {
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalTax: number;
  shippingFee: number;
  grandTotal: number;
} {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  doc.items.forEach((item) => {
    const calc = calculateItemTotal(item);
    subtotal += calc.subtotal;
    totalDiscount += calc.discountAmount;
    totalTax += calc.taxAmount;
  });

  const taxableAmount = subtotal - totalDiscount;
  const shippingFee = doc.shippingFee || 0;
  const grandTotal = taxableAmount + totalTax + shippingFee;

  return {
    subtotal,
    totalDiscount,
    taxableAmount,
    totalTax,
    shippingFee,
    grandTotal,
  };
}

export function computeMetrics(documents: InvoiceDocument[]): InvoiceMetrics {
  const invoices = documents.filter((d) => d.documentType === 'invoice');
  const quotations = documents.filter((d) => d.documentType === 'quotation');

  let totalInvoicedKes = 0;
  let totalPaidKes = 0;
  let totalOutstandingKes = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  invoices.forEach((inv) => {
    const { grandTotal } = calculateDocumentTotals(inv);
    totalInvoicedKes += grandTotal;
    if (inv.status === 'paid') {
      totalPaidKes += grandTotal;
      paidCount++;
    } else if (inv.status === 'pending' || inv.status === 'overdue') {
      totalOutstandingKes += grandTotal;
      unpaidCount++;
    }
  });

  let totalQuotationValueKes = 0;
  let acceptedQuotesCount = 0;

  quotations.forEach((q) => {
    const { grandTotal } = calculateDocumentTotals(q);
    totalQuotationValueKes += grandTotal;
    if (q.status === 'accepted') {
      acceptedQuotesCount++;
    }
  });

  return {
    totalInvoicesCount: invoices.length,
    totalQuotationsCount: quotations.length,
    totalInvoicedKes,
    totalPaidKes,
    totalOutstandingKes,
    totalQuotationValueKes,
    paidCount,
    unpaidCount,
    acceptedQuotesCount,
  };
}
