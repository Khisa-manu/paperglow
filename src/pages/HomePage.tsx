import React from 'react';
import {
  FEATURED_APPLICATIONS,
  BRANDING_PRODUCTS,
  WORKFLOW_STEPS,
  VALUE_PILLARS,
} from '../data/paperglowData';
import { BusinessApp, BrandingProduct } from '../types';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  KeyRound,
  CheckSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Package,
  ReceiptText,
  Users,
  Kanban,
  FileCheck,
  FileSpreadsheet,
  Building2,
  LifeBuoy,
  Clock,
  Check,
  Scale,
  GraduationCap,
  Activity,
} from 'lucide-react';

interface HomePageProps {
  subscribedAppIds: string[];
  onToggleSubscription: (appId: string) => void;
  onViewAppDetail: (app: BusinessApp) => void;
  onSelectAppDetail: (appId: string) => void;
  onViewBrandingDetail: (item: BrandingProduct) => void;
  onOpenAccount: () => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateToDirectory: () => void;
  onNavigateToBranding: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  subscribedAppIds,
  onToggleSubscription,
  onViewAppDetail,
  onSelectAppDetail,
  onViewBrandingDetail,
  onOpenAccount,
  onNavigateSection,
  onNavigateToDirectory,
  onNavigateToBranding,
}) => {
  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-red-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-red-600" />;
      case 'ReceiptText':
        return <ReceiptText className="w-5 h-5 text-red-600" />;
      case 'Users2':
      case 'Users':
        return <Users className="w-5 h-5 text-red-600" />;
      case 'Kanban':
        return <Kanban className="w-5 h-5 text-red-600" />;
      case 'LifeBuoy':
        return <LifeBuoy className="w-5 h-5 text-red-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-red-600" />;
      case 'Package':
        return <Package className="w-5 h-5 text-red-600" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-red-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-red-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-red-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO
          Paperglow branding, clear dual-engine headline,
          Primary CTA: Explore Applications, Secondary CTA: Brand Your Business
      ────────────────────────────────────────────────────────── */}
      <section id="hero" className="pt-32 sm:pt-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Subtle Brand Identity Tagline */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-md text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80">
            <span className="w-2 h-2 rounded-xs bg-red-600"></span>
            <span className="font-bold tracking-tight">Paperglow Platform</span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-500 font-normal">Business Software &amp; Physical Brand Goods</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold font-['Poppins'] tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.12]">
            Run Your Digital Operations.{' '}
            <span className="text-red-600 dark:text-red-500 block sm:inline">
              Wear &amp; Display Your Brand.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Paperglow brings essential business applications and commercial-grade physical branding together under one central account. Manage invoicing, pipelines, and projects while equipping your team with custom uniforms, apparel, and event displays.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigateSection('applications')}
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Explore Applications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateSection('branding')}
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Brand Your Business
            </button>
          </div>
        </div>

        {/* Dual Engine Architectural Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Engine 1: Software */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
              <Layers className="w-4 h-4" />
              <span>Digital Business Applications</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Modular invoicing, sales CRM, project execution, and staff permission tools accessible through single sign-on.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-500">
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Invoice &amp; Retainers</span>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Sales CRM</span>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Project Hub</span>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Team SSO</span>
            </div>
          </div>

          {/* Engine 2: Merchandise */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
              <Package className="w-4 h-4" />
              <span>Branding &amp; Customization Studio</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Commercial-grade screenprinted apparel, embroidered workwear, trade show banners, and business collateral.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-500">
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Custom Apparel</span>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Event Signage</span>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Staff Uniforms</span>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">Brand Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2: FEATURED APPLICATIONS
          Application Name, Short Description, Main Benefit,
          View Application button, Subscribe button
      ────────────────────────────────────────────────────────── */}
      <section id="applications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
              Ecosystem Products
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Featured Business Applications
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Purpose-built business software for commercial teams. Subscribe only to what your workspace requires.
            </p>
          </div>
          <button
            onClick={onNavigateToDirectory}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-red-600 text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors flex items-center gap-1.5 w-fit cursor-pointer"
          >
            <span>Browse Full App Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_APPLICATIONS.map((app) => {
            const isSubscribed = subscribedAppIds.includes(app.id);

            return (
              <div
                key={app.id}
                className="p-6 sm:p-7 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] flex flex-col justify-between space-y-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-xs"
              >
                <div className="space-y-4">
                  {/* Category & Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-red-600 dark:text-red-500 tracking-wider">
                      {app.category}
                    </span>
                    <span className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                      ${app.monthlyPrice} <span className="text-[11px] font-normal text-neutral-500">/ month</span>
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                      {app.name}
                    </h3>
                    <p className="text-xs font-medium text-neutral-500 mt-0.5">
                      {app.tagline}
                    </p>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {app.shortDescription}
                  </p>

                  {/* Main Benefit Box */}
                  <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs">
                    <div className="text-[10px] font-bold uppercase text-neutral-500 mb-0.5">
                      Main Commercial Benefit
                    </div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      {app.mainBenefit}
                    </p>
                  </div>
                </div>

                {/* Card Actions: View Application + Subscribe */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectAppDetail(app.id)}
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    {app.id === 'paperglow-business-manager' && (
                      <button
                        onClick={() => {
                          window.location.hash = 'business-manager';
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer bg-red-50 dark:bg-red-950/60 px-2 py-1 rounded-sm border border-red-200 dark:border-red-900/60"
                      >
                        <span>Open Manager</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {app.id === 'paperglow-property-manager' && (
                      <button
                        onClick={() => {
                          window.location.hash = 'property-manager';
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer bg-red-50 dark:bg-red-950/60 px-2 py-1 rounded-sm border border-red-200 dark:border-red-900/60"
                      >
                        <span>Open Property Hub</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {app.id === 'paperglow-invoice-generator' && (
                      <button
                        onClick={() => {
                          window.location.hash = 'invoice-generator';
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer bg-red-50 dark:bg-red-950/60 px-2 py-1 rounded-sm border border-red-200 dark:border-red-900/60"
                      >
                        <span>Launch App</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleSubscription(app.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isSubscribed
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 3: ONE PAPERGLOW ACCOUNT
          Single account access, centralized SSO architecture,
          unified billing
      ────────────────────────────────────────────────────────── */}
      <section id="account" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101319]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Explanation */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
                Centralized Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                One Paperglow Account for Your Entire Business
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Rather than managing separate vendors, logins, and billing statements, Paperglow customers use one single account. Log in once to launch subscribed applications, manage employee permissions, track physical merchandise proofs, and inspect unified invoices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <UserCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Single Sign-On across all business tools</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Central team role permissions management</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <Package className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Track custom apparel and print shipments</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>Consolidated monthly statements and invoicing</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenAccount}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                >
                  Open Central Account Dashboard
                </button>
              </div>
            </div>

            {/* Architecture Box */}
            <div className="lg:col-span-5 p-6 rounded-lg bg-white dark:bg-[#141820] border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="text-xs font-bold uppercase text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                Unified Session Architecture
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                  <span>User: you@company.com</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Authenticated</span>
                </div>
                <div className="pl-4 border-l-2 border-red-600 space-y-1.5 py-1">
                  <div className="text-neutral-600 dark:text-neutral-400">
                    ├─ Paperglow Invoice <span className="text-neutral-400 text-[10px]">(Active)</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    ├─ Paperglow CRM <span className="text-neutral-400 text-[10px]">(Active)</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    ├─ Paperglow Hub <span className="text-neutral-400 text-[10px]">(Active)</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    └─ Swag &amp; Print Orders <span className="text-neutral-400 text-[10px]">(Live Tracking)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 4: BRANDING & CUSTOMIZATION
          Graphic Design, Banners, T-Shirts, Hoodies, Uniforms,
          Caps, Business Cards, Custom Merchandise
      ────────────────────────────────────────────────────────── */}
      <section id="branding" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
              Physical Production Studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Branding &amp; Customization
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Commercial-grade workwear, screenprinted apparel, event signage, and physical brand merchandise ordered directly through Paperglow.
            </p>
          </div>
          <button
            onClick={onNavigateToBranding}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-red-600 text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors flex items-center gap-1.5 w-fit cursor-pointer"
          >
            <span>Browse Full Merch Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRANDING_PRODUCTS.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-500 tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                    Min: {item.minOrder}
                  </span>
                </div>

                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
                  <div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Turnaround:</span> {item.turnaround}
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Starting:</span> ${item.basePrice} {item.priceUnit}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => onViewBrandingDetail(item)}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Configure / Order</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 5: HOW PAPERGLOW WORKS
          1. Create account
          2. Explore applications
          3. Subscribe or access an application
          4. Manage everything from Paperglow
      ────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
            Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            How Paperglow Works
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            A frictionless workflow taking you from account creation to daily operational software and branded merchandise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-3 shadow-xs"
            >
              <div className="text-2xl font-black font-mono text-red-600 dark:text-red-500">
                {step.step}
              </div>
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                {step.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 6: WHY PAPERGLOW
          Focus on convenience, one account, practical business tools
          and professional branding
      ────────────────────────────────────────────────────────── */}
      <section id="why-paperglow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
            The Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Why Businesses Choose Paperglow
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Practical software without complexity, paired with reliable commercial physical merchandise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PILLARS.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-3 shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-500 flex items-center justify-center">
                {i === 0 && <Layers className="w-5 h-5" />}
                {i === 1 && <KeyRound className="w-5 h-5" />}
                {i === 2 && <CheckSquare className="w-5 h-5" />}
                {i === 3 && <Sparkles className="w-5 h-5" />}
              </div>
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                {pillar.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 7: FINAL CTA
          "Build your business with Paperglow."
      ────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-xl bg-[#0b0d11] text-white text-center space-y-6 border border-neutral-800 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Poppins'] tracking-tight">
            Build your business with Paperglow.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Consolidate your daily business applications and outfit your team with professional physical branding under one single Paperglow account.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAccount}
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
            >
              Create Your Paperglow Account
            </button>
            <button
              onClick={() => onNavigateSection('applications')}
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-xs font-semibold border border-neutral-700 hover:bg-neutral-800 text-neutral-200 transition-colors cursor-pointer"
            >
              Explore Software Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
