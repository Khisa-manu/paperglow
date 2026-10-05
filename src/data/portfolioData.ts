import { Project, Article, Service, Fact } from '../types';

export const THEME_SCHEMES: { id: 'azure' | 'violet' | 'coral' | 'emerald' | 'ink' | 'midnight'; label: string; primaryColor: string }[] = [
  { id: 'azure', label: 'Azure (Blue)', primaryColor: '#0070d8' },
  { id: 'violet', label: 'Violet (Purple)', primaryColor: '#5b3fd6' },
  { id: 'coral', label: 'Coral (Orange)', primaryColor: '#ea580c' },
  { id: 'emerald', label: 'Emerald (Green)', primaryColor: '#059669' },
  { id: 'ink', label: 'Ink (Monochrome)', primaryColor: '#18181b' },
  { id: 'midnight', label: 'Midnight (Cyan)', primaryColor: '#38bdf8' },
];

export const CLIENTS = [
  { name: 'Whisk', logo: '/assets/images/clients/whisk.svg' },
  { name: 'Fieldnote', logo: '/assets/images/clients/fieldnote.svg' },
  { name: 'Harrow & Pine', logo: '/assets/images/clients/harrow.svg' },
  { name: 'Arcade Club', logo: '/assets/images/clients/arcade.svg' },
  { name: 'Nookdesk', logo: '/assets/images/clients/nookdesk.svg' },
  { name: 'Tidepool', logo: '/assets/images/clients/tidepool.svg' },
];

export const FACTS: Fact[] = [
  { id: 'shipped', target: 214, label: 'Products shipped', colorVar: 'var(--color-secondary)' },
  { id: 'clients', target: 96, label: 'Clients since 2014', colorVar: 'var(--color-primary)' },
  { id: 'awards', target: 18, label: 'Design awards', colorVar: 'var(--color-tertiary)' },
];

