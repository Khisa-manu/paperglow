import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Building,
  Package,
  FileText,
  AlertTriangle,
  X,
  CreditCard,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import {
  PurchaseOrder,
  PharmacySupplier,
  MedicineProduct,
  PurchaseOrderItem,
} from '../../types/pharmacyManager';

interface PharmPurchasesModuleProps {
  purchaseOrders: PurchaseOrder[];
  suppliers: PharmacySupplier[];
  medicines: MedicineProduct[];
  onCreatePO: (po: Omit<PurchaseOrder, 'id' | 'poNumber'>) => void;
  onReceiveStockPO: (poId: string) => void;
  onRecordPaymentPO: (poId: string, amount: number) => void;
}

export const PharmPurchasesModule: React.FC<PharmPurchasesModuleProps> = ({
  purchaseOrders,
  suppliers,
  medicines,
  onCreatePO,
  onReceiveStockPO,
  onRecordPaymentPO,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ordered' | 'received' | 'partially_received'>('all');
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // New PO Form state
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState('2026-10-10');
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([
    {
      productId: medicines[0]?.id || 'med-1',
      productName: medicines[0]?.name || 'Augmentin 625mg Tablets',
      batchNumber: 'BTH-2026-N1',
      expiryDate: '2028-05-31',
      quantityOrdered: 30,
      quantityReceived: 0,
      buyingPriceKes: medicines[0]?.buyingPriceKes || 1450,
      totalCostKes: 30 * (medicines[0]?.buyingPriceKes || 1450),
    },
  ]);

  const [paymentModalPO, setPaymentModalPO] = useState<PurchaseOrder | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.invoiceNumber && po.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddItemToPO = () => {
    const defaultMed = medicines[0];
    if (!defaultMed) return;
    setOrderItems([
      ...orderItems,
      {
        productId: defaultMed.id,
        productName: defaultMed.name,
        batchNumber: 'BTH-NEW',
        expiryDate: '2028-06-30',
        quantityOrdered: 20,
        quantityReceived: 0,
        buyingPriceKes: defaultMed.buyingPriceKes,
        totalCostKes: 20 * defaultMed.buyingPriceKes,
      },
    ]);
  };

  const handleUpdateItem = (
    index: number,
    field: keyof PurchaseOrderItem,
    value: string | number
  ) => {
    const updated = [...orderItems];
    const current = { ...updated[index] };

    if (field === 'productId') {
      const med = medicines.find((m) => m.id === value);
      if (med) {
        current.productId = med.id;
        current.productName = med.name;
        current.buyingPriceKes = med.buyingPriceKes;
        current.totalCostKes = current.quantityOrdered * med.buyingPriceKes;
      }
    } else if (field === 'quantityOrdered') {
      const q = Math.max(1, Number(value) || 1);
      current.quantityOrdered = q;
      current.totalCostKes = q * current.buyingPriceKes;
    } else if (field === 'buyingPriceKes') {
      const p = Math.max(0, Number(value) || 0);
      current.buyingPriceKes = p;
      current.totalCostKes = current.quantityOrdered * p;
    } else {
      (current as Record<string, unknown>)[field] = value;
    }

    updated[index] = current;
    setOrderItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (orderItems.length <= 1) return;
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const totalCost = orderItems.reduce((sum, item) => sum + item.totalCostKes, 0);

  const handleSubmitNewPO = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supplier) return;

    onCreatePO({
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: expectedDate,
      status: 'ordered',
      items: orderItems,
      totalCostKes: totalCost,
      amountPaidKes: 0,
      paymentStatus: 'unpaid',
      invoiceNumber: `INV-${supplier.companyName.slice(0, 3).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
    });

    setIsNewPOOpen(false);
  };

  const handleOpenPayment = (po: PurchaseOrder) => {
    setPaymentModalPO(po);
    setPaymentAmount(po.totalCostKes - po.amountPaidKes);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalPO || paymentAmount <= 0) return;
    onRecordPaymentPO(paymentModalPO.id, paymentAmount);
    setPaymentModalPO(null);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-red-600" />
            <span>Purchases &amp; Supplier Invoices</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Order wholesale medicines from licensed pharmaceutical distributors, verify batches, and restock dispensary shelves.
          </p>
        </div>

        <button
          onClick={() => setIsNewPOOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Total Purchase Orders</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {purchaseOrders.length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Across {suppliers.length} distributors</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Awaiting Delivery</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-amber-600 dark:text-amber-400">
            {purchaseOrders.filter((p) => p.status === 'ordered').length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">In transit from warehouse</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Stock Received Value</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400">
            {formatKes(
              purchaseOrders
                .filter((p) => p.status === 'received')
                .reduce((sum, p) => sum + p.totalCostKes, 0)
            )}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Restocked into catalog</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Supplier Outstanding Payables</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-red-600 dark:text-red-400">
            {formatKes(suppliers.reduce((sum, s) => sum + s.outstandingBalanceKes, 0))}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Accounts payable balance</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#11141a] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO number, supplier, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(['all', 'ordered', 'received'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier Distributor</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Expected Delivery</th>
                <th className="py-3 px-4">Items / SKU</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredPOs.map((po) => (
                <tr key={po.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                    {po.poNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{po.supplierName}</div>
                    {po.invoiceNumber && (
                      <div className="text-[11px] text-neutral-400 font-mono">Inv: {po.invoiceNumber}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{po.orderDate}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{po.expectedDeliveryDate}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {po.items.reduce((s, i) => s + i.quantityOrdered, 0)} units
                    </span>
                    <span className="text-neutral-400 text-[10px] ml-1">({po.items.length} lines)</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {formatKes(po.totalCostKes)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        po.status === 'received'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {po.status === 'received' ? 'Received & Shelved' : 'In Transit / Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        po.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : po.paymentStatus === 'partial'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                      }`}
                    >
                      {po.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      {po.status !== 'received' && (
                        <button
                          onClick={() => onReceiveStockPO(po.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-2xs"
                          title="Verify delivery and restock into inventory"
                        >
                          Receive Stock
                        </button>
                      )}

                      {po.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => handleOpenPayment(po)}
                          className="px-2 py-1 text-[11px] font-medium rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                        >
                          Pay
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedPO(po)}
                        className="px-2 py-1 text-[11px] font-medium rounded text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPOs.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400 text-xs">
                    No purchase orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Details Drawer / Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Purchase Order {selectedPO.poNumber}
                </h3>
                <p className="text-xs text-neutral-500">Supplier: {selectedPO.supplierName}</p>
              </div>
              <button
                onClick={() => setSelectedPO(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900">
                <span className="text-neutral-400 text-[10px] block">Order Date</span>
                <span className="font-semibold">{selectedPO.orderDate}</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900">
                <span className="text-neutral-400 text-[10px] block">Expected Delivery</span>
                <span className="font-semibold">{selectedPO.expectedDeliveryDate}</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900">
                <span className="text-neutral-400 text-[10px] block">Total Invoiced</span>
                <span className="font-semibold font-mono text-red-600">{formatKes(selectedPO.totalCostKes)}</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900">
                <span className="text-neutral-400 text-[10px] block">Amount Settled</span>
                <span className="font-semibold font-mono text-emerald-600">{formatKes(selectedPO.amountPaidKes)}</span>
              </div>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Medicine Line</th>
                    <th className="py-2 px-3">Batch #</th>
                    <th className="py-2 px-3">Expiry</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-right">Cost (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {selectedPO.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-medium text-neutral-900 dark:text-neutral-100">{it.productName}</td>
                      <td className="py-2 px-3 font-mono text-neutral-500">{it.batchNumber}</td>
                      <td className="py-2 px-3 text-neutral-500">{it.expiryDate}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">{it.quantityOrdered}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">{formatKes(it.totalCostKes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPO(null)}
                className="px-4 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Purchase Order Modal */}
      {isNewPOOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
              <h3 className="font-bold text-base font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-red-600" />
                <span>Create Wholesale Purchase Order</span>
              </h3>
              <button
                onClick={() => setIsNewPOOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPO} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Pharmaceutical Supplier / Distributor
                  </label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.companyName} (Lead time: {s.leadTimeDays} days)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Order Lines ({orderItems.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemToPO}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine Line
                  </button>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-3">Medicine</th>
                        <th className="py-2 px-2">Batch #</th>
                        <th className="py-2 px-2">Expiry</th>
                        <th className="py-2 px-2 w-20">Qty</th>
                        <th className="py-2 px-2 w-24">Unit Cost</th>
                        <th className="py-2 px-2 text-right">Total</th>
                        <th className="py-2 px-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 px-3">
                            <select
                              value={item.productId}
                              onChange={(e) => handleUpdateItem(index, 'productId', e.target.value)}
                              className="w-full text-xs py-1 px-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a]"
                            >
                              {medicines.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={item.batchNumber}
                              onChange={(e) => handleUpdateItem(index, 'batchNumber', e.target.value)}
                              className="w-24 text-xs py-1 px-1.5 font-mono rounded border border-neutral-200 dark:border-neutral-700"
                              placeholder="Batch #"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="date"
                              value={item.expiryDate}
                              onChange={(e) => handleUpdateItem(index, 'expiryDate', e.target.value)}
                              className="w-28 text-xs py-1 px-1.5 rounded border border-neutral-200 dark:border-neutral-700"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantityOrdered}
                              onChange={(e) => handleUpdateItem(index, 'quantityOrdered', e.target.value)}
                              className="w-16 text-xs py-1 px-1.5 font-mono rounded border border-neutral-200 dark:border-neutral-700 text-center"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              min="0"
                              value={item.buyingPriceKes}
                              onChange={(e) => handleUpdateItem(index, 'buyingPriceKes', e.target.value)}
                              className="w-20 text-xs py-1 px-1.5 font-mono rounded border border-neutral-200 dark:border-neutral-700 text-right"
                            />
                          </td>
                          <td className="py-2 px-2 text-right font-mono font-bold">
                            {formatKes(item.totalCostKes)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {orderItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-neutral-400 hover:text-red-600"
                              >
                                &times;
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="text-xs text-neutral-500">
                  Total Order Amount:{' '}
                  <span className="font-bold text-sm font-mono text-red-600 dark:text-red-400">
                    {formatKes(totalCost)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPOOpen(false)}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer"
                  >
                    Issue Purchase Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment against PO Modal */}
      {paymentModalPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Record Payment to {paymentModalPO.supplierName}</span>
              </h3>
              <button
                onClick={() => setPaymentModalPO(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">PO Number:</span>
                  <span className="font-mono font-bold">{paymentModalPO.poNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total PO Cost:</span>
                  <span className="font-mono">{formatKes(paymentModalPO.totalCostKes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Already Settled:</span>
                  <span className="font-mono text-emerald-600">{formatKes(paymentModalPO.amountPaidKes)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-700 dark:text-neutral-300">Remaining Balance:</span>
                  <span className="font-mono text-red-600">
                    {formatKes(paymentModalPO.totalCostKes - paymentModalPO.amountPaidKes)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Amount (KES)
                </label>
                <input
                  type="number"
                  min="1"
                  max={paymentModalPO.totalCostKes - paymentModalPO.amountPaidKes}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalPO(null)}
                  className="px-3 py-1.5 text-xs rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                >
                  Confirm Supplier Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
