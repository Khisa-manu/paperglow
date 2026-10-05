import React from 'react';
import { BusinessApp } from '../types';
import { X, Check, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AppDetailModalProps {
  app: BusinessApp | null;
  isSubscribed: boolean;
  onToggleSubscription: (appId: string) => void;
  onViewFullDetail?: (appId: string) => void;
  onClose: () => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  isSubscribed,
  onToggleSubscription,
  onViewFullDetail,
  onClose,
}) => {
  if (!app) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
              {app.category}
            </span>
            <h2 className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              {app.name}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {app.tagline}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Benefit Box */}
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
            <div className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">
              Core Commercial Value
            </div>
            <p className="text-sm font-medium text-red-900 dark:text-red-200 leading-relaxed">
              {app.mainBenefit}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Overview
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {app.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Key Capabilities Included
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {app.features.map((feature, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-sm text-neutral-800 dark:text-neutral-200">
                  <Check className="w-4 h-4 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Access */}
          <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span>Enterprise Single Sign-On (SSO) &amp; Centralized Role Management</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Subscription Tier</div>
            <div className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              ${app.monthlyPrice} <span className="text-xs font-normal text-neutral-500">/ workspace / month</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {onViewFullDetail && (
              <button
                type="button"
                onClick={() => onViewFullDetail(app.id)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                View Screenshots &amp; Tiers
              </button>
            )}
            <button
              onClick={() => onToggleSubscription(app.id)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                isSubscribed
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
              }`}
            >
              {isSubscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Subscribed (Click to Cancel)</span>
                </>
              ) : (
                <>
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
