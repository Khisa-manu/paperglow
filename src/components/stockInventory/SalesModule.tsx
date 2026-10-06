import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  ShoppingCart,
  User,
  Phone,
  FileText,
  CheckCircle2,
  X,
  CreditCard,
  DollarSign,
  Printer,
} from 'lucide-react';
import {
  StockSale,
  StockSaleItem,
  InventoryProduct,
  PaymentMethod,
} from '../../types/stockInventory';

interface SalesModuleProps {
  sales: StockSale[];
  products: InventoryProduct[];
  onRecordSale: (sale: Omit<StockSale, 'id' | 'createdAt'>) => void;
}

export const SalesModule: React.FC<SalesModuleProps> = ({
  sales,
  products,
  onRecordSale,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'pos'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<StockSale | null>(null);

  // New Sale POS Form State
  const [customerName, setCustomerName] = useState('Nairobi Commercial Client');
  const [customerPhone, setCustomerPhone] = useState('+254 7');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [notes, setNotes] = useState('Over-the-counter stock dispatch');
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 1 },
  ]);

  const handleAddCartItem = () => {
    setCartItems([...cartItems, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveCartItem = (idx: number) => {
    if (cartItems.length === 1) return;
    setCartItems(cartItems.filter((_, i) => i !== idx));
  };

  const handleUpdateCartItem = (idx: number, field: 'productId' | 'quantity', val: any) => {
    const updated = [...cartItems];
    updated[idx] = { ...updated[idx], [field]: val };
    setCartItems(updated);
  };

  const computedSaleItems: StockSaleItem[] = cartItems.map((ci) => {
    const prod = products.find((p) => p.id === ci.productId) || products[0];
    const unitPrice = prod ? prod.sellingPriceKes : 1000;
    return {
      productId: prod?.id || '',
      productName: prod?.name || '',
      sku: prod?.sku || '',
      quantity: Number(ci.quantity),
      unitPriceKes: unitPrice,
      subtotalKes: unitPrice * Number(ci.quantity),
    };
  });

  const grandTotalKes = computedSaleItems.reduce((acc, it) => acc + it.subtotalKes, 0);

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || computedSaleItems.length === 0) return;

    const receiptNum = 'SALE-' + Math.floor(1000 + Math.random() * 9000);

    onRecordSale({
      receiptNumber: receiptNum,
      date: new Date().toISOString().split('T')[0],
      customerName,
      customerPhone,
      items: computedSaleItems,
      totalAmountKes: grandTotalKes,
      paymentMethod,
      notes,
    });

    setActiveTab('history');
    setCartItems([{ productId: products[0]?.id || '', quantity: 1 }]);
  };

  const filteredSales = sales.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.receiptNumber.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      (s.customerPhone && s.customerPhone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Stock Sales &amp; Dispatch Register
          </h2>
          <p className="text-xs text-neutral-500">
            Record customer stock out orders, auto-calculate KES totals, generate sales receipts, and decrement warehouse inventory.
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === 'pos' ? 'history' : 'pos')}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{activeTab === 'pos' ? 'View Sales History' : 'New Stock Sale Order'}</span>
        </button>
      </div>

      {activeTab === 'pos' ? (
        /* POS Form */
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs max-w-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Record Stock Out / Sales Order
              </h3>
              <p className="text-xs text-neutral-500">
                Products will automatically be deducted from inventory balance.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Total: KES {grandTotalKes.toLocaleString()}
            </span>
          </div>

          <form onSubmit={handleRecordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Customer / Contractor Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone (for M-Pesa Receipt)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

            {/* Product items selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Select Products to Dispatch
                </label>
                <button
                  type="button"
                  onClick={handleAddCartItem}
                  className="text-xs text-red-600 font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="space-y-2">
                {cartItems.map((ci, idx) => {
                  const prod = products.find((p) => p.id === ci.productId) || products[0];
                  const subtotal = (prod?.sellingPriceKes || 0) * (ci.quantity || 1);
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                    >
                      <div className="flex-1">
                        <select
                          value={ci.productId}
                          onChange={(e) => handleUpdateCartItem(idx, 'productId', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.currentQuantity} {p.unit} avail) — KES {p.sellingPriceKes}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          max={prod?.currentQuantity || 999}
                          value={ci.quantity}
                          onChange={(e) =>
                            handleUpdateCartItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)
                          }
                          className="w-full px-2 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                        />
                      </div>

                      <div className="w-28 text-right font-mono font-bold text-xs text-neutral-900 dark:text-white">
                        KES {subtotal.toLocaleString()}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCartItem(idx)}
                        className="p-1 text-neutral-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                >
                  <option value="mpesa">Safaricom M-Pesa</option>
                  <option value="cash">Cash Counter Receipt</option>
                  <option value="card">Card / Visa / Mastercard</option>
                  <option value="bank_transfer">Bank Wire Transfer</option>
                  <option value="credit">Trade Credit / Account</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Order Note / Reference
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                Complete Sale &amp; Decrement Stock (KES {grandTotalKes.toLocaleString()})
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* History */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search receipt # or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="text-xs text-neutral-500">
              Total Dispatched Sales: <strong className="text-neutral-900 dark:text-white">{sales.length}</strong>
            </div>
          </div>

          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
                <thead className="bg-neutral-50 dark:bg-[#171a22] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items Dispatched</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3 text-right">Total (KES)</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredSales.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                        {s.receiptNumber}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-neutral-500">
                        {s.date}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {s.customerName}
                        </div>
                        {s.customerPhone && (
                          <div className="text-[10px] text-neutral-400">{s.customerPhone}</div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-neutral-800 dark:text-neutral-200">
                          {s.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {s.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-sm text-right text-neutral-900 dark:text-white">
                        KES {s.totalAmountKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceipt(s)}
                          className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
                <span className="font-bold text-sm font-['Poppins']">Sales Dispatch Note</span>
                <span className="font-mono text-xs text-red-600">({selectedReceipt.receiptNumber})</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date:</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Settlement:</span>
                <span className="uppercase font-semibold text-neutral-800 dark:text-neutral-200">{selectedReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-b border-neutral-100 dark:border-neutral-800 py-3 space-y-2">
              <span className="text-[11px] font-bold uppercase text-neutral-400">Items Dispatched</span>
              {selectedReceipt.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs font-mono">
                  <span className="font-sans text-neutral-800 dark:text-neutral-200">
                    {it.productName} <span className="text-neutral-400">x{it.quantity}</span>
                  </span>
                  <span className="font-bold">KES {it.subtotalKes.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-bold">
              <span>Total Paid:</span>
              <span className="font-mono text-red-600">KES {selectedReceipt.totalAmountKes.toLocaleString()}</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
