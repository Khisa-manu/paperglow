import React from 'react';
import {
  Package,
  Boxes,
  DollarSign,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ShoppingCart,
  TrendingUp,
  Plus,
  ArrowRight,
  Barcode,
  CheckCircle2,
  Clock,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';
import {
  InventoryProduct,
  StockMovement,
  PurchaseOrder,
  InventoryModule,
} from '../../types/stockInventory';

interface DashboardModuleProps {
  products: InventoryProduct[];
  movements: StockMovement[];
  purchases: PurchaseOrder[];
  onNavigateModule: (mod: InventoryModule) => void;
  onOpenAddProduct: () => void;
  onOpenStockAdjustment: (productId?: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  products,
  movements,
  purchases,
  onNavigateModule,
  onOpenAddProduct,
  onOpenStockAdjustment,
}) => {
  // Aggregate Metrics
  const totalProducts = products.length;
  const totalQuantity = products.reduce((acc, p) => acc + p.currentQuantity, 0);

  // Total inventory asset value (at buying cost)
  const totalCostValueKes = products.reduce(
    (acc, p) => acc + p.buyingPriceKes * p.currentQuantity,
    0
  );

  // Retail value (at selling price)
  const totalRetailValueKes = products.reduce(
    (acc, p) => acc + p.sellingPriceKes * p.currentQuantity,
    0
  );

  const potentialProfitKes = totalRetailValueKes - totalCostValueKes;

  const lowStockItems = products.filter(
    (p) => p.currentQuantity > 0 && p.currentQuantity <= p.minStockLevel
  );

  const outOfStockItems = products.filter((p) => p.currentQuantity === 0);

  const recentMovements = movements.slice(0, 5);
  const recentPurchases = purchases.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Launcher */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Warehouse Stock &amp; Inventory Overview
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Live Stock Tracking
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time stock ledger, minimum threshold monitoring, and purchasing workflows in Kenyan Shillings (KES).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateModule('barcode')}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <Barcode className="w-3.5 h-3.5 text-red-600" />
            <span>Scan Barcode</span>
          </button>
          <button
            onClick={() => onOpenStockAdjustment()}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Adjust Stock</span>
          </button>
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Products */}
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Total Catalog Products</span>
            <Package className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {totalProducts}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>Distinct SKUs</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {totalQuantity.toLocaleString()} Units
            </span>
          </div>
        </div>

        {/* Metric 2: Inventory Value (Cost) */}
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Inventory Asset Value</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            KES {totalCostValueKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between pt-1">
            <span>At Buying Cost</span>
            <span>FIFO Valued</span>
          </div>
        </div>

        {/* Metric 3: Retail Selling Potential */}
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Retail Valuation</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
            KES {totalRetailValueKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>Gross Margin Pot.</span>
            <span className="font-mono text-emerald-600 font-bold">
              +KES {potentialProfitKes.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Metric 4: Low Stock Alert */}
        <div
          onClick={() => onNavigateModule('alerts')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-medium">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {lowStockItems.length}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>Below min. reorder</span>
            <span className="text-amber-600 font-semibold underline">Inspect Alerts →</span>
          </div>
        </div>

        {/* Metric 5: Out of Stock */}
        <div
          onClick={() => onNavigateModule('alerts')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1 cursor-pointer hover:border-red-400 transition-colors"
        >
          <div className="flex items-center justify-between text-red-700 dark:text-red-400 text-xs font-medium">
            <span>Out of Stock</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
            {outOfStockItems.length}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>Depleted products</span>
            <span className="text-red-600 font-semibold underline">Reorder Now →</span>
          </div>
        </div>
      </div>

      {/* Critical Stock Attention Banner if any depleted */}
      {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center space-x-3">
            <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </span>
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200">
                Replenishment Attention Required:
              </span>{' '}
              <span className="text-amber-800 dark:text-amber-300">
                {outOfStockItems.length} product(s) completely depleted and{' '}
                {lowStockItems.length} product(s) below reorder levels.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateModule('purchases')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors shrink-0 text-center cursor-pointer shadow-xs"
          >
            Create Purchase Order
          </button>
        </div>
      )}

      {/* Two Column Grid: Recent Movements & Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Stock Movements */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowLeftRight className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Recent Stock Movements
              </h3>
            </div>
            <button
              onClick={() => onNavigateModule('stock_management')}
              className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentMovements.map((mov) => {
              const isPositive =
                mov.type === 'stock_in' || (mov.type === 'adjustment' && mov.newQuantity > mov.previousQuantity);
              return (
                <div key={mov.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          mov.type === 'stock_in'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : mov.type === 'stock_out'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                            : mov.type === 'damaged_lost'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {mov.type.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {mov.productName}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">{mov.reason}</p>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Ref: {mov.referenceNumber} • By {mov.performedBy}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono font-bold text-sm ${
                        isPositive ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {isPositive ? `+${mov.quantity}` : `-${mov.quantity}`}
                    </span>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Bal: {mov.newQuantity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Purchases & Restocking Orders */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Purchase Orders &amp; Restocking
              </h3>
            </div>
            <button
              onClick={() => onNavigateModule('purchases')}
              className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Manage POs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentPurchases.map((po) => (
              <div key={po.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {po.poNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        po.status === 'received'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : po.status === 'ordered'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {po.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Vendor: {po.supplierName}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {po.items.length} line item(s) • Expected by {po.expectedDeliveryDate}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    KES {po.totalAmountKes.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-neutral-400">
                    Date: {po.orderDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
