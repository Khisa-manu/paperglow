import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  X,
  History,
  TrendingDown,
  TrendingUp,
  Package,
} from 'lucide-react';
import {
  MedicineProduct,
  StockMovement,
  StockMovementType,
} from '../../types/pharmacyManager';

interface PharmStockManagementModuleProps {
  medicines: MedicineProduct[];
  movements: StockMovement[];
  onAddStock: (productId: string, quantityToAdd: number, batchNumber: string, reason: string) => void;
  onAdjustStock: (productId: string, quantityToDeduct: number, reason: string, type: StockMovementType) => void;
}

export const PharmStockManagementModule: React.FC<PharmStockManagementModuleProps> = ({
  medicines,
  movements,
  onAddStock,
  onAdjustStock,
}) => {
  const [activeTab, setActiveTab] = useState<'movements' | 'low_stock' | 'expiries'>('movements');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Form State: Add Stock
  const [addForm, setAddForm] = useState<{
    productId: string;
    quantity: number;
    batchNumber: string;
    reason: string;
  }>({
    productId: medicines[0]?.id || '',
    quantity: 20,
    batchNumber: 'BTH-NEW-01',
    reason: 'Restock shipment received from supplier',
  });

  // Form State: Adjust / Write-off Stock
  const [adjForm, setAdjForm] = useState<{
    productId: string;
    quantity: number;
    type: StockMovementType;
    reason: string;
  }>({
    productId: medicines[0]?.id || '',
    quantity: 1,
    type: 'adjustment_loss',
    reason: 'Broken bottle during counter restock',
  });

  const lowStockItems = medicines.filter((m) => m.quantityInStock <= m.minStockLevel);

  const now = new Date('2026-10-05');
  const ninetyDaysLater = new Date(now.getTime() + 90 * 86400000);
  const expiringItems = medicines.filter((m) => {
    const exp = new Date(m.expiryDate);
    return exp <= ninetyDaysLater;
  });

  const filteredMovements = movements.filter((mov) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      mov.productName.toLowerCase().includes(q) ||
      mov.movementNumber.toLowerCase().includes(q) ||
      mov.batchNumber.toLowerCase().includes(q) ||
      mov.reason.toLowerCase().includes(q)
    );
  });

  const handleConfirmAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.productId || addForm.quantity <= 0) return;
    onAddStock(addForm.productId, Number(addForm.quantity), addForm.batchNumber, addForm.reason);
    setIsAddStockModalOpen(false);
  };

  const handleConfirmAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjForm.productId || adjForm.quantity <= 0) return;
    onAdjustStock(adjForm.productId, Number(adjForm.quantity), adjForm.reason, adjForm.type);
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Stock Management, Batch Expiries &amp; Audit Logs
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Receive incoming medicine shipments, record breakage / damage adjustments, and inspect immutable stock movement ledgers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5 text-red-600" />
            <span>Adjust / Write-off</span>
          </button>
          <button
            onClick={() => setIsAddStockModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Receive Stock In</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'movements'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Stock Movement Ledger ({movements.length})
        </button>
        <button
          onClick={() => setActiveTab('low_stock')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'low_stock'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <span>Low-Stock Alerts</span>
          <span className="font-mono text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full tabular-nums">
            {lowStockItems.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('expiries')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'expiries'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <span>Expiry Watch (&lt; 90 Days)</span>
          <span className="font-mono text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full tabular-nums">
            {expiringItems.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Movements Ledger */}
      {activeTab === 'movements' && (
        <div className="space-y-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stock movement logs..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
                  <tr>
                    <th className="py-3 px-4">Log #</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Medicine Item</th>
                    <th className="py-3 px-4">Batch Number</th>
                    <th className="py-3 px-4">Movement Type</th>
                    <th className="py-3 px-4">Quantity Change</th>
                    <th className="py-3 px-4">Balance After</th>
                    <th className="py-3 px-4">Reason / Authorization</th>
                    <th className="py-3 px-4">Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                  {filteredMovements.map((mov) => (
                    <tr
                      key={mov.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {mov.movementNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">
                        {mov.timestamp}
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                        {mov.productName}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                        {mov.batchNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            mov.movementType === 'purchase_receipt'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : mov.movementType === 'sale_dispense'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          }`}
                        >
                          {mov.movementType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold tabular-nums">
                        <span
                          className={
                            mov.quantityChange > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }
                        >
                          {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                        {mov.balanceAfter}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 max-w-[200px] truncate">
                        {mov.reason}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 text-[11px]">
                        {mov.performedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Low Stock Alerts */}
      {activeTab === 'low_stock' && (
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>
                <strong>{lowStockItems.length} products</strong> have fallen below minimum shelf reserve thresholds.
              </span>
            </div>
          </div>

          {lowStockItems.map((med) => (
            <div
              key={med.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 text-xs"
            >
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  {med.name}
                </div>
                <div className="text-neutral-500">
                  {med.genericName} · Manufacturer: {med.manufacturer} · Location: {med.shelfLocation}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  Batch: {med.batchNumber} · SKU: {med.skuBarcode}
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto">
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-red-600 dark:text-red-400 tabular-nums">
                    {med.quantityInStock} units
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Min Threshold: {med.minStockLevel}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAddForm((prev) => ({
                      ...prev,
                      productId: med.id,
                      batchNumber: med.batchNumber,
                    }));
                    setIsAddStockModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                >
                  Restock
                </button>
              </div>
            </div>
          ))}

          {lowStockItems.length === 0 && (
            <div className="p-8 text-center text-neutral-400 text-xs">
              All medicines are fully stocked above minimum reserve levels!
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Expiry Watch */}
      {activeTab === 'expiries' && (
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
          <div className="p-4 bg-red-50/40 dark:bg-red-950/20 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-900 dark:text-red-200 text-xs">
              <Clock className="w-4 h-4 text-red-600" />
              <span>
                <strong>{expiringItems.length} products</strong> are expiring within 90 days. Implement first-expiry, first-out (FEFO) dispensing.
              </span>
            </div>
          </div>

          {expiringItems.map((med) => (
            <div
              key={med.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 text-xs"
            >
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  {med.name}
                </div>
                <div className="text-neutral-500">
                  {med.genericName} · Manufacturer: {med.manufacturer} · Location: {med.shelfLocation}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  Batch: {med.batchNumber} · Unit: {med.unitOfMeasure}
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto">
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-red-600 dark:text-red-400">
                    Expires: {med.expiryDate}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Stock on hand: {med.quantityInStock} units
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAdjForm({
                      productId: med.id,
                      quantity: med.quantityInStock,
                      type: 'expired_removal',
                      reason: `Batch ${med.batchNumber} write-off due to near expiry date`,
                    });
                    setIsAdjustModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                >
                  Write-off Expired
                </button>
              </div>
            </div>
          ))}

          {expiringItems.length === 0 && (
            <div className="p-8 text-center text-neutral-400 text-xs">
              No medicines nearing expiry within 90 days. All batches are safe and current!
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Stock In */}
      {isAddStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Receive Stock Batch
              </h3>
              <button
                onClick={() => setIsAddStockModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddStock} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Medicine *
                </label>
                <select
                  value={addForm.productId}
                  onChange={(e) => {
                    const m = medicines.find((x) => x.id === e.target.value);
                    setAddForm({
                      ...addForm,
                      productId: e.target.value,
                      batchNumber: m?.batchNumber || 'BTH-NEW',
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Current: {m.quantityInStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Quantity to Add *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={addForm.quantity}
                    onChange={(e) => setAddForm({ ...addForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Batch Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.batchNumber}
                    onChange={(e) => setAddForm({ ...addForm, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Reason / Shipment Note
                </label>
                <input
                  type="text"
                  value={addForm.reason}
                  onChange={(e) => setAddForm({ ...addForm, reason: e.target.value })}
                  placeholder="e.g. Inbound shipment from Harleys"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddStockModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm Stock In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adjust / Write-off Stock */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Adjust / Write-off Stock
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustStock} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Medicine Item *
                </label>
                <select
                  value={adjForm.productId}
                  onChange={(e) => setAdjForm({ ...adjForm, productId: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Stock: {m.quantityInStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Quantity to Deduct *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adjForm.quantity}
                    onChange={(e) => setAdjForm({ ...adjForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Adjustment Reason
                  </label>
                  <select
                    value={adjForm.type}
                    onChange={(e) => setAdjForm({ ...adjForm, type: e.target.value as StockMovementType })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="adjustment_loss">Damage / Breakage</option>
                    <option value="expired_removal">Expired Removal</option>
                    <option value="return_supplier">Return to Supplier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Audit Notes / Reason *
                </label>
                <input
                  type="text"
                  required
                  value={adjForm.reason}
                  onChange={(e) => setAdjForm({ ...adjForm, reason: e.target.value })}
                  placeholder="e.g. Expired batch disposed per PPB protocol"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Authorize Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
