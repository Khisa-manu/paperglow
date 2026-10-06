import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  FileText,
  Truck,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
  InventoryProduct,
  PurchaseOrderStatus,
} from '../../types/stockInventory';

interface PurchasesModuleProps {
  purchases: PurchaseOrder[];
  suppliers: Supplier[];
  products: InventoryProduct[];
  onCreatePurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt'>) => void;
  onReceiveStock: (poId: string) => void;
}

export const PurchasesModule: React.FC<PurchasesModuleProps> = ({
  purchases,
  suppliers,
  products,
  onCreatePurchaseOrder,
  onReceiveStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New PO Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [poNumber, setPoNumber] = useState<string>('PO-' + Math.floor(1000 + Math.random() * 9000));
  const [expectedDate, setExpectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState<string>('Scheduled restocking order');

  // Line items state
  const [lineItems, setLineItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 10 },
  ]);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { productId: products[0]?.id || '', quantity: 10 }]);
  };

  const handleRemoveLineItem = (idx: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  const handleUpdateLineItem = (idx: number, field: 'productId' | 'quantity', val: any) => {
    const updated = [...lineItems];
    updated[idx] = { ...updated[idx], [field]: val };
    setLineItems(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
    if (!sup) return;

    const builtItems: PurchaseOrderItem[] = lineItems.map((li) => {
      const prod = products.find((p) => p.id === li.productId) || products[0];
      const unitCost = prod ? prod.buyingPriceKes : 1000;
      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: Number(li.quantity),
        unitCostKes: unitCost,
        totalCostKes: unitCost * Number(li.quantity),
        receivedQty: 0,
      };
    });

    const totalAmount = builtItems.reduce((acc, it) => acc + it.totalCostKes, 0);

    onCreatePurchaseOrder({
      poNumber,
      supplierId: sup.id,
      supplierName: sup.name,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: expectedDate,
      items: builtItems,
      totalAmountKes: totalAmount,
      status: 'ordered',
      invoiceNumber: 'PROFORMA-' + Math.floor(100 + Math.random() * 900),
      notes,
    });

    setIsCreateModalOpen(false);
    setPoNumber('PO-' + Math.floor(1000 + Math.random() * 9000));
  };

  const filteredPurchases = purchases.filter((po) => {
    if (statusFilter !== 'all' && po.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        (po.invoiceNumber && po.invoiceNumber.toLowerCase().includes(q))
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
            Purchase Orders &amp; Inbound Goods Receiving
          </h2>
          <p className="text-xs text-neutral-500">
            Generate replenishment purchase orders, verify supplier invoices, and 1-click receive stock into warehouse balance.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search PO #, supplier, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-neutral-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
          >
            <option value="all">All Orders ({purchases.length})</option>
            <option value="ordered">Ordered / In-Transit</option>
            <option value="received">Received into Stock</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Purchase Orders List Cards */}
      <div className="space-y-4">
        {filteredPurchases.map((po) => (
          <div
            key={po.id}
            className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                    {po.poNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      po.status === 'received'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {po.status}
                  </span>
                </div>
                <div className="text-xs text-neutral-500">
                  Vendor: <strong className="text-neutral-800 dark:text-neutral-200">{po.supplierName}</strong> · Ordered on {po.orderDate} · Expected: {po.expectedDeliveryDate}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-[11px] text-neutral-400">Total Purchase Value</div>
                  <div className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                    KES {po.totalAmountKes.toLocaleString()}
                  </div>
                </div>

                {po.status === 'ordered' && (
                  <button
                    onClick={() => onReceiveStock(po.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Receive Stock</span>
                  </button>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3">SKU</th>
                    <th className="py-2 px-3 text-right">Qty Ordered</th>
                    <th className="py-2 px-3 text-right">Unit Buying Cost</th>
                    <th className="py-2 px-3 text-right">Subtotal (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                  {po.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-sans font-medium text-neutral-900 dark:text-white">
                        {it.productName}
                      </td>
                      <td className="py-2 px-3 text-neutral-500">{it.sku}</td>
                      <td className="py-2 px-3 text-right font-bold text-neutral-900 dark:text-white">
                        {it.quantity}
                      </td>
                      <td className="py-2 px-3 text-right">
                        KES {it.unitCostKes.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-neutral-900 dark:text-white">
                        KES {it.totalCostKes.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {po.notes && (
              <div className="text-[11px] text-neutral-500 bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <strong>Internal Note:</strong> {po.notes}
              </div>
            )}
          </div>
        ))}

        {filteredPurchases.length === 0 && (
          <div className="p-8 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl">
            No purchase orders found matching this filter.
          </div>
        )}
      </div>

      {/* Modal: Create Purchase Order */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Issue Purchase Order &amp; Restock Request
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    PO Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Supplier Vendor *
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Line items section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Order Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs text-red-600 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((li, idx) => {
                    const prod = products.find((p) => p.id === li.productId) || products[0];
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                      >
                        <div className="flex-1">
                          <select
                            value={li.productId}
                            onChange={(e) => handleUpdateLineItem(idx, 'productId', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} (KES {p.buyingPriceKes})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            value={li.quantity}
                            onChange={(e) =>
                              handleUpdateLineItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)
                            }
                            className="w-full px-2 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="p-1 text-neutral-400 hover:text-red-600"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Purchase Order Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  Dispatch Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
