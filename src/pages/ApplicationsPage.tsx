import React, { useState, useMemo } from 'react';
import { APPLICATIONS_CATALOG } from '../data/paperglowData';
import { BusinessApp } from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  ReceiptText,
  Users,
  Kanban,
  FileCheck,
  FileSpreadsheet,
  Building2,
  HelpCircle,
  LifeBuoy,
  Clock,
  Package,
  Sparkles,
  Scale,
} from 'lucide-react';

interface ApplicationsPageProps {
  subscribedAppIds: string[];
  onToggleSubscription: (appId: string) => void;
  onSelectAppDetail: (appId: string) => void;
  onLaunchApp: (app: BusinessApp) => void;
  onNavigateHome: () => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  subscribedAppIds,
  onToggleSubscription,
  onSelectAppDetail,
  onLaunchApp,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'available'>('all');
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);

  const categories = [
    'All',
    'Finance & Payments',
    'Sales & CRM',
    'Projects & Work',
    'Organization & HR',
    'Operations & Support',
    'Warehouse & Inventory',
    'Legal & Practice Management',
  ];

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-red-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-red-600" />;
      case 'ReceiptText':
        return <ReceiptText className="w-5 h-5 text-red-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-red-600" />;
      case 'Kanban':
        return <Kanban className="w-5 h-5 text-red-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-red-600" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-red-600" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-red-600" />;
      case 'LifeBuoy':
        return <LifeBuoy className="w-5 h-5 text-red-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-red-600" />;
      case 'Package':
        return <Package className="w-5 h-5 text-red-600" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-red-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-red-600" />;
    }
  };

  const filteredApps = useMemo(() => {
    return APPLICATIONS_CATALOG.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || app.category === selectedCategory;

      const isSubscribed = subscribedAppIds.includes(app.id);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'subscribed' && isSubscribed) ||
        (statusFilter === 'available' && !isSubscribed);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, statusFilter, subscribedAppIds]);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-red-600 dark:text-red-500">
          <button onClick={onNavigateHome} className="hover:underline">
            Home
          </button>
          <span>/</span>
          <span>Digital Applications</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tracking-tight">
          Paperglow Business Applications
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Explore our directory of purpose-built business software products. Every application connects to your single Paperglow account with unified permissions and centralized billing.
        </p>
      </div>

      {/* Control Bar: Search + Category Tabs + Billing Cadence Toggle */}
      <div className="space-y-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#14171d]">
        {/* Top Controls: Search + Status Filter + Billing Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications by name, capability, or keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Status & Billing Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status segmented buttons */}
            <div className="flex items-center p-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                All Apps ({APPLICATIONS_CATALOG.length})
              </button>
              <button
                onClick={() => setStatusFilter('subscribed')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'subscribed'
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Subscribed ({subscribedAppIds.length})
              </button>
              <button
                onClick={() => setStatusFilter('available')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'available'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Available to Add
              </button>
            </div>

            {/* Annual vs Monthly Toggle */}
            <div className="flex items-center space-x-2 text-xs text-neutral-600 dark:text-neutral-400 pl-2">
              <span className={!isAnnualBilling ? 'font-bold text-neutral-900 dark:text-neutral-100' : ''}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnualBilling(!isAnnualBilling)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  isAnnualBilling ? 'bg-red-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isAnnualBilling ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={isAnnualBilling ? 'font-bold text-red-600 dark:text-red-500' : ''}>
                Annual <span className="text-[10px] text-emerald-600 font-bold">(Save 18%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-semibold text-neutral-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl space-y-3">
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            No applications match your search filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStatusFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white"
          >
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const isSubscribed = subscribedAppIds.includes(app.id);
            const price = isAnnualBilling ? app.annualPrice : app.monthlyPrice;

            return (
              <div
                key={app.id}
                className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-col justify-between space-y-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-xs"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Category + Subscription Status */}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 flex items-center justify-center">
                      {getAppIcon(app.iconName)}
                    </div>
                    <div className="text-right">
                      {isSubscribed ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Subscription</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium">
                          Available to Add
                        </span>
                      )}
                    </div>
                  </div>

                  {/* App Title & Version */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        {app.name}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {app.version}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-500 mt-0.5">
                      {app.tagline}
                    </p>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {app.shortDescription}
                  </p>

                  {/* Main Commercial Benefit */}
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[10px] font-bold uppercase text-neutral-500 mb-0.5">
                      Operational Benefit
                    </div>
                    <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                      {app.mainBenefit}
                    </p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-1 flex items-baseline justify-between border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs text-neutral-500">Workspace License</span>
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                        ${price}
                      </span>
                      <span className="text-xs text-neutral-500"> / month</span>
                      {isAnnualBilling && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          Billed annually (${price * 12}/yr)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    {/* If subscribed: Launch App Button */}
                    {isSubscribed ? (
                      <button
                        onClick={() => onLaunchApp(app)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <span>Access App</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleSubscription(app.id)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <span>Subscribe Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* View Details Page */}
                    <button
                      onClick={() => onSelectAppDetail(app.id)}
                      className="py-2 px-3 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Details
                    </button>
                  </div>

                  {/* Secondary toggle if subscribed */}
                  {isSubscribed && (
                    <button
                      onClick={() => onToggleSubscription(app.id)}
                      className="w-full text-center text-[11px] text-neutral-500 hover:text-red-600 transition-colors"
                    >
                      Cancel or change subscription tier
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ecosystem Trust Banner */}
      <div className="p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#121419] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-red-600">
            <ShieldCheck className="w-4 h-4" />
            <span>The Paperglow Product Standard</span>
          </div>
          <h4 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            One Sign-On. Unified Team Directory. Zero Bloat.
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
            All applications run on the Paperglow SSO infrastructure. User accounts, permissions, and payment cards stay synchronized automatically across your entire workspace.
          </p>
        </div>
        <button
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          Return to Platform Overview
        </button>
      </div>
    </div>
  );
};
