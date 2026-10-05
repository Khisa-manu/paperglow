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

export interface BrandingItem {
  id: string;
  title: string;
  category: string;
  description: string;
  materials: string;
  startingPrice: string;
  turnaround: string;
  minOrder: string;
  icon: string;
  specs: string[];
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
