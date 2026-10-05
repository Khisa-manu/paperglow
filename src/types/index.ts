export interface BusinessApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  mainBenefit: string;
  category: string;
  monthlyPrice: number;
  features: string[];
  securityHighlights: string[];
  icon: string;
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
