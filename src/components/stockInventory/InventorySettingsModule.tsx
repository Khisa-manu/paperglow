import React, { useState } from 'react';
import {
  Settings,
  Building,
  Save,
  DollarSign,
  Barcode,
  Sliders,
  CheckCircle2,
  Bell,
  RotateCcw,
} from 'lucide-react';
import { InventorySettings } from '../../types/stockInventory';

interface InventorySettingsModuleProps {
  settings: InventorySettings;
  onUpdateSettings: (updated: InventorySettings) => void;
  onResetDemoData: () => void;
}

export const InventorySettingsModule: React.FC<InventorySettingsModuleProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
}) => {
  const [form, setForm] = useState<InventorySettings>(settings);
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
            Warehouse Policies &amp; Inventory Parameters
          </h2>
          <p className="text-xs text-neutral-500">
            Configure default KES currency, accounting valuation methods, automated SKU prefixing, and safety stock limits.
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
            <span>Warehouse Business Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Company Trading Name *
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
                Business Tagline
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
                Warehouse / Yard Physical Address
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
                City / Location
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                KRA PIN Certificate
              </label>
              <input
                type="text"
                value={form.kraPin}
                onChange={(e) => setForm({ ...form, kraPin: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Primary Warehouse Depot
              </label>
              <input
                type="text"
                value={form.defaultWarehouse}
                onChange={(e) => setForm({ ...form, defaultWarehouse: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Valuation Method & Currency */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Valuation &amp; Currency Controls</span>
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
                Stock Valuation Method
              </label>
              <select
                value={form.stockValuationMethod}
                onChange={(e) =>
                  setForm({ ...form, stockValuationMethod: e.target.value as any })
                }
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="FIFO">FIFO (First-In, First-Out)</option>
                <option value="Weighted Average">Weighted Average Cost</option>
                <option value="LIFO">LIFO (Last-In, First-Out)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Default Safety Stock Level (Units)
              </label>
              <input
                type="number"
                min="1"
                value={form.lowStockGlobalThreshold}
                onChange={(e) =>
                  setForm({ ...form, lowStockGlobalThreshold: parseInt(e.target.value, 10) || 5 })
                }
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: SKU & Barcode Prefixing */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <Barcode className="w-4 h-4 text-blue-600" />
            <span>Product Numbering &amp; Barcode Format</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                SKU Prefix Pattern
              </label>
              <input
                type="text"
                value={form.skuPrefix}
                onChange={(e) => setForm({ ...form, skuPrefix: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                GS1 / Barcode Company Prefix (6 digits)
              </label>
              <input
                type="text"
                value={form.barcodePrefix}
                onChange={(e) => setForm({ ...form, barcodePrefix: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="autoGenSku"
              checked={form.autoGenerateSku}
              onChange={(e) => setForm({ ...form, autoGenerateSku: e.target.checked })}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <label htmlFor="autoGenSku" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
              Automatically assign sequential SKUs when adding new inventory items
            </label>
          </div>
        </div>

        {/* Section 4: Operational Preferences */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-['Poppins']">
            <Bell className="w-4 h-4 text-purple-600" />
            <span>Alert Preferences</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailAlerts"
                checked={form.emailAlerts}
                onChange={(e) => setForm({ ...form, emailAlerts: e.target.checked })}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="emailAlerts" className="text-neutral-700 dark:text-neutral-300 cursor-pointer">
                Dispatch daily low-stock summary email to inventory supervisor
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smsAlerts"
                checked={form.smsAlerts}
                onChange={(e) => setForm({ ...form, smsAlerts: e.target.checked })}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="smsAlerts" className="text-neutral-700 dark:text-neutral-300 cursor-pointer">
                Send urgent Safaricom SMS alert when a fast-moving item reaches 0 quantity
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Inventory Settings</span>
          </button>
        </div>
      </form>

      {/* Demo Reset Card */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-['Poppins']">
            Demo State Management
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            Reset warehouse stock, movement logs, purchase orders, and sales back to default demo state.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetDemoData}
          className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Demo Inventory</span>
        </button>
      </div>
    </div>
  );
};
