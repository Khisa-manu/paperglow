export interface AppScreenshot {
  id: string;
  title: string;
  caption: string;
  badge: string;
  previewType: 'invoice' | 'crm' | 'kanban' | 'team' | 'contracts' | 'desk';
}

export interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface BusinessApp {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  mainBenefit: string;
  category: 'Finance & Payments' | 'Sales & CRM' | 'Projects & Work' | 'Organization & HR' | 'Operations & Support';
  monthlyPrice: number;
  annualPrice: number;
  iconName: string;
  version: string;
  rating: number;
  userCountText: string;
  features: string[];
  securityHighlights: string[];
  screenshots: AppScreenshot[];
  pricingTiers: PricingTier[];
  faqs: { question: string; answer: string }[];
}

export interface ProductVariation {
  name: string;
  options: string[];
  defaultOption: string;
}

export interface BulkDiscountTier {
  minQty: number;
  discountPercent: number;
  label: string;
}

export interface BrandingProduct {
  id: string;
  title: string;
  category: 'Creative Design' | 'Signage & Displays' | 'Custom Apparel' | 'Workwear & Uniforms' | 'Print Collateral' | 'Merchandise & Swag';
  tagline: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  minOrder: number;
  turnaround: string;
  materials: string;
  specs: string[];
  variations: ProductVariation[];
  bulkDiscounts: BulkDiscountTier[];
  iconName: string;
}

// Backward-compatibility alias
export type BrandingItem = BrandingProduct;

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  category: string;
  unitPrice: number;
  quantity: number;
  selectedVariations: Record<string, string>;
  customInstructions: string;
  totalPrice: number;
  addedAt: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

export interface ValuePillar {
  title: string;
  description: string;
  icon: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  role: string;
  twoFactorEnabled: boolean;
  joinedDate: string;
}

export interface SoftwareOrder {
  id: string;
  orderNumber: string;
  date: string;
  appName: string;
  tier: string;
  billingCadence: 'monthly' | 'annual';
  amount: number;
  status: 'Paid' | 'Processing' | 'Renewed';
}

export interface MerchandiseOrder {
  id: string;
  orderNumber: string;
  date: string;
  itemTitle: string;
  category: string;
  quantity: number;
  specs: string;
  totalAmount: number;
  status: 'Proofing' | 'In Production' | 'Shipped' | 'Delivered';
  trackingNumber?: string;
  estimatedDelivery: string;
  artworkApproved: boolean;
  customNotes?: string;
}
