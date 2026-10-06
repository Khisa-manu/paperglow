import React, { useState } from 'react';
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sliders,
  Bell,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';
import {
  InventoryProduct,
  StockAlert,
} from '../../types/stockInventory';

interface LowStockAlertsModuleProps {
  products: InventoryProduct[];
  alerts: StockAlert[];
  onDismissAlert: (alertId: string) => void;
  onUpdateMinStock: (productId: string, newMinStock: number) => void;
  onCreatePOForProduct: (product: InventoryProduct) => void;
}

export const LowStockAlertsModule: React.FC<LowStockAlertsModuleProps> = ({
  products,
  alerts,
  onDismissAlert,
  onUpdateMinStock,
  onCreatePOForProduct,
}) => {
  const [editingMinStockId, setEditingMinStockId] = useState<string | null>(null);
  const [minStockValue, setMinStockValue] = useState<number>(10);
  const [activeFilter, setActiveFilter] = useState<'all' | 'out_of_stock' | 'low_stock' | 'overstock'>('all');

  const outOfStockItems = products.filter((p) => p.currentQuantity === 0);
  const lowStockItems = products.filter(
    (p) => p.currentQuantity > 0 && p.currentQuantity <= p.minStockLevel
  );
  const overstockItems = products.filter(
    (p) => p.currentQuantity > p.maxStockLevel && p.maxStockLevel > 0
  );

  const displayedAlerts = [
    ...outOfStockItems.map((p) => ({
      product: p,
      type: 'out_of_stock' as const,
      urgency: 'critical',
      message: `Completely OUT OF STOCK (0 ${p.unit} on hand). Reorder threshold is ${p.minStockLevel}.`,
    })),
    ...lowStockItems.map((p) => ({
      product: p,
      type: 'low_stock' as const,
      urgency: 'high',
      message: `Stock level (${p.currentQuantity} ${p.unit}) is below minimum safety reserve of ${p.minStockLevel}.`,
    })),
    ...overstockItems.map((p) => ({
      product: p,
      type: 'overstock' as const,
      urgency: 'medium',
      message: `Stock level (${p.currentQuantity} ${p.unit}) exceeds maximum warehouse ceiling of ${p.maxStockLevel}.`,
    })),
  ].filter((a) => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const handleStartEditMinStock = (product: InventoryProduct) => {
    setEditingMinStockId(product.id);
    setMinStockValue(product.minStockLevel);
  };

  const handleSaveMinStock = (productId: string) => {
    onUpdateMinStock(productId, minStockValue);
    setEditingMinStockId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Low Stock, Depletion &amp; Overstock Alert Center
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900">
              Live Threshold Monitoring
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Real-time replenishment warnings to avoid stockouts, lost sales, and overstock holding costs.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>{outOfStockItems.length} Depleted</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{lowStockItems.length} Below Min</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          All Active Alerts ({displayedAlerts.length})
        </button>
        <button
          onClick={() => setActiveFilter('out_of_stock')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'out_of_stock'
              ? 'bg-red-600 text-white'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Critical Out of Stock ({outOfStockItems.length})
        </button>
        <button
          onClick={() => setActiveFilter('low_stock')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'low_stock'
              ? 'bg-amber-600 text-white'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Low Stock Replenishment ({lowStockItems.length})
        </button>
        <button
          onClick={() => setActiveFilter('overstock')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'overstock'
              ? 'bg-blue-600 text-white'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Overstock Ceiling ({overstockItems.length})
        </button>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {displayedAlerts.map(({ product, type, urgency, message }) => (
          <div
            key={product.id}
            className={`p-4 rounded-xl border bg-white dark:bg-[#12151b] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
              type === 'out_of_stock'
                ? 'border-red-200 dark:border-red-900/60'
                : type === 'low_stock'
                ? 'border-amber-200 dark:border-amber-900/60'
                : 'border-blue-200 dark:border-blue-900/60'
            }`}
          >
            {/* Left: Product Info & Message */}
            <div className="flex items-start space-x-3.5">
              <span
                className={`p-2.5 rounded-xl shrink-0 ${
                  type === 'out_of_stock'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                    : type === 'low_stock'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </span>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {product.name}
                  </h3>
                  <span className="font-mono text-xs text-neutral-500 font-semibold">
                    ({product.sku})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      type === 'out_of_stock'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                        : type === 'low_stock'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400">{message}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 pt-1">
                  <span>
                    Location: <strong className="text-neutral-700 dark:text-neutral-300">{product.location}</strong>
                  </span>
                  <span>
                    Primary Supplier: <strong className="text-neutral-700 dark:text-neutral-300">{product.supplierName}</strong>
                  </span>
                  <span>
                    Estimated Unit Cost: <strong className="font-mono text-neutral-700 dark:text-neutral-300">KES {product.buyingPriceKes.toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Threshold Config & Quick Actions */}
            <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
              {/* Threshold Editor */}
              {editingMinStockId === product.id ? (
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-neutral-500">Min:</span>
                  <input
                    type="number"
                    min="1"
                    value={minStockValue}
                    onChange={(e) => setMinStockValue(parseInt(e.target.value, 10) || 1)}
                    className="w-16 px-2 py-1 text-xs border border-neutral-300 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900 font-mono"
                  />
                  <button
                    onClick={() => handleSaveMinStock(product.id)}
                    className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                    title="Save Minimum Threshold"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEditMinStock(product)}
                  title="Configure Minimum Stock Threshold"
                  className="px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3 text-neutral-400" />
                  <span>Min: {product.minStockLevel} {product.unit}</span>
                </button>
              )}

              {/* Quick Restock PO Button */}
              <button
                onClick={() => onCreatePOForProduct(product)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Restock / PO</span>
              </button>
            </div>
          </div>
        ))}

        {displayedAlerts.length === 0 && (
          <div className="p-10 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              All Stock Levels are Healthy
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No products are currently depleted or below minimum reorder thresholds in this filter category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
