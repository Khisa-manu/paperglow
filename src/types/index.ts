export type ThemeScheme = 'azure' | 'violet' | 'coral' | 'emerald' | 'ink' | 'midnight';

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
  metrics?: { label: string; value: string }[];
  deliverables?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  excerpt: string;
  content: string[];
  tags: string[];
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: string;
}

export interface Fact {
  id: string;
  target: number;
  label: string;
  colorVar: string;
}
