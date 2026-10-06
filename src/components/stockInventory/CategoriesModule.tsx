import React, { useState } from 'react';
import {
  Tags,
  Plus,
  Package,
  Boxes,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';
import {
  ProductCategory,
  InventoryProduct,
} from '../../types/stockInventory';

interface CategoriesModuleProps {
  categories: ProductCategory[];
  products: InventoryProduct[];
  onAddCategory: (category: Omit<ProductCategory, 'id'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSelectCategoryFilter: (categoryId: string) => void;
}

export const CategoriesModule: React.FC<CategoriesModuleProps> = ({
  categories,
  products,
  onAddCategory,
  onDeleteCategory,
  onSelectCategoryFilter,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('red');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      name,
      description,
      color,
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Product Categories &amp; Departmental Hierarchy
          </h2>
          <p className="text-xs text-neutral-500">
            Structure warehouse catalog, view stock aggregation summaries, and track valuation by product line.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.categoryId === cat.id);
          const totalUnits = catProducts.reduce((sum, p) => sum + p.currentQuantity, 0);
          const totalValuationKes = catProducts.reduce(
            (sum, p) => sum + p.buyingPriceKes * p.currentQuantity,
            0
          );
          const lowStockCount = catProducts.filter(
            (p) => p.currentQuantity <= p.minStockLevel
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                    {catProducts.length} Products
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2">{cat.description}</p>
              </div>

              {/* Metrics Summary */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Units in Stock:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">
                    {totalUnits.toLocaleString()} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Inventory Valuation:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    KES {totalValuationKes.toLocaleString()}
                  </span>
                </div>
                {lowStockCount > 0 && (
                  <div className="flex justify-between text-amber-600 font-semibold text-[11px]">
                    <span>Low Stock Items:</span>
                    <span>{lowStockCount} need reorder</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                >
                  View Category Products →
                </button>

                {categories.length > 1 && (
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Category */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Create Product Category
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Plumbing & Sanitary Ware"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="PPR pipes, fittings, taps, valves and adhesives..."
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
