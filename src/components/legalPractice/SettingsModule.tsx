import React, { useState } from 'react';
import {
  Settings,
  Building,
  Save,
  DollarSign,
  Scale,
  CheckCircle2,
  Bell,
  RotateCcw,
} from 'lucide-react';
import { LawFirmSettings } from '../../types/legalPractice';

interface SettingsModuleProps {
  settings: LawFirmSettings;
  onUpdateSettings: (updated: LawFirmSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
}) => {
  const [form, setForm] = useState<LawFirmSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Law Firm Profile &amp; Practice Configuration
          </h2>
          <p className="text-xs text-neutral-500">
            Configure official LSK partnership details, KRA tax credentials, client trust bank account, and court reminder preferences.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Firm Profile */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <Building className="w-4 h-4 text-red-600" />
            <span>Official Law Firm Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Firm Legal Name *
              </label>
              <input
                type="text"
                required
                value={form.firmName}
                onChange={(e) => setForm({ ...form, firmName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                LSK Firm Registration No. *
              </label>
              <input
                type="text"
                required
                value={form.lskFirmRegistration}
                onChange={(e) => setForm({ ...form, lskFirmRegistration: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                KRA PIN Certificate *
              </label>
              <input
                type="text"
                required
                value={form.kraPin}
                onChange={(e) => setForm({ ...form, kraPin: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Physical Chambers / Office Address
              </label>
              <input
                type="text"
                value={form.physicalOffice}
                onChange={(e) => setForm({ ...form, physicalOffice: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Official Telephone / Switchboard
              </label>
              <input
                type="text"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Primary Registry Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Billing & Trust Bank Ledger */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Remuneration Scales &amp; Client Trust Account</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Operating Currency
              </label>
              <input
                type="text"
                disabled
                value="KES (Kenyan Shilling)"
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Statutory VAT Rate (%)
              </label>
              <input
                type="number"
                value={form.standardVatPercent}
                onChange={(e) =>
                  setForm({ ...form, standardVatPercent: parseFloat(e.target.value) || 16 })
                }
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Default Hourly Scale Rate (KES)
              </label>
              <input
                type="number"
                value={form.defaultBillingHourlyRateKes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultBillingHourlyRateKes: parseFloat(e.target.value) || 18000,
                  })
                }
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Client Trust Bank Name
              </label>
              <input
                type="text"
                value={form.trustAccountBank}
                onChange={(e) => setForm({ ...form, trustAccountBank: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Client Trust Account No.
              </label>
              <input
                type="text"
                value={form.trustAccountNo}
                onChange={(e) => setForm({ ...form, trustAccountNo: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                M-Pesa Business Paybill
              </label>
              <input
                type="text"
                value={form.mpesaPaybill}
                onChange={(e) => setForm({ ...form, mpespesaPaybill: e.target.value } as any)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Reminders & Alerts */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Court Hearing &amp; Deadline Reminders</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="courtSms"
                checked={form.courtRemindersSms}
                onChange={(e) => setForm({ ...form, courtRemindersSms: e.target.checked })}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="courtSms" className="text-neutral-700 dark:text-neutral-300 cursor-pointer">
                Send Advocate SMS alerts 24 hours prior to Milimani High Court / ELC hearings
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deadlineEmail"
                checked={form.deadlineAlertsEmail}
                onChange={(e) => setForm({ ...form, deadlineAlertsEmail: e.target.checked })}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="deadlineEmail" className="text-neutral-700 dark:text-neutral-300 cursor-pointer">
                Email daily digest of pending registry filing deadlines &amp; statutory limitations
              </label>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetDemoData}
            className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Firm Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
