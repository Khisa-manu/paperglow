import React, { useState } from 'react';
import { SchoolSettings } from '../../types/schoolManager';
import { Settings, Save, RotateCcw, Check, Building2, CreditCard, Award } from 'lucide-react';

interface SettingsModuleProps {
  settings: SchoolSettings;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
}) => {
  const [form, setForm] = useState<SchoolSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            School Configuration &amp; Academic Settings
          </h1>
          <p className="text-xs text-neutral-500">
            Institutional profile, MOE accreditation, academic calendar, banking and grading scales
          </p>
        </div>

        <button
          onClick={onResetDemoData}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>School configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: School Identity */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
          <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <Building2 className="w-4 h-4 text-red-600" />
            <h2 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              1. Institutional Identity &amp; Accreditations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Official School Name
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                School Motto
              </label>
              <input
                type="text"
                value={form.motto}
                onChange={(e) => setForm({ ...form, motto: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Ministry of Education Registration No.
              </label>
              <input
                type="text"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                NEMIS Institution Code
              </label>
              <input
                type="text"
                value={form.nemisCode}
                onChange={(e) => setForm({ ...form, nemisCode: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                KNEC National Examination Center Code
              </label>
              <input
                type="text"
                value={form.knecCenterCode}
                onChange={(e) => setForm({ ...form, knecCenterCode: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Chief Principal / Head of Institution
              </label>
              <input
                type="text"
                value={form.principalName}
                onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Physical Campus Location
              </label>
              <input
                type="text"
                value={form.physicalAddress}
                onChange={(e) => setForm({ ...form, physicalAddress: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Official Postal Address
              </label>
              <input
                type="text"
                value={form.poBox}
                onChange={(e) => setForm({ ...form, poBox: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Term Settings */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
          <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <Award className="w-4 h-4 text-red-600" />
            <h2 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              2. Academic Year &amp; Term Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Academic Year
              </label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Current Active Term
              </label>
              <select
                value={form.currentTerm}
                onChange={(e) => setForm({ ...form, currentTerm: e.target.value as any })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-bold focus:outline-none"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Operational Currency
              </label>
              <input
                type="text"
                readOnly
                value="KES (Kenyan Shillings)"
                className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial & Paybill Details */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
          <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <CreditCard className="w-4 h-4 text-red-600" />
            <h2 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              3. Fee Collection Channels (M-Pesa Paybill &amp; Banking)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                M-Pesa Business Paybill Number
              </label>
              <input
                type="text"
                value={form.mpesaPaybill}
                onChange={(e) => setForm({ ...form, mpesaPaybill: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                M-Pesa Account Reference Prefix
              </label>
              <input
                type="text"
                value={form.mpesaAccountPrefix}
                onChange={(e) => setForm({ ...form, mpesaAccountPrefix: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Bank Name &amp; Branch
              </label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Bank Account Number
              </label>
              <input
                type="text"
                value={form.bankAccountNumber}
                onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
