import React, { useState } from 'react';
import { BusinessApp } from '../types';
import { AppScreenshotsViewer } from '../components/AppScreenshotsViewer';
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  ShieldCheck,
  Star,
  ExternalLink,
  ArrowRight,
  HelpCircle,
  ReceiptText,
  Users,
  Kanban,
  FileCheck,
  ChevronDown,
} from 'lucide-react';

interface ApplicationDetailPageProps {
  app: BusinessApp;
  isSubscribed: boolean;
  onToggleSubscription: (appId: string) => void;
  onLaunchApp: (app: BusinessApp) => void;
  onBackToDirectory: () => void;
  onOpenAccount: () => void;
}

export const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({
  app,
  isSubscribed,
  onToggleSubscription,
  onLaunchApp,
  onBackToDirectory,
  onOpenAccount,
}) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Finance & Payments':
        return <ReceiptText className="w-5 h-5 text-red-600" />;
      case 'Sales & CRM':
        return <Users className="w-5 h-5 text-red-600" />;
      case 'Projects & Work':
        return <Kanban className="w-5 h-5 text-red-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-neutral-500 font-medium">
        <button
          onClick={onBackToDirectory}
          className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Applications Directory</span>
        </button>
        <span>/</span>
        <span className="text-red-600 dark:text-red-500 font-semibold">{app.name}</span>
      </div>

      {/* Product Hero Header */}
      <div className="p-8 sm:p-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
                {app.category}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {app.version}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{app.rating}</span>
              </div>
              <span className="text-xs text-neutral-500">
                ({app.userCountText})
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                {app.name}
              </h1>
              <p className="text-base text-red-600 dark:text-red-500 font-medium mt-1">
                {app.tagline}
              </p>
            </div>

            {/* Detailed Description */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
              {app.description}
            </p>

            {/* Core Value Statement */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
              <div className="text-[11px] font-bold uppercase text-neutral-500 mb-0.5">
                Primary Business Impact
              </div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {app.mainBenefit}
              </p>
            </div>
          </div>

          {/* Pricing & Subscribe Action Box */}
          <div className="w-full lg:w-80 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#181c24] space-y-4">
            <div>
              <span className="text-xs text-neutral-500">Workspace Subscription</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                  ${isAnnual ? app.annualPrice : app.monthlyPrice}
                </span>
                <span className="text-xs text-neutral-500">/ workspace / mo</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                {isAnnual ? 'Billed annually (Includes 18% savings)' : 'Billed monthly'}
              </div>
            </div>

            {/* Status indicator */}
            <div className="py-2 border-y border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">Subscription Status:</span>
              {isSubscribed ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <span className="font-medium text-neutral-500">Available to Add</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {isSubscribed ? (
                <>
                  <button
                    onClick={() => onLaunchApp(app)}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <span>Launch Application</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onToggleSubscription(app.id)}
                    className="w-full py-2 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel Workspace Subscription
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onToggleSubscription(app.id)}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                >
                  <span>Subscribe to {app.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={onOpenAccount}
                className="w-full text-center text-[11px] text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors pt-1"
              >
                Manage all apps via Paperglow Central Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Walkthrough & Interactive Screenshots */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
            Interface Walkthrough
          </span>
          <h2 className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Real Software Screenshots &amp; Workflow Previews
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Examine the operational views included with your {app.name} subscription.
          </p>
        </div>

        <AppScreenshotsViewer screenshots={app.screenshots} appName={app.name} />
      </div>

      {/* Full Feature Grid */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
            Capabilities Included
          </span>
          <h2 className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Engineered for High-Velocity Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {app.features.map((feature, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex items-start space-x-3 text-xs text-neutral-800 dark:text-neutral-200"
            >
              <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span className="leading-relaxed font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers Table */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
              Licensing Tiers
            </span>
            <h2 className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Select Your Workspace Tier
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Scale up or down anytime with prorated billing.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center space-x-3 text-xs p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 w-fit">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                !isAnnual ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                isAnnual ? 'bg-red-600 text-white shadow-xs' : 'text-neutral-500'
              }`}
            >
              Annual (Save 18%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {app.pricingTiers.map((tier, idx) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div
                key={idx}
                className={`p-6 rounded-xl border flex flex-col justify-between space-y-6 ${
                  tier.popular
                    ? 'border-red-600 bg-white dark:bg-[#161a22] shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                      {tier.name}
                    </h3>
                    {tier.popular && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {tier.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                      ${price}
                    </span>
                    <span className="text-xs text-neutral-500"> / month</span>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                    <div className="text-[11px] font-bold uppercase text-neutral-500">
                      Features Included:
                    </div>
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onToggleSubscription(app.id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSubscribed
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'
                      : tier.popular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white'
                  }`}
                >
                  {isSubscribed ? 'Active in Workspace' : `Select ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & SSO Architecture Specs */}
      <div className="p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#121419] space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase text-red-600">
          <ShieldCheck className="w-4 h-4" />
          <span>Security &amp; Data Safeguards</span>
        </div>
        <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
          Enterprise Security Standard on Every Plan
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          {app.name} is architected for strict data boundaries. Your company records are never co-mingled, and staff credentials synchronize via encrypted Paperglow SSO tokens.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {app.securityHighlights.map((sh, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 font-medium"
            >
              {sh}
            </div>
          ))}
        </div>
      </div>

      {/* Product FAQs */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase text-neutral-500">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
          Everything You Need to Know About {app.name}
        </h3>

        <div className="space-y-2 pt-2">
          {app.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-neutral-100 hover:text-red-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky-style CTA Card */}
      <div className="p-8 rounded-xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-xl font-bold font-['Poppins']">
            Ready to integrate {app.name} into your workspace?
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            Access starts immediately. Zero setup fees or long-term contracts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleSubscription(app.id)}
            className="px-6 py-2.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            {isSubscribed ? 'Subscribed (Manage in Account)' : 'Subscribe Now'}
          </button>
          <button
            onClick={onBackToDirectory}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold border border-neutral-700 hover:bg-neutral-800 text-neutral-300"
          >
            View Other Apps
          </button>
        </div>
      </div>
    </div>
  );
};
