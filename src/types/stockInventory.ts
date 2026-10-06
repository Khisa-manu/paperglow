export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';

export type MovementType = 'stock_in' | 'stock_out' | 'adjustment' | 'transfer' | 'damaged_lost';

export type PurchaseOrderStatus = 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';

export type PaymentMethod = 'mpesa' | 'cash' | 'card' | 'bank_transfer' | 'credit';

export type InventoryModule =
  | 'dashboard'
  | 'products'
  | 'stock_management'
  | 'alerts'
  | 'suppliers'
  | 'purchases'
  | 'sales'
  | 'categories'
  | 'barcode'
  | 'reports'
  | 'settings';

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  categoryId: string;
  categoryName: string;
  supplierId: string;
  supplierName: string;
  buyingPriceKes: number;
  sellingPriceKes: number;
  currentQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string; // e.g. 'Pcs', 'Boxes', 'Rolls', 'Sets', 'Kg'
  imageUrl?: string;
  status: StockStatus;
  location: string; // e.g. 'Shelf A-3', 'Warehouse Bay 1'
  description?: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  quantity: number; // absolute change count
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  referenceNumber: string; // e.g. PO-1029, SALE-3920, ADJ-841
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  suppliedCategoryIds: string[];
  paymentTerms: string;
  outstandingBalanceKes: number;
  totalPurchasesKes: number;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCostKes: number;
  totalCostKes: number;
  receivedQty: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  totalAmountKes: number;
  status: PurchaseOrderStatus;
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface StockSaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPriceKes: number;
  subtotalKes: number;
}

export interface StockSale {
  id: string;
  receiptNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  items: StockSaleItem[];
  totalAmountKes: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock';
  currentQty: number;
  threshold: number;
  date: string;
  isDismissed: boolean;
}

export interface InventorySettings {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  kraPin: string;
  currency: string;
  stockValuationMethod: 'FIFO' | 'Weighted Average' | 'LIFO';
  lowStockGlobalThreshold: number;
  skuPrefix: string;
  barcodePrefix: string;
  defaultWarehouse: string;
  allowNegativeStock: boolean;
  autoGenerateSku: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
}
