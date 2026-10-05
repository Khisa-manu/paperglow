import React, { useState } from 'react';
import { BMModule } from '../../types/businessManager';
import {
  Menu,
  Plus,
  Search,
  RotateCcw,
  Receipt,
  Package,
  Users,
  WalletCards,
  CalendarCheck2,
  ChevronDown,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';

interface BMHeaderProps {
  currentModule: BMModule;
  onOpenMobileSidebar: () => void;
  onNavigateHome: () => void;
  onResetDemoData: () => void;
  onQuickAction: (action: 'new-invoice' | 'new-quotation' | 'new-receipt' | 'new-product' | 'new-customer' | 'new-expense' | 'new-order') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  businessName: string;
}

export const BMHeader: React.FC<BMHeaderProps> = ({
  currentModule,
  onOpenMobileSidebar,
  onNavigateHome,
  onResetDemoData,
  onQuickAction,
  searchQuery,
  onSearchChange,
  businessName,
}) => {
  const [isQuickOpen, setIsQuickOpen] = useState(false);

  const moduleTitles: Record<BMModule, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Operations Dashboard', subtitle: "Live snapshot of today's sales, receivables, and team tasks" },
    sales: { title: 'Sales & Invoicing', subtitle: 'Manage invoices, quotations, official receipts and KRA VAT totals' },
    inventory: { title: 'Inventory & Stock Management', subtitle: 'Product catalog, reorder alerts, and stock ledger adjustments' },
    customers: { title: 'Customer Profiles & CRM', subtitle: 'Client dossiers, credit balances, purchase records and notes' },
    expenses: { title: 'Business Expenses', subtitle: 'Record operational costs, vouchers, and monthly overhead summaries' },
    reports: { title: 'Financial & Operational Reports', subtitle: 'Sales performance, net profit analysis, and stock valuation' },
    employees: { title: 'Employees & Work Shifts', subtitle: 'Staff roster, roles, wage rates, and daily attendance clock-ins' },
    orders: { title: 'Orders & Appointments', subtitle: 'Customer job pipeline, service bookings, and fulfillment stages' },
    messages: { title: 'Customer Communications', subtitle: 'Dispatch automated notifications via SMS & WhatsApp templates' },
    payments: { title: 'Payment Processing & M-Pesa', subtitle: 'Track incoming settlements, bank EFTs, and simulate Daraja STK Push' },
    settings: { title: 'Business Profile & Settings', subtitle: 'Company details, logo, KRA PIN, currency, and numbering sequences' },
  };

  const current = moduleTitles[currentModule];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {businessName}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {current.title}
              </h1>
            </div>
            <p className="hidden md:block text-xs text-neutral-500 dark:text-neutral-400">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions: Search + Quick Action + Reset + Exit */}
        <div className="flex items-center gap-2">
          {/* Global Quick Search */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Quick Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsQuickOpen(!isQuickOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Action</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isQuickOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsQuickOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-56 rounded-md shadow-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 py-1.5 z-40 text-xs">
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Sales &amp; Finance
                  </div>
                  <button
                    onClick={() => {
                      onQuickAction('new-invoice');
                      setIsQuickOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-red-950/40 text-left"
                  >
                    <Receipt className="w-4 h-4 text-red-600" />
                    <span>Create Invoice</span>
                  </button>
                  <button
                    onClick={() => {
                      onQuickAction('new-quotation');
                      setIsQuickOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-red-950/40 text-left"
                  >
                    <Receipt className="w-4 h-4 text-amber-600" />
                    <span>Create Quotation</span>
                  </button>
                  <button
                    onClick={() => {
                      onQuickAction('new-receipt');
                      setIsQuickOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-red-950/40 text-left"
                  >
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    <span>Issue Receipt</span>
                  </button>
                  <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Operations
                  </div>
                  <button
                    onClick={() => {
                      onQuickAction('new-product');
                      setIsQuickOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <Package className="w-4 h-4 text-neutral-500" />
                    <span>Add Product / Service</span>
                  </button>
                  <button
                    onClick={() => {
                      onQuickAction('new-customer');
                      setIsQuickOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <Users className="w-4 h-4 text-neutral-500" />
                    <span>Add Customer</span>
                  </button>
                  <button
                    onClick={() => {
                      onQuickAction('new-expense');
                      setIsQuickOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <WalletCards className="w-4 h-4 text-neutral-500" />
                    <span>Record Expense</span>
                  </button>
                  <button
                    onClick={() => {
                      onQuickAction('new-order');
                      setIsQuickOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <CalendarCheck2 className="w-4 h-4 text-neutral-500" />
                    <span>New Order / Booking</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={onResetDemoData}
            title="Reset to fresh demo data"
            className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-xs inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px]">Reset Data</span>
          </button>

          {/* Back to Paperglow Portal */}
          <button
            onClick={onNavigateHome}
            className="px-2.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
