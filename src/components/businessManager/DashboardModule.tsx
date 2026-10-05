import React from 'react';
import {
  SalesDocument,
  InventoryItem,
  ExpenseRecord,
  BusinessOrder,
  ActivityLog,
  BMModule,
} from '../../types/businessManager';
import {
  TrendingUp,
  Receipt,
  WalletCards,
  AlertTriangle,
  CalendarCheck2,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  Package,
  Plus,
  Users,
} from 'lucide-react';

interface DashboardModuleProps {
  documents: SalesDocument[];
  inventory: InventoryItem[];
  expenses: ExpenseRecord[];
  orders: BusinessOrder[];
  activities: ActivityLog[];
  currencySymbol: string;
  onNavigateModule: (mod: BMModule) => void;
  onOpenDocumentModal: (type: 'invoice' | 'quotation' | 'receipt') => void;
  onOpenExpenseModal: () => void;
  onOpenOrderModal: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  documents,
  inventory,
  expenses,
  orders,
  activities,
  currencySymbol,
  onNavigateModule,
  onOpenDocumentModal,
  onOpenExpenseModal,
  onOpenOrderModal,
}) => {
  // Financial calculations
  const totalSalesAll = documents
    .filter((d) => d.documentType === 'invoice' || d.documentType === 'receipt')
    .reduce((sum, d) => sum + d.grandTotal, 0);

  // Today's sales
  const todayStr = '2026-03-31'; // Baseline date
  const todaySales = documents
    .filter((d) => (d.documentType === 'invoice' || d.documentType === 'receipt') && (d.issueDate === todayStr || d.issueDate.startsWith('2026-03-3')))
    .reduce((sum, d) => sum + d.grandTotal, 0);

  const outstandingInvoices = documents
    .filter((d) => d.documentType === 'invoice' && (d.status === 'unpaid' || d.status === 'overdue'))
    .reduce((sum, d) => sum + (d.grandTotal - (d.amountPaid || 0)), 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSalesAll - totalExpenses;

  // Alerts
  const lowStockItems = inventory.filter(
    (item) => item.type === 'product' && item.stockQuantity <= item.minStockThreshold
  );

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Sales */}
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Sales</span>
            <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
            {currencySymbol} {todaySales.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between">
            <span>March Invoicing Volume</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+18.4% MoM</span>
          </div>
        </div>

        {/* Card 2: Outstanding Invoices */}
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Invoices</span>
            <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
            {currencySymbol} {outstandingInvoices.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between">
            <span className="text-red-600 dark:text-red-400 font-semibold">
              {documents.filter((d) => d.status === 'overdue').length} Overdue Accounts
            </span>
            <button
              onClick={() => onNavigateModule('sales')}
              className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-red-600 font-medium inline-flex items-center gap-0.5"
            >
              View Sales <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Expenses</span>
            <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <WalletCards className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
            {currencySymbol} {totalExpenses.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between">
            <span>{expenses.length} Vouchers Recorded</span>
            <button
              onClick={() => onNavigateModule('expenses')}
              className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-red-600 font-medium inline-flex items-center gap-0.5"
            >
              Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Profit Overview */}
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Profit</span>
            <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
            {currencySymbol} {netProfit.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between">
            <span>Sales minus Expenses</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Margin {totalSalesAll > 0 ? Math.round((netProfit / totalSalesAll) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Low Stock Alert & Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Watchlist */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Low-Stock Inventory Alerts
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-sm">
                {lowStockItems.length} Products Critical
              </span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 mt-3">
              {lowStockItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-500">
                  All inventory items are currently above safe reorder thresholds.
                </div>
              ) : (
                lowStockItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {item.name}
                      </div>
                      <div className="text-neutral-500 text-[11px]">
                        SKU: {item.sku} · Reorder Threshold: {item.minStockThreshold} {item.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-red-600 dark:text-red-400">
                        {item.stockQuantity} {item.unit} remaining
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Cost: {currencySymbol} {item.buyingPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-3 flex justify-between items-center text-xs">
            <span className="text-neutral-500">Stock automatically updates on sales</span>
            <button
              onClick={() => onNavigateModule('inventory')}
              className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
            >
              Open Inventory Manager <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pending Orders & Appointments */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-blue-500" />
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Pending Orders &amp; Appointments
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-sm">
                {pendingOrders.length} In Progress
              </span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 mt-3">
              {pendingOrders.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-500">
                  No pending customer orders or scheduled appointments.
                </div>
              ) : (
                pendingOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                        <span>{order.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="text-neutral-500 text-[11px] mt-0.5">
                        {order.customerName} · Assigned: {order.assignedEmployee}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {currencySymbol} {order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Due {order.scheduledDate} {order.timeSlot ? `(${order.timeSlot})` : ''}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-3 flex justify-between items-center text-xs">
            <span className="text-neutral-500">Track milestones and client deliveries</span>
            <button
              onClick={() => onNavigateModule('orders')}
              className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
            >
              Manage Schedule <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Stream & Quick Launch Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (2 cols on lg) */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Recent Business Operations Activity
              </h2>
            </div>
            <span className="text-xs text-neutral-400">Chronological Audit Log</span>
          </div>

          <div className="mt-4 space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2.5 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {act.actor} · <span className="text-neutral-600 dark:text-neutral-400">{act.action}</span>
                    </span>
                    <span className="text-neutral-400 text-[11px] font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Launchpad */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            Quick Operations Shortcuts
          </h2>
          <div className="space-y-2 text-xs">
            <button
              onClick={() => onOpenDocumentModal('invoice')}
              className="w-full flex items-center justify-between p-3 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-neutral-800 dark:text-neutral-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-red-600" />
                <div>
                  <div className="font-semibold">Issue Commercial Invoice</div>
                  <div className="text-[11px] text-neutral-500">Calculate VAT &amp; customer line items</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>

            <button
              onClick={() => onOpenDocumentModal('quotation')}
              className="w-full flex items-center justify-between p-3 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-neutral-800 dark:text-neutral-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-semibold">Prepare Quotation</div>
                  <div className="text-[11px] text-neutral-500">Proforma quotes with 30-day validity</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>

            <button
              onClick={onOpenExpenseModal}
              className="w-full flex items-center justify-between p-3 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-neutral-800 dark:text-neutral-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <WalletCards className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold">Record Expense Voucher</div>
                  <div className="text-[11px] text-neutral-500">Log utility, fuel, or supplier costs</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>

            <button
              onClick={onOpenOrderModal}
              className="w-full flex items-center justify-between p-3 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-neutral-800 dark:text-neutral-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck2 className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold">Book Order or Appointment</div>
                  <div className="text-[11px] text-neutral-500">Assign technician or design session</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
