import React from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Building,
  Banknote,
  Wrench,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { PMModule } from '../../types/propertyManager';

interface PMHeaderProps {
  currentModule: PMModule;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onQuickRecordRent: () => void;
  onQuickAddProperty: () => void;
  onQuickAddTicket: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const PMHeader: React.FC<PMHeaderProps> = ({
  currentModule,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  unreadCount,
  onOpenNotifications,
  onQuickRecordRent,
  onQuickAddProperty,
  onQuickAddTicket,
  isDark,
  onToggleDarkMode,
}) => {
  const [isQuickOpen, setIsQuickOpen] = React.useState(false);

  const getModuleTitle = (m: PMModule) => {
    switch (m) {
      case 'dashboard':
        return 'Executive Portfolio Overview';
      case 'properties':
        return 'Properties & Unit Inventory';
      case 'tenants':
        return 'Tenant Directory & Profiles';
      case 'rent':
        return 'Rent Collection & Balances';
      case 'leases':
        return 'Lease Agreements & Renewals';
      case 'maintenance':
        return 'Maintenance & Fundi Tasks';
      case 'expenses':
        return 'Operating Expenses Ledger';
      case 'reports':
        return 'Financial Statements & Reports';
      case 'notifications':
        return 'Reminders & Notifications';
      default:
        return 'Property Manager';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#11141a]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger + Breadcrumb */}
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
            Property Manager
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600">/</span>
          <h1 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base tracking-tight">
            {getModuleTitle(currentModule)}
          </h1>
        </div>
      </div>

      {/* Middle: Search Box */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tenant, unit, receipt, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700/80 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Right: Quick Action, Alerts, Dark Mode */}
      <div className="flex items-center space-x-2.5">
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
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1.5 z-40 text-xs animate-in fade-in slide-in-from-top-1 duration-100">
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickRecordRent();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Record Rent Payment</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAddTicket();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-amber-600" />
                  <span>New Maintenance Request</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickOpen(false);
                    onQuickAddProperty();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Building className="w-4 h-4 text-red-600" />
                  <span>Add New Property</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Reminders & Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          )}
        </button>

        {/* Dark Mode Toggle */}
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
