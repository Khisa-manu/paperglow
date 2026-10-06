import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Barcode,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle2,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import {
  InventoryProduct,
  ProductCategory,
  Supplier,
  StockStatus,
} from '../../types/stockInventory';

interface ProductsModuleProps {
  products: InventoryProduct[];
  categories: ProductCategory[];
  suppliers: Supplier[];
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: InventoryProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenStockAdjustment: (productId: string) => void;
}

export const ProductsModule: React.FC<ProductsModuleProps> = ({
  products,
  categories,
  suppliers,
  onOpenAddProduct,
  onOpenEditProduct,
  onDeleteProduct,
  onOpenStockAdjustment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'value' | 'sku'>('name');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.barcode.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.supplierName.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'quantity') return a.currentQuantity - b.currentQuantity;
        if (sortBy === 'sku') return a.sku.localeCompare(b.sku);
        if (sortBy === 'value')
          return b.currentQuantity * b.buyingPriceKes - a.currentQuantity * a.buyingPriceKes;
        return 0;
      });
  }, [products, selectedCategory, statusFilter, searchQuery, sortBy]);

  const getStatusBadge = (status: StockStatus, currentQty: number, minStock: number) => {
    if (currentQty === 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800">
          Out of Stock
        </span>
      );
    }
    if (currentQty <= minStock) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          Low Stock ({currentQty} left)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        In Stock
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Counters */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Master Product &amp; SKU Directory
          </h2>
          <p className="text-xs text-neutral-500">
            Maintain item master records, wholesale buying costs, retail pricing, barcoding, and minimum reorder points.
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, SKU or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock Only</option>
              <option value="low_stock">Low Stock Alerts Only</option>
              <option value="out_of_stock">Out of Stock Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="name">Sort by Product Name</option>
              <option value="quantity">Sort by Quantity (Lowest first)</option>
              <option value="value">Sort by Inventory Value (Highest first)</option>
              <option value="sku">Sort by SKU Code</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span>
            Showing <strong className="text-neutral-900 dark:text-white">{filteredProducts.length}</strong> of{' '}
            {products.length} products
          </span>
          {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="text-red-600 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
            <thead className="bg-neutral-50 dark:bg-[#171a22] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-3">SKU &amp; Barcode</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Stock Level</th>
                <th className="py-3 px-3">Cost / Retail (KES)</th>
                <th className="py-3 px-3">Total Asset Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredProducts.map((p) => {
                const totalValue = p.currentQuantity * p.buyingPriceKes;
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    {/* Column 1: Image & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div className="space-y-0.5 max-w-xs">
                          <div className="font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-neutral-400 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{p.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: SKU & Barcode */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="font-bold text-neutral-800 dark:text-neutral-200">
                        {p.sku}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center space-x-1">
                        <Barcode className="w-3 h-3" />
                        <span>{p.barcode}</span>
                      </div>
                    </td>

                    {/* Column 3: Category & Supplier */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {p.categoryName}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-[130px]">
                        {p.supplierName}
                      </div>
                    </td>

                    {/* Column 4: Current Qty vs Min/Max */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {p.currentQuantity}{' '}
                        <span className="text-[11px] font-normal text-neutral-400 font-sans">
                          {p.unit}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Min: {p.minStockLevel} · Max: {p.maxStockLevel}
                      </div>
                    </td>

                    {/* Column 5: Buying / Selling Price */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-neutral-900 dark:text-white font-semibold">
                        KES {p.sellingPriceKes.toLocaleString()}{' '}
                        <span className="text-[10px] font-normal text-neutral-400">sell</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        KES {p.buyingPriceKes.toLocaleString()} cost
                      </div>
                    </td>

                    {/* Column 6: Asset Value */}
                    <td className="py-3.5 px-3 font-mono font-bold text-neutral-900 dark:text-white">
                      KES {totalValue.toLocaleString()}
                    </td>

                    {/* Column 7: Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(p.status, p.currentQuantity, p.minStockLevel)}
                    </td>

                    {/* Column 8: Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onOpenStockAdjustment(p.id)}
                          title="Quick Stock In / Out Adjustment"
                          className="p-1.5 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEditProduct(p)}
                          title="Edit Product Record"
                          className="p-1.5 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          title="Delete Product"
                          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-neutral-500">
                    No products matching your search criteria found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
