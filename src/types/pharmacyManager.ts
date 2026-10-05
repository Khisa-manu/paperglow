export type PharmModule =
  | 'dashboard'
  | 'inventory'
  | 'stock'
  | 'sales'
  | 'purchases'
  | 'customers'
  | 'suppliers'
  | 'reports'
  | 'expenses'
  | 'staff'
  | 'settings';

export type MedicineCategory =
  | 'Antibiotics'
  | 'Analgesics & Pain Relief'
  | 'Antimalarials'
  | 'Respiratory & Cold'
  | 'Gastrointestinal'
  | 'Cardiovascular & Diabetes'
  | 'Dermatologicals'
  | 'Vitamins & Supplements'
  | 'Medical Supplies & First Aid';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';

export interface MedicineProduct {
  id: string;
  name: string; // e.g. "Augmentin 625mg Tablets"
  genericName: string; // e.g. "Amoxicillin / Clavulanate Potassium"
  category: MedicineCategory;
  manufacturer: string; // e.g. "GSK Kenya", "Cosmos Pharmaceuticals", "Dawa Ltd"
  skuBarcode: string; // e.g. "MED-00918"
  batchNumber: string; // e.g. "AUG-24K9"
  unitOfMeasure: string; // "Pack of 14", "Bottle 100ml", "Blister of 10"
  quantityInStock: number;
  minStockLevel: number;
  buyingPriceKes: number;
  sellingPriceKes: number;
  expiryDate: string; // YYYY-MM-DD
  requiresPrescription: boolean;
  shelfLocation: string; // e.g. "Shelf B-2", "Cold Chain Refrigerator"
  notes?: string;
}

export type StockMovementType = 'purchase_receipt' | 'sale_dispense' | 'adjustment_loss' | 'expired_removal' | 'return_supplier';

export interface StockMovement {
  id: string;
  movementNumber: string; // e.g. "STK-2026-0041"
  productId: string;
  productName: string;
  batchNumber: string;
  movementType: StockMovementType;
  quantityChange: number; // positive for addition, negative for deduction
  balanceAfter: number;
  reason: string;
  performedBy: string;
  timestamp: string;
}

export type PaymentMethod = 'mpesa' | 'cash' | 'card' | 'insurance' | 'bank_eft';
export type PaymentStatus = 'paid' | 'partial' | 'pending';

export interface SaleLineItem {
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  unitPriceKes: number;
  totalPriceKes: number;
  dosageInstructions?: string; // e.g. "1 tab 3x daily after meals for 5 days"
}

export interface SaleTransaction {
  id: string;
  receiptNumber: string; // e.g. "RX-2026-1049"
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  doctorPrescriber?: string;
  items: SaleLineItem[];
  subtotalKes: number;
  discountKes: number;
  totalAmountKes: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  mpesaRef?: string;
  dispensedBy: string;
  timestamp: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  quantityOrdered: number;
  quantityReceived: number;
  buyingPriceKes: number;
  totalCostKes: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO-2026-018"
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'ordered' | 'received' | 'partially_received' | 'cancelled';
  items: PurchaseOrderItem[];
  totalCostKes: number;
  amountPaidKes: number;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  invoiceNumber?: string;
  receivedDate?: string;
}

export interface PharmacyCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  ageOrDob?: string;
  chronicCondition?: string; // e.g. "Hypertension", "Type 2 Diabetes", "Asthma"
  knownAllergies?: string; // e.g. "Penicillin", "Sulfa drugs"
  totalSpendKes: number;
  lastVisitDate: string;
  notes?: string;
}

export interface PharmacySupplier {
  id: string;
  companyName: string; // e.g. "Harleys Ltd Kenya", "Phillips Pharmaceuticals"
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categoriesSupplied: string[];
  outstandingBalanceKes: number;
  leadTimeDays: number;
}

export type ExpenseCategory =
  | 'regulatory_ppb'
  | 'staff_wages'
  | 'electricity_cold_chain'
  | 'rent_premises'
  | 'packaging_disposables'
  | 'cleaning_supplies'
  | 'equipment_maintenance';

export interface PharmacyExpense {
  id: string;
  voucherNumber: string;
  category: ExpenseCategory;
  description: string;
  amountKes: number;
  expenseDate: string;
  paidTo: string;
  paymentMethod: PaymentMethod;
}

export interface PharmacyStaff {
  id: string;
  name: string;
  role: 'superintendent_pharmacist' | 'pharmaceutical_technologist' | 'dispenser' | 'cashier';
  ppbRegNumber: string; // Pharmacy and Poisons Board registration e.g. "PPB-TECH-8912"
  phone: string;
  email: string;
  status: 'active' | 'on_leave';
  shiftSchedule: string;
}

export interface PharmacySettings {
  pharmacyName: string;
  ppbPremisesLicense: string; // e.g. "PPB/PREM/2026/8912"
  kraPin: string;
  physicalAddress: string;
  county: string;
  phone: string;
  email: string;
  mpesaTillPaybill: string;
  mpesaType: 'buy_goods_till' | 'paybill';
  receiptFooterText: string;
  lowStockThresholdDefault: number;
  expiryWarningDays: number; // e.g. 90 days
  defaultCurrency: string;
}
