import React, { useState } from 'react';
import {
  Menu,
  Search,
  ShoppingCart,
  Plus,
  Pill,
  Sun,
  Moon,
  ChevronDown,
  AlertTriangle,
  Truck,
  Receipt,
} from 'lucide-react';
import { PharmModule } from '../../types/pharmacyManager';
import { CloudSyncIndicator } from '../ui/CloudSyncIndicator';

interface PharmHeaderProps {
  currentModule: PharmModule;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lowStockCount: number;
  expiringCount: number;
  onOpenAlerts: () => void;
  onQuickNewSale: () => void;
  onQuickAddMedicine: () => void;
  onQuickAddPO: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  isCloudSyncing?: boolean;
  isCloudOnline?: boolean;
  onManualSync?: () => void;
}

export const PharmHeader: React.FC<PharmHeaderProps> = ({
  currentModule,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  lowStockCount,
  expiringCount,
  onOpenAlerts,
  onQuickNewSale,
  onQuickAddMedicine,
  onQuickAddPO,
  isDark,
  onToggleDarkMode,
  isCloudSyncing,
  isCloudOnline,
  onManualSync,
}) => {
  const [isQuickOpen, setIsQuickOpen] = useState(false);

  const getModuleTitle = (m: PharmModule) => {
    switch (m) {
      case 'dashboard':
        return 'Dispensary Cockpit & Today Overview';
      case 'inventory':
        return 'Medicine & Product Inventory';
      case 'stock':
        return 'Stock Movements & Batch Expiry Tracking';
      case 'sales':
        return 'Point of Sale (POS) & Prescriptions';
      case 'purchases':
        return 'Purchase Orders & Inbound Stock';
      case 'customers':
        return 'Patient Records & Chronic Refills';
      case 'suppliers':
        return 'Pharmaceutical Suppliers Directory';
      case 'reports':
        return 'Sales, Margins & Valuation Reports';
      case 'expenses':
        return 'Pharmacy Operational Expenses';
      case 'staff':
        return 'Pharmacists & Techs Registry';
      case 'settings':
        return 'Premises License & Receipt Settings';
      default:
        return 'Pharmacy Manager';
    }
  };

  const totalAlerts = lowStockCount + expiringCount;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#11141a]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Breadcrumbs */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-sm">
          <span className="hidden sm:inline font-medium text-neutral-400 dark:text-neutral-500">
            Pharmacy Manager
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600">/</span>
          <h1 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base tracking-tight truncate max-w-[200px] sm:max-w-none">
            {getModuleTitle(currentModule)}
          </h1>
        </div>
      </div>

      {/* Middle: Quick Medicine Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search medicine, generic, batch, SKU..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700/80 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Right: Quick Action, Alerts Counter, Dark Mode */}
      <div className="flex items-center space-x-2.5">
        <CloudSyncIndicator
          appName="Pharmacy Manager"
          isSyncing={isCloudSyncing}
          isOnline={isCloudOnline}
          onManualSync={onManualSync}
        />

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickOpen(!isQuickOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Quick Action</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {isQuickOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsQuickOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1.5 z-40 text-xs animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickNewSale();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>New Dispense (POS Sale)</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAddMedicine();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Pill className="w-4 h-4 text-red-600" />
                  <span>Register New Medicine</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAddPO();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>New Purchase Order (PO)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Alerts Pill Button */}
        {totalAlerts > 0 && (
          <button
            onClick={onOpenAlerts}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
            title={`${lowStockCount} low stock, ${expiringCount} expiring soon`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-mono tabular-nums">{totalAlerts}</span>
          </button>
        )}

        {/* Dark Mode */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Toggle light/dark theme"
        >
          {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </div>
    </header>
  );
};
