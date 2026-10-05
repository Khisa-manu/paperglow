import React, { useState, useMemo } from 'react';
import { InventoryItem, StockAdjustment } from '../../types/businessManager';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Edit,
  Trash2,
  TrendingUp,
  RotateCcw,
  X,
  Layers,
} from 'lucide-react';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  currencySymbol: string;
  onSaveProduct: (item: InventoryItem) => void;
  onDeleteProduct: (id: string) => void;
  onRecordAdjustment: (adj: StockAdjustment) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  currencySymbol,
  onSaveProduct,
  onDeleteProduct,
  onRecordAdjustment,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [targetAdjustProduct, setTargetAdjustProduct] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'restock' | 'damage' | 'recount' | 'return'>('restock');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');

  // Form states for Product
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [itemType, setItemType] = useState<'product' | 'service'>('product');
  const [category, setCategory] = useState('Signage & Displays');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [minStockThreshold, setMinStockThreshold] = useState<number>(5);
  const [buyingPrice, setBuyingPrice] = useState<number>(1000);
  const [sellingPrice, setSellingPrice] = useState<number>(2000);
  const [unit, setUnit] = useState('pcs');
  const [description, setDescription] = useState('');

  const categories = useMemo(() => {
    const set = new Set(inventory.map((i) => i.category));
    return ['All', ...Array.from(set)];
  }, [inventory]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setItemType('product');
    setCategory('Signage & Displays');
    setStockQuantity(20);
    setMinStockThreshold(5);
    setBuyingPrice(1200);
    setSellingPrice(2500);
    setUnit('pcs');
    setDescription('');
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingProduct(item);
    setName(item.name);
    setSku(item.sku);
    setItemType(item.type);
    setCategory(item.category);
    setStockQuantity(item.stockQuantity);
    setMinStockThreshold(item.minStockThreshold);
    setBuyingPrice(item.buyingPrice);
    setSellingPrice(item.sellingPrice);
    setUnit(item.unit);
    setDescription(item.description);
    setIsProductModalOpen(true);
  };

  const handleOpenAdjust = (item: InventoryItem) => {
    setTargetAdjustProduct(item);
    setAdjustType('restock');
    setAdjustQty(10);
    setAdjustReason('Regular supplier replenishment');
    setIsAdjustModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name,
      sku,
      type: itemType,
      category,
      stockQuantity: itemType === 'service' ? 999 : Number(stockQuantity),
      minStockThreshold: itemType === 'service' ? 0 : Number(minStockThreshold),
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      unit,
      description,
      lastAdjusted: '2026-03-31',
    };
    onSaveProduct(item);
    setIsProductModalOpen(false);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAdjustProduct) return;

    let delta = Number(adjustQty);
    if (adjustType === 'damage') {
      delta = -Math.abs(delta);
    } else if (adjustType === 'recount') {
      delta = Number(adjustQty) - targetAdjustProduct.stockQuantity;
    }

    const newQty = Math.max(0, targetAdjustProduct.stockQuantity + delta);

    const adj: StockAdjustment = {
      id: `adj-${Date.now()}`,
      productId: targetAdjustProduct.id,
      productName: targetAdjustProduct.name,
      adjustmentType: adjustType,
      quantityChange: delta,
      newQuantity: newQty,
      reason: adjustReason,
      adjustedBy: 'Operations Lead',
      date: '2026-03-31',
    };

    onRecordAdjustment(adj);
    setIsAdjustModalOpen(false);
  };

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesLowStock = !filterLowStockOnly || (item.type === 'product' && item.stockQuantity <= item.minStockThreshold);
      return matchesSearch && matchesCat && matchesLowStock;
    });
  }, [inventory, search, selectedCategory, filterLowStockOnly]);

  const totalValuationCost = inventory.reduce(
    (sum, i) => sum + (i.type === 'product' ? i.stockQuantity * i.buyingPrice : 0),
    0
  );
  const totalValuationRetail = inventory.reduce(
    (sum, i) => sum + (i.type === 'product' ? i.stockQuantity * i.sellingPrice : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Valuation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Items Catalog</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
            {inventory.length} <span className="text-xs font-normal text-neutral-500">Products &amp; Services</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Inventory Value (Cost)</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            {currencySymbol} {totalValuationCost.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Expected Retail Value</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {currencySymbol} {totalValuationRetail.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or SKU..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors inline-flex items-center gap-1.5 ${
              filterLowStockOnly
                ? 'bg-amber-500 text-white border-amber-600'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Only</span>
          </button>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Product / Service</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">SKU / Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Stock Qty</th>
                <th className="py-3 px-4 text-right">Buying Price</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-right">Margin %</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredItems.map((item) => {
                const isLow = item.type === 'product' && item.stockQuantity <= item.minStockThreshold;
                const marginPercent =
                  item.sellingPrice > 0
                    ? Math.round(((item.sellingPrice - item.buyingPrice) / item.sellingPrice) * 100)
                    : 0;

                return (
                  <tr key={item.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.name}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-400">{item.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      {item.category}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono uppercase text-[10px] text-neutral-500">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {item.type === 'service' ? (
                        <span className="text-neutral-400">Service (N/A)</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                          <span
                            className={`font-bold tabular-nums ${
                              isLow ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-100'
                            }`}
                          >
                            {item.stockQuantity} {item.unit}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                      {currencySymbol} {item.buyingPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
                      {currencySymbol} {item.sellingPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {marginPercent}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.type === 'product' && (
                          <button
                            onClick={() => handleOpenAdjust(item)}
                            title="Adjust Stock"
                            className="px-2 py-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm border border-neutral-200 dark:border-neutral-700"
                          >
                            Adjust Stock
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-neutral-500 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(item.id)}
                          className="p-1 text-neutral-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product / Service Editor Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-lg w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingProduct ? 'Edit Catalog Item' : 'New Product or Service'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Item Title / Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as 'product' | 'service')}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="product">Physical Product (Tracks Stock)</option>
                    <option value="service">Billable Service (Infinite Stock)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="pcs, box, reams, hours..."
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              {itemType === 'product' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Starting Stock Qty</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Low Stock Alert Threshold</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={minStockThreshold}
                      onChange={(e) => setMinStockThreshold(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Cost / Buying Price ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={buyingPrice}
                    onChange={(e) => setBuyingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Selling / Retail Price ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && targetAdjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Stock Adjustment</h3>
                <p className="text-neutral-500 text-[11px]">{targetAdjustProduct.name} (Current: {targetAdjustProduct.stockQuantity} {targetAdjustProduct.unit})</p>
              </div>
              <button onClick={() => setIsAdjustModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                >
                  <option value="restock">Restock (+ Add Quantity)</option>
                  <option value="damage">Damaged / Expired / Scrap (- Reduce Quantity)</option>
                  <option value="recount">Physical Audit Recount (Set Exact Quantity)</option>
                  <option value="return">Customer Return (+ Add Quantity)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  {adjustType === 'recount' ? 'New Exact Count Quantity' : 'Quantity Units'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Reason / Reference</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Delivered by supplier invoice #SP-9910"
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
