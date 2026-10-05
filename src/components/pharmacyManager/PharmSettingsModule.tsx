import React, { useState } from 'react';
import {
  Settings,
  Building,
  ShieldCheck,
  Receipt,
  Bell,
  Save,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { PharmacySettings } from '../../types/pharmacyManager';

interface PharmSettingsModuleProps {
  settings: PharmacySettings;
  onSaveSettings: (settings: PharmacySettings) => void;
}

export const PharmSettingsModule: React.FC<PharmSettingsModuleProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<PharmacySettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-600" />
          <span>Premises &amp; Dispensary Settings</span>
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure Pharmacy and Poisons Board premises details, Safaricom M-Pesa till credentials, and stock alert levels.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pharmacy Legal Profile */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Building className="w-4 h-4 text-red-600" />
            <span>Premises Regulatory Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Pharmacy / Chemist Business Name
              </label>
              <input
                type="text"
                value={formData.pharmacyName}
                onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                PPB Premises License Number
              </label>
              <input
                type="text"
                value={formData.ppbPremisesLicense}
                onChange={(e) => setFormData({ ...formData, ppbPremisesLicense: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Kenya Revenue Authority (KRA) PIN
              </label>
              <input
                type="text"
                value={formData.kraPin}
                onChange={(e) => setFormData({ ...formData, kraPin: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                County of Operation
              </label>
              <input
                type="text"
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Physical Street Address (As inspected by PPB)
              </label>
              <input
                type="text"
                value={formData.physicalAddress}
                onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Dispensary Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>
          </div>
        </div>

        {/* Payments & M-Pesa Settings */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>M-Pesa Safaricom &amp; Currency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Default Currency
              </label>
              <input
                type="text"
                value={formData.defaultCurrency}
                disabled
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                M-Pesa Channel Type
              </label>
              <select
                value={formData.mpesaType}
                onChange={(e) =>
                  setFormData({ ...formData, mpesaType: e.target.value as 'buy_goods_till' | 'paybill' })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              >
                <option value="buy_goods_till">Buy Goods Till Number</option>
                <option value="paybill">Paybill Business Number</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Till / Paybill Number
              </label>
              <input
                type="text"
                value={formData.mpesaTillPaybill}
                onChange={(e) => setFormData({ ...formData, mpesaTillPaybill: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
            </div>
          </div>
        </div>

        {/* Stock Alerts & Thresholds */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Inventory Alert Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Default Minimum Low Stock Threshold (Packs/Bottles)
              </label>
              <input
                type="number"
                min="1"
                value={formData.lowStockThresholdDefault}
                onChange={(e) =>
                  setFormData({ ...formData, lowStockThresholdDefault: Number(e.target.value) || 10 })
                }
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Products falling below this quantity trigger a reorder alert badge.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Expiry Warning Horizon (Days)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={formData.expiryWarningDays}
                onChange={(e) =>
                  setFormData({ ...formData, expiryWarningDays: Number(e.target.value) || 90 })
                }
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                required
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Batches expiring within this window appear on the risk dashboard (PPB Good Practice).
              </span>
            </div>
          </div>
        </div>

        {/* Receipt Legal Disclaimer */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Receipt className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <span>Thermal / Official Receipt Disclaimer</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Receipt Footer Notice (Printed on Customer Receipts)
            </label>
            <textarea
              rows={3}
              value={formData.receiptFooterText}
              onChange={(e) => setFormData({ ...formData, receiptFooterText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3">
          {isSaved && (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Settings saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Premises Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
