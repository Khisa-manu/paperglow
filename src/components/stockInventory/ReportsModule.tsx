import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  Printer,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import {
  InventoryProduct,
  StockMovement,
  PurchaseOrder,
  StockSale,
  ProductCategory,
  Supplier,
} from '../../types/stockInventory';

interface ReportsModuleProps {
  products: InventoryProduct[];
  movements: StockMovement[];
  purchases: PurchaseOrder[];
  sales: StockSale[];
  categories: ProductCategory[];
  suppliers: Supplier[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  products,
  movements,
  purchases,
  sales,
  categories,
  suppliers,
}) => {
  const [timeFilter, setTimeFilter] = useState<'30days' | '7days' | 'all'>('30days');

  // Total valuations
  const totalCostValuationKes = products.reduce(
    (sum, p) => sum + p.buyingPriceKes * p.currentQuantity,
    0
  );

  const totalRetailValuationKes = products.reduce(
    (sum, p) => sum + p.sellingPriceKes * p.currentQuantity,
    0
  );

  const potentialGrossProfitKes = totalRetailValuationKes - totalCostValuationKes;

  const totalSalesRevenueKes = sales.reduce((sum, s) => sum + s.totalAmountKes, 0);
  const totalPurchasesSpendKes = purchases.reduce((sum, p) => sum + p.totalAmountKes, 0);

  // Category breakdown
  const categoryReports = categories.map((cat) => {
    const catProducts = products.filter((p) => p.categoryId === cat.id);
    const costVal = catProducts.reduce(
      (sum, p) => sum + p.buyingPriceKes * p.currentQuantity,
      0
    );
    const units = catProducts.reduce((sum, p) => sum + p.currentQuantity, 0);
    return {
      category: cat,
      productCount: catProducts.length,
      units,
      costValuationKes: costVal,
    };
  });

  // Supplier spend breakdown
  const supplierSpend = suppliers.map((sup) => {
    const matchingPOs = purchases.filter((po) => po.supplierId === sup.id);
    const totalSpent = matchingPOs.reduce((sum, po) => sum + po.totalAmountKes, 0);
    return {
      supplier: sup,
      poCount: matchingPOs.length,
      totalSpentKes: totalSpent,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Inventory Analytics &amp; Stock Valuation
          </h2>
          <p className="text-xs text-neutral-500">
            Audit-grade reporting across capital asset valuation, product performance, vendor spend, and stock velocities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days (Standard)</option>
            <option value="all">Year-to-Date (All)</option>
          </select>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Valuation Scorecards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Total Stock Cost Value (FIFO)</span>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
            KES {totalCostValuationKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400 block pt-1">
            Capital tied in warehouse goods
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Potential Retail Value</span>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
            KES {totalRetailValuationKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400 block pt-1">
            Based on current shelf selling prices
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Projected Gross Margin</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            KES {potentialGrossProfitKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block pt-1">
            {totalCostValuationKes > 0
              ? `${Math.round((potentialGrossProfitKes / totalCostValuationKes) * 100)}% Markup`
              : '0%'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Recorded Dispatched Sales</span>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
            KES {totalSalesRevenueKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400 block pt-1">
            {sales.length} customer sales orders
          </span>
        </div>
      </div>

      {/* Two Column Section: Category Valuation & Top Products by Value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
            Inventory Valuation by Category
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[10px] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">SKUs</th>
                  <th className="py-2.5 px-3">Total Units</th>
                  <th className="py-2.5 px-3 text-right">Cost Asset Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                {categoryReports.map((cr) => (
                  <tr key={cr.category.id}>
                    <td className="py-2 px-3 font-sans font-medium text-neutral-900 dark:text-white">
                      {cr.category.name}
                    </td>
                    <td className="py-2 px-3 text-neutral-500">{cr.productCount}</td>
                    <td className="py-2 px-3">{cr.units.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-neutral-900 dark:text-white">
                      KES {cr.costValuationKes.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supplier Spend Table */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
            Vendor Purchasing Volume &amp; Payables
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[10px] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Supplier Name</th>
                  <th className="py-2.5 px-3">POs</th>
                  <th className="py-2.5 px-3 text-right">Recent Spend</th>
                  <th className="py-2.5 px-3 text-right">Outstanding Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                {supplierSpend.map((ss) => (
                  <tr key={ss.supplier.id}>
                    <td className="py-2 px-3 font-sans font-medium text-neutral-900 dark:text-white">
                      {ss.supplier.name}
                    </td>
                    <td className="py-2 px-3 text-neutral-500">{ss.poCount}</td>
                    <td className="py-2 px-3 text-right font-bold text-neutral-900 dark:text-white">
                      KES {ss.totalSpentKes.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-red-600 font-bold">
                      KES {ss.supplier.outstandingBalanceKes.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
