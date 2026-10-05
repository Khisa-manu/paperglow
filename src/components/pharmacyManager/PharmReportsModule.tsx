import React, { useState } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Layers,
  AlertTriangle,
  Pill,
  Printer,
  Download,
  CheckCircle2,
  Package,
} from 'lucide-react';
import {
  MedicineProduct,
  SaleTransaction,
  PurchaseOrder,
  PharmacyExpense,
} from '../../types/pharmacyManager';

interface PharmReportsModuleProps {
  medicines: MedicineProduct[];
  sales: SaleTransaction[];
  purchaseOrders: PurchaseOrder[];
  expenses: PharmacyExpense[];
}

export const PharmReportsModule: React.FC<PharmReportsModuleProps> = ({
  medicines,
  sales,
  purchaseOrders,
  expenses,
}) => {
  const [reportType, setReportType] = useState<
    'sales' | 'profit' | 'stock' | 'expiries' | 'bestsellers' | 'purchases'
  >('sales');
  const [dateRange, setDateRange] = useState<'today' | '7days' | 'month' | 'all'>('month');

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  // Filter sales by dateRange
  const filteredSales = sales.filter((s) => {
    if (dateRange === 'today') return s.timestamp.startsWith('2026-10-05');
    if (dateRange === '7days') return s.timestamp >= '2026-09-28';
    if (dateRange === 'month') return s.timestamp >= '2026-10-01';
    return true;
  });

  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmountKes, 0);

  // Profit calculation (revenue - estimated COGS based on unit buying prices)
  let totalCostOfGoodsSold = 0;
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const med = medicines.find((m) => m.id === item.productId);
      const unitCost = med ? med.buyingPriceKes : item.unitPriceKes * 0.7;
      totalCostOfGoodsSold += item.quantity * unitCost;
    });
  });

  const grossProfit = totalSalesRevenue - totalCostOfGoodsSold;
  const grossMarginPct = totalSalesRevenue > 0 ? (grossProfit / totalSalesRevenue) * 100 : 0;

  // Best-selling analysis
  const itemCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!itemCounts[item.productId]) {
        itemCounts[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      }
      itemCounts[item.productId].qty += item.quantity;
      itemCounts[item.productId].revenue += item.totalPriceKes;
    });
  });

  const bestSellingList = Object.values(itemCounts).sort((a, b) => b.qty - a.qty);

  // Stock valuation
  const totalCostValue = medicines.reduce((s, m) => s + m.quantityInStock * m.buyingPriceKes, 0);
  const totalRetailValue = medicines.reduce((s, m) => s + m.quantityInStock * m.sellingPriceKes, 0);

  // Expiry risk analysis (reference today: 2026-10-05)
  const expiringWithin90Days = medicines.filter(
    (m) => m.expiryDate <= '2027-01-05' && m.expiryDate >= '2026-10-05'
  );
  const alreadyExpired = medicines.filter((m) => m.expiryDate < '2026-10-05');

  // Total expenses in range
  const totalExpenseKes = expenses.reduce((sum, e) => sum + e.amountKes, 0);
  const netIncomeKes = grossProfit - totalExpenseKes;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-red-600" />
            <span>Pharmacy Reports &amp; Financial Margins</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Audit dispensary revenues, calculate gross margins, monitor inventory holding value, and track batch expiries.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Filter & Report Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#11141a] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'sales', label: 'Sales & Receipts' },
              { id: 'profit', label: 'Gross Margin & Profit' },
              { id: 'stock', label: 'Stock Valuation' },
              { id: 'expiries', label: 'Expiry Risk Audit' },
              { id: 'bestsellers', label: 'Best-Selling Medicines' },
              { id: 'purchases', label: 'Purchase Summary' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setReportType(t.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                reportType === t.id
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-500 mr-1">Period:</span>
          {(
            [
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All-Time' },
            ] as const
          ).map((period) => (
            <button
              key={period.id}
              onClick={() => setDateRange(period.id)}
              className={`px-2 py-1 text-xs rounded font-medium cursor-pointer ${
                dateRange === period.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Gross Sales Revenue</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {formatKes(totalSalesRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">{filteredSales.length} dispensing receipts</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Gross Pharmacy Profit</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400">
            {formatKes(grossProfit)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">{grossMarginPct.toFixed(1)}% gross margin</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Inventory Retail Worth</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {formatKes(totalRetailValue)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Cost value: {formatKes(totalCostValue)}</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Net Operational Margin</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-red-600 dark:text-red-400">
            {formatKes(netIncomeKes)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">After operational expenses</div>
        </div>
      </div>

      {/* Dynamic Report Content Section */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden p-5 shadow-xs space-y-4">
        {/* Tab 1: Sales */}
        {reportType === 'sales' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Dispensary Sales &amp; Channel Breakdown
            </h3>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-[10px] uppercase text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3">Receipt #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Payment Channel</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3 text-right">Total (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {filteredSales.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-red-600">{s.receiptNumber}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{s.timestamp}</td>
                      <td className="py-2.5 px-3 font-medium">{s.customerName}</td>
                      <td className="py-2.5 px-3 font-semibold uppercase">{s.paymentMethod}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-500">{s.mpesaRef || '—'}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">{formatKes(s.totalAmountKes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Profit & Margins */}
        {reportType === 'profit' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Dispensary Profit &amp; Loss Statement (Estimate)
            </h3>
            <div className="max-w-xl space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Gross Sales Revenue</span>
                <span className="font-mono font-bold">{formatKes(totalSalesRevenue)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                <span>Less: Cost of Medicines Sold (COGS)</span>
                <span className="font-mono text-red-600">-{formatKes(totalCostOfGoodsSold)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 rounded">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">Gross Dispensary Profit</span>
                <span className="font-mono font-bold text-emerald-600">{formatKes(grossProfit)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                <span>Less: Operating Expenses (Wages, Power, Regulatory)</span>
                <span className="font-mono text-red-600">-{formatKes(totalExpenseKes)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-neutral-900 dark:border-white text-sm font-bold">
                <span className="text-neutral-900 dark:text-neutral-100">Estimated Net Operating Income</span>
                <span className="font-mono text-red-600 dark:text-red-400">{formatKes(netIncomeKes)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Stock Valuation */}
        {reportType === 'stock' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Inventory Holding Valuation by Category
            </h3>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-[10px] uppercase text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">SKU Lines</th>
                    <th className="py-2.5 px-3 text-center">Total Units</th>
                    <th className="py-2.5 px-3 text-right">Wholesale Cost Value</th>
                    <th className="py-2.5 px-3 text-right">Retail Potential Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {Array.from(new Set(medicines.map((m) => m.category))).map((cat) => {
                    const catMeds = medicines.filter((m) => m.category === cat);
                    const units = catMeds.reduce((s, m) => s + m.quantityInStock, 0);
                    const costVal = catMeds.reduce((s, m) => s + m.quantityInStock * m.buyingPriceKes, 0);
                    const retailVal = catMeds.reduce((s, m) => s + m.quantityInStock * m.sellingPriceKes, 0);
                    return (
                      <tr key={cat} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">{cat}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{catMeds.length}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{units}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatKes(costVal)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                          {formatKes(retailVal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Expiries */}
        {reportType === 'expiries' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Dispensary Expiry Risk Analysis
            </h3>
            <p className="text-xs text-neutral-500">
              Medicines expiring within the next 90 days must be prioritized or returned to distributors under swap agreements.
            </p>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-[10px] uppercase text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3">Medicine</th>
                    <th className="py-2.5 px-3">Batch Number</th>
                    <th className="py-2.5 px-3">Units in Stock</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3">Shelf Location</th>
                    <th className="py-2.5 px-3 text-right">Holding Loss Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {expiringWithin90Days.map((med) => (
                    <tr key={med.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-3 font-medium text-neutral-900 dark:text-neutral-100">{med.name}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-500">{med.batchNumber}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">{med.quantityInStock}</td>
                      <td className="py-2.5 px-3 font-semibold text-amber-600">{med.expiryDate}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{med.shelfLocation}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-red-600">
                        {formatKes(med.quantityInStock * med.buyingPriceKes)}
                      </td>
                    </tr>
                  ))}
                  {expiringWithin90Days.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-xs text-emerald-600">
                        No critical stock expiring within 90 days. Excellent batch hygiene!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Best-Sellers */}
        {reportType === 'bestsellers' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Top Dispensed Pharmaceutical Lines
            </h3>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-[10px] uppercase text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Medicine</th>
                    <th className="py-2.5 px-3 text-center">Packs/Units Dispensed</th>
                    <th className="py-2.5 px-3 text-right">Revenue Generated (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {bestSellingList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-3 font-bold font-mono text-neutral-400">#{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{item.qty}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-red-600">
                        {formatKes(item.revenue)}
                      </td>
                    </tr>
                  ))}
                  {bestSellingList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-neutral-400 text-xs">
                        No sales data found for the selected timeframe.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Purchases */}
        {reportType === 'purchases' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Distributor Procurement Summary
            </h3>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-[10px] uppercase text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3">PO Number</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">Order Date</th>
                    <th className="py-2.5 px-3">Fulfillment</th>
                    <th className="py-2.5 px-3 text-right">Invoiced (KES)</th>
                    <th className="py-2.5 px-3 text-right">Settled (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-red-600">{po.poNumber}</td>
                      <td className="py-2.5 px-3 font-medium">{po.supplierName}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{po.orderDate}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-semibold">{po.status}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">{formatKes(po.totalCostKes)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600">{formatKes(po.amountPaidKes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
