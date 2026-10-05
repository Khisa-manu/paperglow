import React from 'react';
import { BMModule } from '../../types/businessManager';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  WalletCards,
  BarChart3,
  UserCheck,
  CalendarCheck2,
  MessageSquare,
  CreditCard,
  Settings,
  AlertTriangle,
  X,
} from 'lucide-react';

interface BMSidebarProps {
  currentModule: BMModule;
  onSelectModule: (module: BMModule) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  lowStockCount: number;
  unpaidInvoiceCount: number;
  pendingOrderCount: number;
}

export const BMSidebar: React.FC<BMSidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  lowStockCount,
  unpaidInvoiceCount,
  pendingOrderCount,
}) => {
  const navItems: { id: BMModule; label: string; icon: React.FC<{ className?: string }>; badgeCount?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales & Invoicing', icon: Receipt, badgeCount: unpaidInvoiceCount, badgeColor: 'bg-red-500 text-white' },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badgeCount: lowStockCount, badgeColor: 'bg-amber-500 text-white' },
    { id: 'customers', label: 'Customers CRM', icon: Users },
    { id: 'expenses', label: 'Expenses', icon: WalletCards },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'employees', label: 'Employees & Shifts', icon: UserCheck },
    { id: 'orders', label: 'Orders & Appointments', icon: CalendarCheck2, badgeCount: pendingOrderCount, badgeColor: 'bg-blue-500 text-white' },
    { id: 'messages', label: 'Customer Messages', icon: MessageSquare },
    { id: 'payments', label: 'Payments & M-Pesa', icon: CreditCard },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-neutral-900 text-neutral-100 flex flex-col border-r border-neutral-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-red-600 flex items-center justify-center text-white font-bold tracking-wider shadow-sm">
              PG
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Paperglow</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-red-950 text-red-400 border border-red-800/50">
                  Biz Ops
                </span>
              </div>
              <div className="text-xs text-neutral-400">Business Manager</div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Modules */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Operations &amp; Finance
          </div>
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold shadow-xs'
                    : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-red-600' : item.badgeColor
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Currency & Business Badge */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Operating Currency</span>
            <span className="font-semibold text-neutral-200">KES (Kenyan Shilling)</span>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
            <span>KRA Tax Compliance</span>
            <span className="font-semibold text-emerald-400">16% VAT Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};
