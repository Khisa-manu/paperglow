import React from 'react';
import {
  Boxes,
  Search,
  Plus,
  ArrowLeft,
  Moon,
  Sun,
  Barcode,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { InventoryModule } from '../../types/stockInventory';
import { CloudSyncIndicator } from '../ui/CloudSyncIndicator';

interface StockInventoryHeaderProps {
  currentModule: InventoryModule;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddProduct: () => void;
  onNavigateBarcode: () => void;
  onBackToPaperglow: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  lowStockCount: number;
  outOfStockCount: number;
  isCloudSyncing?: boolean;
  isCloudOnline?: boolean;
  onManualSync?: () => void;
}

export const StockInventoryHeader: React.FC<StockInventoryHeaderProps> = ({
  currentModule,
  searchQuery,
  onSearchChange,
  onOpenAddProduct,
  onNavigateBarcode,
  onBackToPaperglow,
  isDark,
  toggleDarkMode,
  lowStockCount,
  outOfStockCount,
  isCloudSyncing,
  isCloudOnline,
  onManualSync,
}) => {
  const getModuleTitle = (mod: InventoryModule) => {
    switch (mod) {
      case 'dashboard':
        return 'Inventory & Stock Operations Cockpit';
      case 'products':
        return 'Product Catalog & SKU Registry';
      case 'stock_management':
        return 'Stock Movements, In/Out & Adjustments';
      case 'alerts':
        return 'Low Stock & Replenishment Alerts';
      case 'suppliers':
        return 'Vendor & Supplier Management';
      case 'purchases':
        return 'Purchase Orders & Stock Receiving';
      case 'sales':
        return 'Sales Orders & Stock-Out Dispatch';
      case 'categories':
        return 'Product Categories & Grouping';
      case 'barcode':
        return 'Barcode Scanner & Product Lookup';
      case 'reports':
        return 'Stock Valuation & Inventory Reports';
      case 'settings':
        return 'Warehouse & Inventory Settings';
      default:
        return 'Paperglow Stock Inventory';
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#12151b] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Back Link & Module Title */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-xl">
        <button
          onClick={onBackToPaperglow}
          title="Return to Paperglow Suite"
          className="text-neutral-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Paperglow Suite</span>
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] tracking-tight">
              {getModuleTitle(currentModule)}
            </h1>
            {outOfStockCount > 0 && (
              <span className="hidden lg:inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>{outOfStockCount} Out of Stock</span>
              </span>
            )}
            {lowStockCount > 0 && (
              <span className="hidden xl:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                {lowStockCount} Low Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="w-full relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search SKU, barcode, product name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-red-500 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <CloudSyncIndicator
          appName="Stock Inventory"
          isSyncing={isCloudSyncing}
          isOnline={isCloudOnline}
          onManualSync={onManualSync}
        />

        {/* Barcode Quick Trigger */}
        <button
          onClick={onNavigateBarcode}
          title="Open Barcode Scanner Interface"
          className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border border-neutral-200 dark:border-neutral-800"
        >
          <Barcode className="w-4 h-4 text-red-600" />
          <span className="hidden sm:inline">Scanner</span>
        </button>

        {/* New Product Button */}
        <button
          onClick={onOpenAddProduct}
          className="px-3 sm:px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
