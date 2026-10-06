import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';
import {
  InventoryProduct,
  StockMovement,
  MovementType,
} from '../../types/stockInventory';

interface StockManagementModuleProps {
  products: InventoryProduct[];
  movements: StockMovement[];
  onRecordMovement: (
    productId: string,
    type: MovementType,
    quantity: number,
    reason: string,
    referenceNumber: string,
    notes?: string
  ) => void;
}

export const StockManagementModule: React.FC<StockManagementModuleProps> = ({
  products,
  movements,
  onRecordMovement,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'quick_action'>('history');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Action Form State
  const [actionType, setActionType] = useState<MovementType>('stock_in');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<string>('10');
  const [reason, setReason] = useState<string>('Direct supplier shipment received');
  const [referenceNumber, setReferenceNumber] = useState<string>(
    'STK-' + Math.floor(1000 + Math.random() * 9000)
  );
  const [notes, setNotes] = useState<string>('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(quantity, 10);
    if (!selectedProduct || isNaN(qtyNum) || qtyNum <= 0) return;

    onRecordMovement(
      selectedProduct.id,
      actionType,
      qtyNum,
      reason,
      referenceNumber || 'STK-' + Date.now(),
      notes
    );

    setSuccessBanner(
      `Recorded ${actionType.replace('_', ' ').toUpperCase()} of ${qtyNum} ${selectedProduct.unit} for ${selectedProduct.name}.`
    );
    setTimeout(() => setSuccessBanner(null), 3500);

    // Reset reference number
    setReferenceNumber('STK-' + Math.floor(1000 + Math.random() * 9000));
    setQuantity('10');
    setActiveTab('history');
  };

  const filteredMovements = movements.filter((m) => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.productName.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q) ||
        m.referenceNumber.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Stock In, Stock Out &amp; Adjustments
          </h2>
          <p className="text-xs text-neutral-500">
            Audit-trailed movement ledger with automated quantity recalculation for deliveries, dispatches, and inventory write-offs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setActionType('stock_in');
              setReason('Direct supplier shipment restock');
              setActiveTab('quick_action');
            }}
            className="px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Stock In</span>
          </button>
          <button
            onClick={() => {
              setActionType('stock_out');
              setReason('Warehouse dispatch / transfer to branch');
              setActiveTab('quick_action');
            }}
            className="px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Stock Out</span>
          </button>
          <button
            onClick={() => {
              setActionType('damaged_lost');
              setReason('Damaged or expired inventory write-off');
              setActiveTab('quick_action');
            }}
            className="px-3 py-2 text-xs font-semibold bg-neutral-800 dark:bg-neutral-700 hover:bg-black text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Write-Off</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Module View Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Movement Audit History ({movements.length})
        </button>
        <button
          onClick={() => setActiveTab('quick_action')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'quick_action'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Post Movement Form
        </button>
      </div>

      {activeTab === 'quick_action' ? (
        /* Movement Posting Form */
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs max-w-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Record Stock Adjustment / Transfer
              </h3>
              <p className="text-xs text-neutral-500">
                Immediately updates live stock balance and enters permanent audit trail.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {actionType.replace('_', ' ')}
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Movement Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Transaction Type *
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as MovementType)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  <option value="stock_in">Stock In (Receive / Restock)</option>
                  <option value="stock_out">Stock Out (Dispatch / Consumption)</option>
                  <option value="adjustment">Count Adjustment (Audit Reconciliation)</option>
                  <option value="transfer">Inter-Warehouse Transfer</option>
                  <option value="damaged_lost">Damaged / Lost Stock (Write-off)</option>
                </select>
              </div>

              {/* Product Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Product Item *
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
            </div>

            {/* Current Balance preview card */}
            {selectedProduct && (
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500">Current Warehouse Balance:</span>
                  <div className="font-bold font-mono text-neutral-900 dark:text-white">
                    {selectedProduct.currentQuantity} {selectedProduct.unit} (SKU: {selectedProduct.sku})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500">Unit Cost:</span>
                  <div className="font-mono text-neutral-900 dark:text-white">
                    KES {selectedProduct.buyingPriceKes.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Quantity ({selectedProduct?.unit || 'Units'}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Reference / Document Number
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. DN-1029, ADJ-441"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Movement Reason *
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Delivery from supplier, site dispatch, physical stock recount"
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add inspector names, condition details, or batch identifiers..."
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Post Stock Movement
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Movements Audit Table */
        <div className="space-y-3">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search reference, SKU or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-500">Filter Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="all">All Movements ({movements.length})</option>
                <option value="stock_in">Stock In</option>
                <option value="stock_out">Stock Out</option>
                <option value="adjustment">Adjustments</option>
                <option value="transfer">Transfers</option>
                <option value="damaged_lost">Damaged / Lost</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
                <thead className="bg-neutral-50 dark:bg-[#171a22] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Reference</th>
                    <th className="py-3 px-3">Qty Changed</th>
                    <th className="py-3 px-3">Balance After</th>
                    <th className="py-3 px-3">Reason / Details</th>
                    <th className="py-3 px-4">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredMovements.map((m) => {
                    const isPositive =
                      m.type === 'stock_in' ||
                      (m.type === 'adjustment' && m.newQuantity > m.previousQuantity);
                    return (
                      <tr
                        key={m.id}
                        className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-neutral-500">
                          {m.timestamp.replace('T', ' ').slice(0, 16)}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              m.type === 'stock_in'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                                : m.type === 'stock_out'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                                : m.type === 'damaged_lost'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                                : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                            }`}
                          >
                            {m.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {m.productName}
                          </div>
                          <div className="text-[10px] font-mono text-neutral-400">{m.sku}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-neutral-800 dark:text-neutral-200">
                          {m.referenceNumber}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-sm">
                          <span className={isPositive ? 'text-emerald-600' : 'text-red-600'}>
                            {isPositive ? `+${m.quantity}` : `-${m.quantity}`}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">
                          {m.newQuantity}
                        </td>
                        <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                          {m.reason}
                          {m.notes && <span className="text-neutral-400 block text-[10px]">({m.notes})</span>}
                        </td>
                        <td className="py-3 px-4 text-neutral-500 whitespace-nowrap text-[11px]">
                          {m.performedBy}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredMovements.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs text-neutral-500">
                        No stock movement records found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
