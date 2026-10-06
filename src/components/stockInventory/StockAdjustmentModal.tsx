import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeftRight,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
  Package,
} from 'lucide-react';
import {
  InventoryProduct,
  MovementType,
} from '../../types/stockInventory';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryProduct[];
  initialProductId?: string;
  onRecordMovement: (
    productId: string,
    type: MovementType,
    quantity: number,
    reason: string,
    referenceNumber: string,
    notes?: string
  ) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProductId,
  onRecordMovement,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || ''
  );
  const [type, setType] = useState<MovementType>('stock_in');
  const [quantity, setQuantity] = useState('5');
  const [reason, setReason] = useState('Direct warehouse replenishment');
  const [refNumber, setRefNumber] = useState('ADJ-' + Math.floor(100 + Math.random() * 900));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId]);

  if (!isOpen) return null;

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!product || isNaN(qty) || qty <= 0) return;

    onRecordMovement(
      product.id,
      type,
      qty,
      reason,
      refNumber || 'ADJ-' + Date.now(),
      notes
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Quick Stock Adjustment
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
              Select Product Item *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.currentQuantity} {p.unit} in stock)
                </option>
              ))}
            </select>
          </div>

          {product && (
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between text-xs">
              <div>
                <span className="text-neutral-500">Current Balance:</span>
                <div className="font-bold font-mono text-neutral-900 dark:text-white">
                  {product.currentQuantity} {product.unit} (SKU: {product.sku})
                </div>
              </div>
              <div className="text-right">
                <span className="text-neutral-500">Location:</span>
                <div className="font-medium text-neutral-800 dark:text-neutral-200">
                  {product.location}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Adjustment Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MovementType)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
              >
                <option value="stock_in">+ Stock In (Receive)</option>
                <option value="stock_out">- Stock Out (Dispatch)</option>
                <option value="adjustment">+/- Recount Audit Correction</option>
                <option value="damaged_lost">- Damaged / Lost Write-off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Quantity Changed *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Reason / Explanation *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Audit recount correction, supplier sample delivery"
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Reference Document #
            </label>
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
