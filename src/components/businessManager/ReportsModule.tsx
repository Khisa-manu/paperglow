import React, { useState, useMemo } from 'react';
import {
  SalesDocument,
  ExpenseRecord,
  InventoryItem,
  Customer,
} from '../../types/businessManager';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

interface ReportsModuleProps {
  documents: SalesDocument[];
  expenses: ExpenseRecord[];
  inventory: InventoryItem[];
  customers: Customer[];
  currencySymbol: string;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  documents,
  expenses,
  inventory,
  customers,
  currencySymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses' | 'profit' | 'inventory' | 'customers'>('sales');
  const [dateRange, setDateRange] = useState<'this_month' | 'quarter' | 'year' | 'all'>('this_month');

  // Aggregated calculations
  const totalSalesRevenue = documents
    .filter((d) => d.documentType === 'invoice' || d.documentType === 'receipt')
    .reduce((sum, d) => sum + d.grandTotal, 0);

  const totalCollected = documents
    .filter((d) => d.documentType === 'invoice' || d.documentType === 'receipt')
    .reduce((sum, d) => sum + (d.amountPaid || 0), 0);

  const totalOutstanding = documents
    .filter((d) => d.documentType === 'invoice' && (d.status === 'unpaid' || d.status === 'overdue'))
    .reduce((sum, d) => sum + (d.grandTotal - (d.amountPaid || 0)), 0);

  const totalExpenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netOperatingProfit = totalSalesRevenue - totalExpenseSum;
  const profitMarginPercent = totalSalesRevenue > 0 ? Math.round((netOperatingProfit / totalSalesRevenue) * 100) : 0;

  // Inventory valuation
  const inventoryCostValue = inventory.reduce(
    (sum, i) => sum + (i.type === 'product' ? i.stockQuantity * i.buyingPrice : 0),
    0
  );
  const inventoryRetailValue = inventory.reduce(
    (sum, i) => sum + (i.type === 'product' ? i.stockQuantity * i.sellingPrice : 0),
    0
  );

