import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Barcode,
  Layers,
  MapPin,
  DollarSign,
  Plus,
} from 'lucide-react';
import {
  InventoryProduct,
  ProductCategory,
  Supplier,
  StockStatus,
} from '../../types/stockInventory';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProductCategory[];
  suppliers: Supplier[];
  editingProduct?: InventoryProduct | null;
  onSaveProduct: (product: Omit<InventoryProduct, 'id' | 'updatedAt' | 'status'> & { id?: string }) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  suppliers,
  editingProduct,
  onSaveProduct,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [buyingPriceKes, setBuyingPriceKes] = useState('2500');
  const [sellingPriceKes, setSellingPriceKes] = useState('3800');
  const [currentQuantity, setCurrentQuantity] = useState('20');
  const [minStockLevel, setMinStockLevel] = useState('5');
  const [maxStockLevel, setMaxStockLevel] = useState('50');
  const [unit, setUnit] = useState('Pcs');
  const [location, setLocation] = useState('Bay A • Shelf 01');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setBarcode(editingProduct.barcode);
      setCategoryId(editingProduct.categoryId);
      setSupplierId(editingProduct.supplierId);
      setBuyingPriceKes(editingProduct.buyingPriceKes.toString());
      setSellingPriceKes(editingProduct.sellingPriceKes.toString());
      setCurrentQuantity(editingProduct.currentQuantity.toString());
      setMinStockLevel(editingProduct.minStockLevel.toString());
      setMaxStockLevel(editingProduct.maxStockLevel.toString());
      setUnit(editingProduct.unit);
      setLocation(editingProduct.location);
      setImageUrl(editingProduct.imageUrl || '');
      setDescription(editingProduct.description || '');
    } else {
      setName('');
      setSku('PG-INV-' + Math.floor(1000 + Math.random() * 9000));
      setBarcode('6161100' + Math.floor(100000 + Math.random() * 900000));
      setCategoryId(categories[0]?.id || '');
      setSupplierId(suppliers[0]?.id || '');
      setBuyingPriceKes('2500');
      setSellingPriceKes('3800');
      setCurrentQuantity('20');
      setMinStockLevel('5');
      setMaxStockLevel('50');
      setUnit('Pcs');
      setLocation('Bay A • Shelf 01');
      setImageUrl('');
      setDescription('');
    }
  }, [editingProduct, isOpen, categories, suppliers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cat = categories.find((c) => c.id === categoryId) || categories[0];
    const sup = suppliers.find((s) => s.id === supplierId) || suppliers[0];

    onSaveProduct({
      id: editingProduct?.id,
      name,
      sku: sku || 'PG-INV-' + Date.now().toString().slice(-4),
      barcode: barcode || '616110' + Date.now().toString().slice(-6),
      categoryId: cat ? cat.id : 'cat-gen',
      categoryName: cat ? cat.name : 'General Supplies',
      supplierId: sup ? sup.id : 'sup-gen',
      supplierName: sup ? sup.name : 'Direct Importer',
      buyingPriceKes: parseInt(buyingPriceKes, 10) || 0,
      sellingPriceKes: parseInt(sellingPriceKes, 10) || 0,
      currentQuantity: parseInt(currentQuantity, 10) || 0,
      minStockLevel: parseInt(minStockLevel, 10) || 5,
      maxStockLevel: parseInt(maxStockLevel, 10) || 50,
      unit,
      location,
      imageUrl: imageUrl || undefined,
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              {editingProduct ? 'Edit Product Item Master' : 'Add New Inventory Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Product Commercial Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Industrial LED High-Bay Floodlight 150W"
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Stock Keeping Unit (SKU) *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Barcode Number (EAN-13 / Code 128) *
              </label>
              <input
                type="text"
                required
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Primary Supplier *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Buying Cost (KES) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={buyingPriceKes}
                onChange={(e) => setBuyingPriceKes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Selling Retail Price (KES) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={sellingPriceKes}
                onChange={(e) => setSellingPriceKes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white font-bold text-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Current Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Min Safety Level
              </label>
              <input
                type="number"
                min="1"
                required
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Max Stock Level
              </label>
              <input
                type="number"
                min="1"
                required
                value={maxStockLevel}
                onChange={(e) => setMaxStockLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Stock Unit (e.g. Pcs, Rolls)
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Warehouse Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bay A • Shelf 03"
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Product Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description &amp; Specifications
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical specifications, materials, warranty terms..."
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
