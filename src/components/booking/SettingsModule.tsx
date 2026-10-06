import React, { useState } from 'react';
import {
  Settings,
  Building,
  Save,
  Clock,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { BookingBusinessSettings } from '../../types/booking';

interface SettingsModuleProps {
  settings: BookingBusinessSettings;
  onUpdateSettings: (updated: BookingBusinessSettings) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [form, setForm] = useState<BookingBusinessSettings>(settings);
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
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Business Profile, Booking Policies &amp; M-Pesa Setup
          </h2>
          <p className="text-xs text-neutral-500">
            Configure business identity, cancellation windows, deposit policies, and mobile money payout parameters.
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
        {/* Section 1: Business Profile */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <Building className="w-4 h-4 text-red-600" />
            <span>Business Credentials &amp; Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Business Trading Name *
              </label>
              <input
                type="text"
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Tagline / Service Category
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Kenya KRA PIN
              </label>
              <input
                type="text"
                value={form.kraPin}
                onChange={(e) => setForm({ ...form, kraPin: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Booking Rules & Policies */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <Clock className="w-4 h-4 text-red-600" />
            <span>Scheduling Rules &amp; Buffer Windows</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Slot Grid Duration (Minutes)
              </label>
              <input
                type="number"
                value={form.slotDurationMinutes}
                onChange={(e) => setForm({ ...form, slotDurationMinutes: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Minimum Advance Notice (Hours)
              </label>
              <input
                type="number"
                value={form.advanceNoticeHours}
                onChange={(e) => setForm({ ...form, advanceNoticeHours: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Free Cancellation Window (Hours)
              </label>
              <input
                type="number"
                value={form.cancellationFreeHours}
                onChange={(e) => setForm({ ...form, cancellationFreeHours: parseInt(e.target.value) || 12 })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Safaricom M-Pesa & Payment Parameters */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Safaricom M-Pesa &amp; Deposit Terms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Safaricom Paybill / Till Number
              </label>
              <input
                type="text"
                value={form.mpesaPaybill}
                onChange={(e) => setForm({ ...form, mpesaPaybill: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Account Number Reference Format
              </label>
              <input
                type="text"
                value={form.mpesaAccountNumber}
                onChange={(e) => setForm({ ...form, mpesaAccountNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Required Deposit Percentage (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.depositPercentage}
                onChange={(e) => setForm({ ...form, depositPercentage: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
