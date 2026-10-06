import React from 'react';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  AlertTriangle,
  Truck,
  ShoppingCart,
  TrendingUp,
  Tags,
  Barcode,
  BarChart3,
  Settings,
  X,
  Plus,
} from 'lucide-react';
import { InventoryModule } from '../../types/stockInventory';

interface StockInventorySidebarProps {
  currentModule: InventoryModule;
  onSelectModule: (mod: InventoryModule) => void;
  totalProductsCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingPurchasesCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAddProduct: () => void;
}

export const StockInventorySidebar: React.FC<StockInventorySidebarProps> = ({
  currentModule,
  onSelectModule,
  totalProductsCount,
  lowStockCount,
  outOfStockCount,
  pendingPurchasesCount,
  isMobileOpen,
  onCloseMobile,
  onOpenAddProduct,
}) => {
  const navItems = [
    {
      id: 'dashboard' as InventoryModule,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'products' as InventoryModule,
      label: 'Products & SKUs',
      icon: Package,
      badge: `${totalProductsCount}`,
      badgeColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
    },
    {
      id: 'stock_management' as InventoryModule,
      label: 'Stock In / Out',
      icon: ArrowLeftRight,
    },
    {
      id: 'alerts' as InventoryModule,
      label: 'Low Stock Alerts',
      icon: AlertTriangle,
      badge: lowStockCount + outOfStockCount > 0 ? `${lowStockCount + outOfStockCount}` : undefined,
      badgeColor: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 font-bold',
    },
    {
      id: 'suppliers' as InventoryModule,
      label: 'Suppliers',
      icon: Truck,
    },
    {
      id: 'purchases' as InventoryModule,
      label: 'Purchases & POs',
      icon: ShoppingCart,
      badge: pendingPurchasesCount > 0 ? `${pendingPurchasesCount} Pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      id: 'sales' as InventoryModule,
      label: 'Stock Sales',
      icon: TrendingUp,
    },
    {
      id: 'categories' as InventoryModule,
      label: 'Categories',
      icon: Tags,
    },
    {
      id: 'barcode' as InventoryModule,
      label: 'Barcode Scanner',
      icon: Barcode,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold',
    },
    {
      id: 'reports' as InventoryModule,
      label: 'Reports & Valuation',
      icon: BarChart3,
    },
    {
      id: 'settings' as InventoryModule,
      label: 'Inventory Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#12151b] border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 lg:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
            <span className="font-bold text-sm font-['Poppins']">Paperglow Stock</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Product Button */}
        <div className="p-4 pb-2">
          <button
            onClick={() => {
              onOpenAddProduct();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Product</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-red-600 dark:text-red-400' : 'text-neutral-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Valuation Method
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              FIFO
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Currency</span>
            <span className="font-mono text-neutral-600 dark:text-neutral-300 font-semibold">
              KES (Kenyan Shilling)
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