  // Top selling products simulation based on line items
  const productSalesMap = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    documents.forEach((d) => {
      d.items.forEach((item) => {
        const key = item.description;
        if (!map[key]) {
          map[key] = { name: key, qty: 0, revenue: 0 };
        }
        map[key].qty += item.quantity;
        map[key].revenue += item.total;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [documents]);

  // Top Customers by spend
  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers]);

  return (
    <div className="space-y-6">
      {/* Top Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              activeTab === 'sales'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              activeTab === 'expenses'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Expenses Report
          </button>
          <button
            onClick={() => setActiveTab('profit')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              activeTab === 'profit'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            P&amp;L Profit Report
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              activeTab === 'inventory'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Inventory Valuation
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              activeTab === 'customers'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Customer Analytics
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
          >
            <option value="this_month">Current Month (March 2026)</option>
            <option value="quarter">Q1 2026 (Jan - Mar)</option>
            <option value="year">Full Year 2026 YTD</option>
            <option value="all">All-Time Cumulative</option>
          </select>
        </div>
      </div>

      {/* TAB 1: SALES REPORT */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Gross Sales Revenue</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
                {currencySymbol} {totalSalesRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">From Invoices &amp; Receipts</div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Collected Cashflow</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                {currencySymbol} {totalCollected.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">Settled via M-Pesa &amp; Banks</div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Aging Outstanding Receivables</div>
              <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-1 tabular-nums">
                {currencySymbol} {totalOutstanding.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">Pending client settlements</div>
            </div>
          </div>

          {/* Top Selling Products List */}
          <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Top Selling Products &amp; Services by Invoiced Revenue
            </h3>
            <div className="space-y-3">
              {productSalesMap.slice(0, 5).map((p, idx) => {
                const maxRev = productSalesMap[0]?.revenue || 1;
                const widthPct = Math.round((p.revenue / maxRev) * 100);
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-neutral-800 dark:text-neutral-200">
                      <span>{p.name} ({p.qty} units)</span>
                      <span className="font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                        {currencySymbol} {p.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-600 h-full rounded-full" style={{ width: `${widthPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXPENSES REPORT */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Expense Distribution by Category
                </h3>
                <p className="text-xs text-neutral-500">Track company cost centers and overheads</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500">Total Outgoings: </span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {currencySymbol} {totalExpenseSum.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 mt-3 text-xs">
              {expenses.map((e) => (
                <div key={e.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{e.description}</span>
                    <div className="text-[11px] text-neutral-500">
                      {e.category} · Payee: {e.payee} ({e.date})
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {currencySymbol} {e.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROFIT & LOSS REPORT */}
      {activeTab === 'profit' && (
        <div className="p-6 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Profit &amp; Loss Statement (P&amp;L)
            </h3>
            <p className="text-xs text-neutral-500">Summary of revenue versus operational expenditures</p>
          </div>

          <div className="space-y-4 max-w-2xl text-xs">
            {/* Revenue */}
            <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-800/50 space-y-2">
              <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-neutral-100">
                <span>1. Total Invoiced Commercial Revenue</span>
                <span className="font-mono">{currencySymbol} {totalSalesRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400 pl-4">
                <span>Direct product &amp; print sales</span>
                <span className="font-mono">{currencySymbol} {(totalSalesRevenue * 0.75).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400 pl-4">
                <span>Professional creative branding services</span>
                <span className="font-mono">{currencySymbol} {(totalSalesRevenue * 0.25).toLocaleString()}</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-800/50 space-y-2">
              <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-neutral-100">
                <span>2. Total Operating Expenditures</span>
                <span className="font-mono text-red-600">- {currencySymbol} {totalExpenseSum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400 pl-4">
                <span>Rent, Utilities &amp; Infrastructure</span>
                <span className="font-mono">{currencySymbol} 77,500</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400 pl-4">
                <span>Raw materials, ink &amp; inventory replenishments</span>
                <span className="font-mono">{currencySymbol} 34,200</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400 pl-4">
                <span>Marketing, logistics &amp; maintenance</span>
                <span className="font-mono">{currencySymbol} 31,900</span>
              </div>
            </div>

            {/* Net Operating Profit */}
            <div className="p-4 rounded-md bg-neutral-900 text-white flex justify-between items-center text-sm font-bold">
              <div>
                <div>Net Operating Commercial Profit</div>
                <div className="text-[11px] font-normal text-neutral-400">
                  Calculated Net Margin: {profitMarginPercent}%
                </div>
              </div>
              <div className="text-xl font-mono text-emerald-400 tabular-nums">
                {currencySymbol} {netOperatingProfit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY REPORT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Valuation at Cost</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
                {currencySymbol} {inventoryCostValue.toLocaleString()}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Capital invested in active warehouse stock</p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Projected Retail Turnover</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                {currencySymbol} {inventoryRetailValue.toLocaleString()}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Expected gross turnover upon 100% liquidation</p>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 font-semibold uppercase text-neutral-500">
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3 text-right">In Stock</th>
                  <th className="py-2.5 px-3 text-right">Cost Price</th>
                  <th className="py-2.5 px-3 text-right">Retail Price</th>
                  <th className="py-2.5 px-3 text-right">Total Cost Value</th>
                  <th className="py-2.5 px-3 text-right">Total Retail Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {item.stockQuantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {currencySymbol} {item.buyingPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {currencySymbol} {item.sellingPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {currencySymbol} {(item.stockQuantity * item.buyingPrice).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {currencySymbol} {(item.stockQuantity * item.sellingPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMER ANALYTICS */}
      {activeTab === 'customers' && (
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            Customer Revenue Ranking &amp; Aging Ledger
          </h3>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {sortedCustomers.map((c, idx) => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-center font-mono leading-5 text-[11px]">
                      {idx + 1}
                    </span>
                    <span>{c.name}</span>
                    <span className="text-neutral-400">({c.company})</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 pl-7">
                    Email: {c.email} · Phone: {c.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {currencySymbol} {c.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Outstanding: <span className={c.outstandingBalance > 0 ? 'text-red-600 font-bold' : 'text-emerald-600'}>{currencySymbol} {c.outstandingBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