export const PROJECTS: Project[] = [
  {
    slug: 'nookdesk',
    title: 'Nookdesk booking app',
    client: 'Nook Technologies',
    category: 'Product & Web App',
    year: '2025',
    image: '/assets/images/work-nookdesk.webp',
    summary: 'A seamless workspace and desk booking web application for hybrid teams across 42 locations.',
    overview: 'Nookdesk needed an intuitive, fast booking platform that eliminated double-bookings and gave facilities managers real-time heatmaps of desk usage without feeling corporate.',
    challenge: 'Prior software was slow, clunky, and generated friction among employees returning to flexible work schedules. Frictionless mobile check-in and interactive spatial floor plans were essential.',
    solution: 'We engineered an interactive vector floor plan component capable of instant desk reservation in under two taps. Coupled with smart Slack/calendar sync, employees reserve desks in seconds.',
    results: [
      '84% decrease in daily desk check-in friction reports',
      '4.9/5 star satisfaction across 12,000 active employees',
      'Over 65,000 monthly bookings handled with sub-100ms response times'
    ],
    tags: ['Web App', 'Design System', 'Spatial UI', 'TypeScript'],
    metrics: [
      { label: 'Booking Speed', value: '1.8s' },
      { label: 'Active Desks', value: '3,400+' },
      { label: 'Team Adoption', value: '94%' }
    ],
    deliverables: ['UI/UX Design', 'Interactive Floor Map', 'Design Token Library', 'Mobile Web App'],
    testimonial: {
      quote: 'Creative Agency turned what was our team’s biggest workplace frustration into the most beloved tool in our everyday office routine.',
      author: 'Marcus Vance',
      role: 'VP Workplace Experience, Nook Technologies'
    }
  },
  {
    slug: 'whisk',
    title: 'Whisk design system',
    client: 'Whisk Culinary Media',
    category: 'Design Systems',
    year: '2025',
    image: '/assets/images/work-whisk.webp',
    summary: 'A unified multi-brand design system empowering 8 editorial publications and 4 mobile apps.',
    overview: 'Whisk operates culinary blogs, shopping tools, and community recipe builders that grew organically into distinct, fragmented interfaces over eight years.',
    challenge: 'Engineers were rebuilding similar button styles and culinary cards from scratch across disparate repositories, ballooning maintenance overhead and diluting brand credibility.',
    solution: 'We architected a unified token-driven design system with accessible typography, responsive food measurement components, and rich micro-interactions tested across mobile, tablet, and desktop.',
    results: [
      '60% reduction in time-to-market for new recipe editorial templates',
      '100% WCAG 2.1 AA accessibility compliance across all 8 web properties',
      'Adopted by 35 frontend engineers with comprehensive interactive documentation'
    ],
    tags: ['Design System', 'Tokens', 'Accessibility', 'Figma & React'],
    metrics: [
      { label: 'Components', value: '140+' },
      { label: 'Brand Tokens', value: '380+' },
      { label: 'Code Velocity', value: '+62%' }
    ],
    deliverables: ['Atomic Component Architecture', 'Interactive Storybook', 'Typography Scales', 'Motion Guidelines'],
    testimonial: {
      quote: 'The design system delivered by the studio brought coherence to our sprawling media network faster than we ever imagined possible.',
      author: 'Elena Gomez',
      role: 'Head of Product, Whisk Media'
    }
  },
  {
    slug: 'harrow-and-pine',
    title: 'Harrow & Pine packaging',
    client: 'Harrow & Pine Apothecary',
    category: 'Branding & Packaging',
    year: '2024',
    image: '/assets/images/work-harrow.webp',
    summary: 'Sustainable botanical skincare packaging and identity for an ethical California apothecary.',
    overview: 'Harrow & Pine formulates restorative botanical serums sourced directly from coastal regenerative farms. They required branding that radiated organic purity without falling into generic minimalist clichés.',
    challenge: 'Balancing FDA compliance and extensive ingredient listings on compact glass bottles while preserving a tactile, luxurious, bespoke aesthetic was difficult.',
    solution: 'We introduced custom embossed textured paper labels, subtle foil stamps, and earthy earth-tone palettes matched with bespoke typographic hierarchy and custom iconography.',
    results: [
      'Sold out initial 5,000 product batch in under 72 hours of launch',
      'Featured in Dieline Packaging of the Year 2024',
      'Zero plastic: 100% biodegradable post-consumer recycled boxes'
    ],
    tags: ['Brand Identity', 'Print & Packaging', 'Art Direction', 'Eco Materials'],
    metrics: [
      { label: 'Product Run', value: '5,000 Units' },
      { label: 'Sell Out Time', value: '72 Hours' },
      { label: 'Packaging Waste', value: '0% Plastic' }
    ],
    deliverables: ['Custom Amber Glass Bottle Labels', 'Outer Box Packaging', 'Brand Guidelines', 'Unboxing Experience'],
    testimonial: {
      quote: 'Our bottles sit on bathroom vanities like miniature works of art. The packaging single-handedly established our luxury boutique credentials.',
      author: 'Julian Harrow',
      role: 'Founder & Master Herbalist'
    }
  },
  {
    slug: 'arcade-club',
    title: 'Arcade Club app',
    client: 'Arcade Club Worldwide',
    category: 'Mobile Experience',
    year: '2024',
    image: '/assets/images/work-arcade-card.webp',
    summary: 'A vibrant retro-modern social companion for vintage gaming venues and global leaderboards.',
    overview: 'Arcade Club hosts retro gaming tournaments across major metropolitan centers and needed an arcade passport app for players to link cabinets, track high scores, and earn retro badges.',
    challenge: 'Capturing the nostalgic CRT neon aesthetic of the 1980s without sacrificing modern UI legibility, 60fps responsiveness, or crisp typography.',
    solution: 'We engineered custom neon glow shaders, retro phosphor scanline micro-animations, and instant cabinet NFC scanning that instantly syncs players’ verified high scores.',
    results: [
      'Over 180,000 active tournament players registered within 6 months',
      'Average session duration: 14.2 minutes per venue visit',
      'Selected as Apple App Store "App of the Day" in 14 countries'
    ],
    tags: ['iOS & Android', 'Gamification', 'NFC & Bluetooth', 'Neon UI'],
    metrics: [
      { label: 'Active Gamers', value: '180K+' },
      { label: 'Cabinets Synced', value: '1,200+' },
      { label: 'High Scores', value: '2.4M' }
    ],
    deliverables: ['Mobile App Design', 'Custom Phosphor Animations', 'Sound FX Design', 'Tournament UI Engine'],
    testimonial: {
      quote: 'They captured the electric thrill of stepping into an authentic 80s arcade and translated it effortlessly onto a modern glass screen.',
      author: 'Taro Takahashi',
      role: 'Creative Director, Arcade Club Worldwide'
    }
  }
];

