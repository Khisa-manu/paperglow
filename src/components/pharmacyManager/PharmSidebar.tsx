import React from 'react';
import {
  Pill,
  BarChart3,
  Package,
  Layers,
  ShoppingCart,
  Truck,
  Users,
  Building2,
  FileSpreadsheet,
  Receipt,
  UserCheck,
  Settings,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { PharmModule } from '../../types/pharmacyManager';

interface PharmSidebarProps {
  currentModule: PharmModule;
  onSelectModule: (module: PharmModule) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  lowStockCount: number;
  expiringCount: number;
  onBackToDirectory?: () => void;
  onNavigateHome: () => void;
}

export const PharmSidebar: React.FC<PharmSidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  lowStockCount,
  expiringCount,
  onBackToDirectory,
  onNavigateHome,
}) => {
  const navItems: {
    id: PharmModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeCount?: number;
    badgeTone?: 'red' | 'amber';
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', label: 'Medicine Catalog', icon: Pill },
    {
      id: 'stock',
      label: 'Stock & Batches',
      icon: Layers,
      badgeCount: lowStockCount + expiringCount,
      badgeTone: 'amber',
    },
    { id: 'sales', label: 'Sales & Dispense', icon: ShoppingCart },
    { id: 'purchases', label: 'Purchase Orders', icon: Truck },
    { id: 'customers', label: 'Patients & Customers', icon: Users },
    { id: 'suppliers', label: 'Pharmaceutical Suppliers', icon: Building2 },
    { id: 'reports', label: 'Reports & Margins', icon: FileSpreadsheet },
    { id: 'expenses', label: 'Pharmacy Expenses', icon: Receipt },
    { id: 'staff', label: 'Pharmacists & Staff', icon: UserCheck },
    { id: 'settings', label: 'Premises Settings', icon: Settings },
  ];

  const handleSelect = (id: PharmModule) => {
    onSelectModule(id);
    onCloseMobile();
  };

  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-neutral-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#11141a] border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Pill className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Paperglow
                </span>
                <span className="text-[10px] font-semibold tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
                  RX
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 -mt-0.5 truncate max-w-[155px]">
                Pharmacy Manager
              </p>
            </div>
          </button>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Regulatory Badge */}
        <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span className="font-medium text-[11px]">PPB Premises Compliant</span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            KES (KSh)
          </span>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Dispensary &amp; Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                      item.badgeTone === 'red'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity ${
                      isActive ? 'opacity-100 text-red-600' : 'text-neutral-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 bg-neutral-50/50 dark:bg-neutral-900/20">
          {onBackToDirectory && (
            <button
              onClick={onBackToDirectory}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Paperglow Directory</span>
              </div>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </button>
          )}

          <div className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-xs">
            <div className="flex items-center justify-between font-medium text-neutral-900 dark:text-neutral-100">
              <span className="truncate">Paperglow Chemists Ltd</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-1.5" title="Dispensary Active" />
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              PPB License: PPB/PREM/2026/8912
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
