import React, { useState } from 'react';
import { BusinessApp } from '../types';
import { X, CheckCircle2, ArrowUpRight, Plus, ExternalLink, Package, ShieldCheck } from 'lucide-react';

interface AccountDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: BusinessApp[];
  subscribedAppIds: string[];
  onToggleSubscription: (appId: string) => void;
  brandingInquiries: string[];
  onExploreApps: () => void;
}

export const AccountDashboardModal: React.FC<AccountDashboardModalProps> = ({
  isOpen,
  onClose,
  apps,
  subscribedAppIds,
  onToggleSubscription,
  brandingInquiries,
  onExploreApps,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'branding' | 'settings'>('apps');
  const [launchedApp, setLaunchedApp] = useState<BusinessApp | null>(null);

  if (!isOpen) return null;

  const subscribedApps = apps.filter((app) => subscribedAppIds.includes(app.id));

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">
              PG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Paperglow Central Account
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                  Workspace: Apex Operations
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Single sign-on access across business software and physical branding orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center space-x-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('apps')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'apps'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            My Subscribed Applications ({subscribedApps.length})
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'branding'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Branding &amp; Merchandise Orders ({brandingInquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Account &amp; SSO Security
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === 'apps' && (
            <div className="space-y-4">
              {launchedApp && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Active session established for <strong>{launchedApp.name}</strong>. Ready for daily operations.
                    </span>
                  </div>
                  <button
                    onClick={() => setLaunchedApp(null)}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {subscribedApps.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    You do not have any active business application subscriptions yet.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onExploreApps();
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Browse Business Applications Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscribedApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold uppercase text-red-600">
                            {app.category}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold">
                            Active
                          </span>
                        </div>
                        <h4 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                          {app.name}
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                          {app.tagline}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <button
                          onClick={() => setLaunchedApp(app)}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1"
                        >
                          <span>Launch App</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onToggleSubscription(app.id)}
                          className="text-xs text-neutral-500 hover:text-red-600"
                        >
                          Manage Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add more apps helper */}
              <div className="pt-4 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
                <span>Want to enable additional software for your organization?</span>
                <button
                  onClick={() => {
                    onClose();
                    onExploreApps();
                  }}
                  className="font-semibold text-red-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Explore Catalog
                </button>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4">
              {brandingInquiries.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl space-y-2">
                  <Package className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    No active merchandise or branding quote requests on file.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Browse the Branding &amp; Customization catalog on the homepage to order uniforms, apparel, banners, or design services.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase text-neutral-500">
                    Recent Customization Requests
                  </div>
                  {brandingInquiries.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="w-4 h-4 text-red-600" />
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-neutral-100">
                            {item}
                          </div>
                          <div className="text-neutral-500">Status: Print production review &amp; proofing</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                        In Review
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3">
                <div className="flex items-center space-x-2 font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Paperglow Unified Identity Protocol</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Your credentials grant access to all subscribed Paperglow applications. Adding or revoking team members in <strong>Paperglow Team</strong> updates active sessions in real time.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-neutral-700 dark:text-neutral-300">
                  <div>
                    <span className="font-semibold block text-neutral-500">Admin Email:</span>
                    admin@apexoperations.io
                  </div>
                  <div>
                    <span className="font-semibold block text-neutral-500">Organization ID:</span>
                    PG-WORKSPACE-8402
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Paperglow Central Workspace • Secure SSO Session</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold hover:bg-neutral-300"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