export const SERVICES: Service[] = [
  {
    id: 'brand-identity',
    title: 'Brand Identity & Strategy',
    tagline: 'Distinctive visual identities built to endure',
    description: 'We carve out memorable visual worlds for forward-thinking companies. From foundational typography and color systems to verbal tone and guidelines that empower your team.',
    deliverables: ['Logo & Visual Marks', 'Design Guidelines & Styleguides', 'Color & Type Systems', 'Brand Strategy & Positioning', 'Collateral & Print'],
    icon: 'palette'
  },
  {
    id: 'web-mobile',
    title: 'Web & Mobile Applications',
    tagline: 'High-performance digital products engineered with care',
    description: 'We design and build fast, responsive digital experiences using modern frameworks. Clean code, accessible interactions, and fluid motion that turns visitors into advocates.',
    deliverables: ['Full-stack Web Apps', 'Responsive SaaS Portals', 'Mobile Application Design', 'Micro-interactions & Motion', 'Performance Optimization'],
    icon: 'code'
  },
  {
    id: 'design-systems',
    title: 'Product Design Systems',
    tagline: 'Scalable UI foundations that accelerate development',
    description: 'Say goodbye to UI inconsistencies. We create bulletproof component libraries and design tokens bridging Figma and production code, slashing design debt.',
    deliverables: ['Figma Component Libraries', 'Design Token Architecture', 'Accessibility Audit (WCAG AA)', 'Interactive Documentation', 'Engineering Hand-off'],
    icon: 'components'
  },
  {
    id: 'creative-direction',
    title: 'Creative Direction & 3D',
    tagline: 'Evocative storytelling and visual direction',
    description: 'Elevate your product presentation with tailored art direction, digital product mockups, editorial photography direction, and bespoke iconography.',
    deliverables: ['Art & Editorial Direction', 'Interactive 3D Product Mockups', 'Custom Iconography', 'Campaign Asset Production', 'Motion Branding'],
    icon: 'vector-bezier'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'article-1',
    slug: 'design-systems-that-survive-growth',
    title: 'Why 80% of design systems fail after year one (and how to fix yours)',
    category: 'Design Systems',
    date: 'Oct 1, 2026',
    readTime: '6 min read',
    author: {
      name: 'Maya Lin',
      role: 'Design Principal',
      avatar: '/assets/images/studio-4.webp'
    },
    excerpt: 'Most design systems collapse not from a lack of components, but from a breakdown in governance and engineering empathy.',
    content: [
      'When an agency or in-house team sets out to build a design system, the initial velocity is exhilarating. Components are clean, colors are mapped to harmonious scales, and the Figma file feels like a sanctuary.',
      'Yet twelve months later, engineers are writing inline CSS overrides, product managers are inventing custom modals for one-off campaigns, and the system becomes a museum piece rather than a living tool.',
      'The antidote is treating your design system not as a set of static assets, but as a software product with its own roadmap, bug backlog, and versioning contract. Every token should map directly to an engineering primitive.',
      'When designers understand the runtime constraints of CSS variables and bundling, and engineers appreciate the typographic rhythm of vertical grids, the design system becomes indestructible.'
    ],
    tags: ['Design Systems', 'Workflow', 'Front-End']
  },
  {
    id: 'article-2',
    slug: 'anti-slop-in-digital-craft',
    title: 'The discipline of restraint: fighting generic UI fatigue',
    category: 'Opinion',
    date: 'Sep 18, 2026',
    readTime: '4 min read',
    author: {
      name: 'David Keller',
      role: 'Creative Director',
      avatar: '/assets/images/studio-5.webp'
    },
    excerpt: 'When every SaaS website shares the same purple pill buttons, floating glass cards, and stock 3D blobs, true craftsmanship stands out.',
    content: [
      'Open any tech aggregator today and you will be greeted by an uncanny valley of indistinguishable web designs. Rounded corners with exactly 16px radius, saturated gradients, and AI-generated copy that says everything while meaning nothing.',
      'Our studio philosophy has always favored editorial clarity: high-contrast typography, purposeful white space, authentic photography of real work environments, and bespoke interactions that reward curiosity.',
      'Restraint is not the absence of energy—it is the deliberate concentration of it. When every element on the page exists for a documented functional or emotional reason, the viewer instinctively senses the authority of the work.'
    ],
    tags: ['Craft', 'Typography', 'Aesthetics']
  },
  {
    id: 'article-3',
    slug: 'building-performant-interactive-maps',
    title: 'Engineering spatial interfaces: What we learned building Nookdesk',
    category: 'Engineering',
    date: 'Aug 24, 2026',
    readTime: '8 min read',
    author: {
      name: 'Ethan Brooks',
      role: 'Lead Architect',
      avatar: '/assets/images/studio-2.webp'
    },
    excerpt: 'Rendering dynamic office blueprints with hundreds of interactive desk pins at 60 frames per second on mobile browsers.',
    content: [
      'When Nookdesk approached us to redesign their desk reservation engine, the existing implementation rendered heavy canvas elements that drained mobile device batteries within minutes.',
      'We stripped out the heavy dependencies in favor of lightweight SVG viewports orchestrated with reactive state slices. By culling nodes outside the immediate camera frustum, we reduced render latency by 90%.',
      'The lesson: before reaching for complex WebGL libraries, investigate the native capabilities of modern vector DOM rendering. Simplicity consistently wins in long-term maintainability.'
    ],
    tags: ['TypeScript', 'Performance', 'Case Study']
  }
];

export const STUDIO_PHOTOS = [
  { src: '/assets/images/studio-1.webp', alt: 'Studio workspace with natural sunlight' },
  { src: '/assets/images/studio-2.webp', alt: 'Design team reviewing prototypes' },
  { src: '/assets/images/studio-3.webp', alt: 'Material samples and color swatches' },
  { src: '/assets/images/studio-4.webp', alt: 'Wireframing session at whiteboard' },
  { src: '/assets/images/studio-5.webp', alt: 'Creative coding and typography testing' },
];
