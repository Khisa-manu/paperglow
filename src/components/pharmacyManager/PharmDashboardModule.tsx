import React from 'react';
import {
  Pill,
  ShoppingCart,
  Banknote,
  AlertTriangle,
  Clock,
  Truck,
  TrendingUp,
  Layers,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  MedicineProduct,
  SaleTransaction,
  PurchaseOrder,
  PharmModule,
} from '../../types/pharmacyManager';

interface PharmDashboardModuleProps {
  medicines: MedicineProduct[];
  sales: SaleTransaction[];
  purchaseOrders: PurchaseOrder[];
  onNavigateModule: (module: PharmModule) => void;
  onQuickNewSale: () => void;
  onQuickAddMedicine: () => void;
  onQuickAddPO: () => void;
}

export const PharmDashboardModule: React.FC<PharmDashboardModuleProps> = ({
  medicines,
  sales,
  purchaseOrders,
  onNavigateModule,
  onQuickNewSale,
  onQuickAddMedicine,
  onQuickAddPO,
}) => {
  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  // Today's date is 2026-10-05
  const todayDatePrefix = '2026-10-05';
  const todaySales = sales.filter((s) => s.timestamp.startsWith(todayDatePrefix));
  const todaySalesKes = todaySales.reduce((sum, s) => sum + s.totalAmountKes, 0);

  // Total sales overall
  const totalSalesKes = sales.reduce((sum, s) => sum + s.totalAmountKes, 0);

  // Inventory Stock Valuation
  const totalCostValueKes = medicines.reduce(
    (sum, m) => sum + m.quantityInStock * m.buyingPriceKes,
    0
  );
  const totalRetailValueKes = medicines.reduce(
    (sum, m) => sum + m.quantityInStock * m.sellingPriceKes,
    0
  );
  const potentialGrossMarginKes = totalRetailValueKes - totalCostValueKes;

  // Alerts
  const lowStockMedicines = medicines.filter((m) => m.quantityInStock <= m.minStockLevel);
  const now = new Date('2026-10-05');
  const ninetyDaysLater = new Date(now.getTime() + 90 * 86400000);
  const expiringMedicines = medicines.filter((m) => {
    const exp = new Date(m.expiryDate);
    return exp <= ninetyDaysLater;
  });

  // Total Purchases Received
  const totalPurchasesKes = purchaseOrders.reduce((sum, po) => sum + po.totalCostKes, 0);

  return (
    <div className="space-y-6">
      {/* Dispensary Cockpit Welcome Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#11141a] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Pharmacy Operations Center</span>
            <span aria-hidden="true">·</span>
            <span>Nairobi CBD Branch</span>
            <span aria-hidden="true">·</span>
            <span>Licensed by PPB Kenya</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1 font-['Poppins']">
            Dispensary Operations &amp; Medicine Inventory
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Managing {medicines.length} registered pharmaceutical lines across prescription &amp; OTC categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onQuickNewSale}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>New Dispense (POS)</span>
          </button>
          <button
            onClick={onQuickAddMedicine}
            className="px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            + Add Medicine
          </button>
        </div>
      </div>

      {/* KPI Cards Strip (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Today's Sales */}
        <div
          onClick={() => onNavigateModule('sales')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Today's Sales</span>
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums truncate">
            {formatKes(todaySalesKes)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {todaySales.length} dispensing tickets today
          </div>
        </div>

        {/* Stock Valuation (Retail) */}
        <div
          onClick={() => onNavigateModule('reports')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Stock Value (Retail)</span>
            <Banknote className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums truncate">
            {formatKes(totalRetailValueKes)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Cost: {formatKes(totalCostValueKes)}
          </div>
        </div>

        {/* Potential Margin */}
        <div
          onClick={() => onNavigateModule('reports')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Potential Gross Margin</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums truncate">
            {formatKes(potentialGrossMarginKes)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            ~{totalRetailValueKes > 0 ? Math.round((potentialGrossMarginKes / totalRetailValueKes) * 100) : 0}% projected margin
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onNavigateModule('stock')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-2 tabular-nums">
            {lowStockMedicines.length}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Below reorder threshold
          </div>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => onNavigateModule('stock')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Expiring (&lt; 90 Days)</span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-2 tabular-nums">
            {expiringMedicines.length}
          </div>
          <div className="text-[11px] text-red-600 mt-1 font-medium">
            Batch rotation required
          </div>
        </div>

        {/* Total Purchases */}
        <div
          onClick={() => onNavigateModule('purchases')}
          className="p-4 bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Total Inbound POs</span>
            <Truck className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums truncate">
            {formatKes(totalPurchasesKes)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Across Harleys, Phillips, etc.
          </div>
        </div>
      </div>

      {/* Split Grid: Recent Dispensing Sales & Critical Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Dispensing Sales */}
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Recent Dispensing Transactions
              </h3>
              <p className="text-[11px] text-neutral-500">
                Customer sales with Safaricom M-Pesa &amp; cash settlements
              </p>
            </div>
            <button
              onClick={() => onNavigateModule('sales')}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {sales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40"
              >
                <div className="space-y-0.5 max-w-[65%]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {sale.receiptNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-400 font-mono text-[10px]">
                      {sale.timestamp}
                    </span>
                  </div>
                  <div className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {sale.customerName} ({sale.items.length} item{sale.items.length > 1 ? 's' : ''})
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">
                    Dispensed by: {sale.dispensedBy} · Channel: {sale.paymentMethod.toUpperCase()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {formatKes(sale.totalAmountKes)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Verified Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Stock Attention Queue */}
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Critical Stock &amp; Expiry Alerts
              </h3>
              <p className="text-[11px] text-neutral-500">
                Reorder triggers and medicines nearing expiry date
              </p>
            </div>
            <button
              onClick={() => onNavigateModule('stock')}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>Manage Batches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {lowStockMedicines.slice(0, 4).map((med) => (
              <div
                key={med.id}
                className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40"
              >
                <div className="space-y-0.5 max-w-[65%]">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {med.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">
                    {med.manufacturer} · Batch: {med.batchNumber}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Expiry: {med.expiryDate} · Location: {med.shelfLocation}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {med.quantityInStock} units left
                  </div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                    Reorder Min: {med.minStockLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
