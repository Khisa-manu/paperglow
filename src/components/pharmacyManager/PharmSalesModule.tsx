import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  X,
  CreditCard,
  User,
  Trash2,
  FileText,
  AlertTriangle,
  Pill,
  Sparkles,
} from 'lucide-react';
import {
  MedicineProduct,
  SaleTransaction,
  SaleLineItem,
  PharmacyCustomer,
  PaymentMethod,
  PharmacySettings,
} from '../../types/pharmacyManager';
import { PharmReceiptModal } from './PharmReceiptModal';

interface PharmSalesModuleProps {
  medicines: MedicineProduct[];
  sales: SaleTransaction[];
  customers: PharmacyCustomer[];
  settings: PharmacySettings;
  onRecordSale: (sale: Omit<SaleTransaction, 'id' | 'receiptNumber'>) => void;
}

export const PharmSalesModule: React.FC<PharmSalesModuleProps> = ({
  medicines,
  sales,
  customers,
  settings,
  onRecordSale,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<SaleTransaction | null>(null);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);

  // New Sale Form State
  const [cartItems, setCartItems] = useState<SaleLineItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customCustomerName, setCustomCustomerName] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [prescriber, setPrescriber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [mpesaRef, setMpesaRef] = useState<string>('SL829104LA');
  const [discountKes, setDiscountKes] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [dispensedBy, setDispensedBy] = useState<string>('Timothy Kiprono (Pharm Tech)');

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  // Filtered medicines for quick POS search
  const filteredCatalog = medicines.filter(
    (m) =>
      m.quantityInStock > 0 &&
      (m.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        m.genericName.toLowerCase().includes(productSearch.toLowerCase()) ||
        m.skuBarcode.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const handleAddToCart = (product: MedicineProduct) => {
    const existingIndex = cartItems.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      if (updated[existingIndex].quantity < product.quantityInStock) {
        updated[existingIndex].quantity += 1;
        updated[existingIndex].totalPriceKes =
          updated[existingIndex].quantity * updated[existingIndex].unitPriceKes;
        setCartItems(updated);
      }
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product.id,
          productName: product.name,
          batchNumber: product.batchNumber,
          quantity: 1,
          unitPriceKes: product.sellingPriceKes,
          totalPriceKes: product.sellingPriceKes,
          dosageInstructions: '',
        },
      ]);
    }
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    const product = medicines.find((m) => m.id === productId);
    if (!product) return;

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > product.quantityInStock) return item;
            return {
              ...item,
              quantity: newQty,
              totalPriceKes: newQty * item.unitPriceKes,
            };
          }
          return item;
        })
        .filter((item): item is SaleLineItem => item !== null)
    );
  };

  const handleUpdateDosage = (productId: string, dosage: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, dosageInstructions: dosage } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleSelectCustomer = (cId: string) => {
    setSelectedCustomerId(cId);
    if (cId) {
      const c = customers.find((cust) => cust.id === cId);
      if (c) {
        setCustomCustomerName(c.name);
        setCustomerPhone(c.phone);
      }
    } else {
      setCustomCustomerName('Walk-in Customer');
      setCustomerPhone('');
    }
  };

  const subtotalKes = cartItems.reduce((sum, item) => sum + item.totalPriceKes, 0);
  const totalAmountKes = Math.max(0, subtotalKes - discountKes);

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newSaleData: Omit<SaleTransaction, 'id' | 'receiptNumber'> = {
      customerId: selectedCustomerId || undefined,
      customerName: customCustomerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim() || undefined,
      doctorPrescriber: prescriber.trim() || undefined,
      items: cartItems,
      subtotalKes,
      discountKes,
      totalAmountKes,
      paymentMethod,
      paymentStatus: 'paid',
      mpesaRef: paymentMethod === 'mpesa' ? mpesaRef : undefined,
      dispensedBy,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: notes.trim() || undefined,
    };

    onRecordSale(newSaleData);

    // Reset & close
    setCartItems([]);
    setSelectedCustomerId('');
    setCustomCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setPrescriber('');
    setDiscountKes(0);
    setNotes('');
    setIsNewSaleOpen(false);
  };

  // Filter completed sales for history table
  const filteredSales = sales.filter(
    (s) =>
      s.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.mpesaRef && s.mpesaRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.items.some((item) => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            <span>Sales &amp; Dispensing Counter</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Process patient transactions, OTC sales, M-Pesa reconciliations, and generate printable receipts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Sale / Dispense</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Today's Transactions</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {sales.filter((s) => s.timestamp.startsWith('2026-10-05')).length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" /> All reconciled
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">M-Pesa Revenue Share</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {Math.round(
              (sales
                .filter((s) => s.paymentMethod === 'mpesa')
                .reduce((acc, curr) => acc + curr.totalAmountKes, 0) /
                Math.max(1, sales.reduce((acc, curr) => acc + curr.totalAmountKes, 0))) *
                100
            )}
            %
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Till: {settings.mpesaTillPaybill}</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Average Dispense Value</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-red-600 dark:text-red-400">
            {formatKes(
              sales.length > 0
                ? Math.round(sales.reduce((sum, s) => sum + s.totalAmountKes, 0) / sales.length)
                : 0
            )}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Per patient visit</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#11141a] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by receipt #, customer, medicine name, or M-Pesa ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>
        <div className="text-xs text-neutral-500">
          Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{filteredSales.length}</span> receipts
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Customer / Patient</th>
                <th className="py-3 px-4">Medicines Dispensed</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">M-Pesa Ref</th>
                <th className="py-3 px-4 text-right">Amount (KES)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-red-600 dark:text-red-400">
                    {sale.receiptNumber}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    {sale.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{sale.customerName}</div>
                    {sale.customerPhone && (
                      <div className="text-[11px] text-neutral-500 font-mono">{sale.customerPhone}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="truncate text-neutral-700 dark:text-neutral-300">
                      {sale.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                    </div>
                    <div className="text-[10px] text-neutral-400">{sale.items.length} items</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        sale.paymentMethod === 'mpesa'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : sale.paymentMethod === 'cash'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : sale.paymentMethod === 'card'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                    {sale.mpesaRef || '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {formatKes(sale.totalAmountKes)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedReceipt(sale)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 cursor-pointer transition-colors"
                      title="View & Print Official Receipt"
                    >
                      <Printer className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                    No matching sales records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POS / New Sale Modal */}
      {isNewSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                    Dispensary Point of Sale (POS)
                  </h3>
                  <p className="text-xs text-neutral-500">Dispense medicines &amp; collect payment</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewSaleOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSale} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Product Selector & Patient Information */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Customer / Patient Selection */}
                  <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-red-600" />
                      <span>Patient / Customer Profile</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-1">Select Registered Patient</label>
                        <select
                          value={selectedCustomerId}
                          onChange={(e) => handleSelectCustomer(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option value="">Walk-in Customer (Unregistered)</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.phone})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-1">Customer Name</label>
                        <input
                          type="text"
                          value={customCustomerName}
                          onChange={(e) => setCustomCustomerName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                          placeholder="e.g. John Kamau"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-1">Customer Phone (M-Pesa SMS)</label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                          placeholder="e.g. +254 7..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-1">Prescribing Doctor (Optional)</label>
                        <input
                          type="text"
                          value={prescriber}
                          onChange={(e) => setPrescriber(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                          placeholder="e.g. Dr. Omondi (Aga Khan)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medicine Search & Quick Add */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Search &amp; Add Medicines to Cart
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Type medicine name (e.g. Augmentin, Panadol, Coartem, Ventolin)..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    {/* Filtered Medicine List */}
                    <div className="max-h-52 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-[#11141a]">
                      {filteredCatalog.slice(0, 6).map((med) => (
                        <div
                          key={med.id}
                          className="p-2.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                                {med.name}
                              </span>
                              {med.requiresPrescription && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                                  Rx ONLY
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {med.genericName} • Batch: <span className="font-mono">{med.batchNumber}</span> • In
                              Stock: <span className="font-bold text-neutral-700 dark:text-neutral-300">{med.quantityInStock}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">
                              {formatKes(med.sellingPriceKes)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(med)}
                              className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredCatalog.length === 0 && (
                        <div className="p-4 text-center text-xs text-neutral-400">
                          No matching in-stock medicines found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Dispensing Basket & Payment Reconciliation */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
                        Dispensary Basket ({cartItems.length} items)
                      </span>
                      {cartItems.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setCartItems([])}
                          className="text-[11px] text-red-600 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Cart Items List */}
                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="p-2.5 rounded-lg bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 shadow-2xs"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100">{item.productName}</div>
                              <div className="text-[10px] text-neutral-400 font-mono">
                                @ {item.unitPriceKes.toLocaleString()} KES
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-neutral-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Dosage instructions field */}
                          <div>
                            <input
                              type="text"
                              placeholder="Dosage advice (e.g. 1 tab 3x daily after meals)"
                              value={item.dosageInstructions || ''}
                              onChange={(e) => handleUpdateDosage(item.productId, e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateCartQty(item.productId, -1)}
                                className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-mono font-semibold px-2">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateCartQty(item.productId, 1)}
                                className="w-5 h-5 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                              {formatKes(item.totalPriceKes)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {cartItems.length === 0 && (
                        <div className="py-8 text-center text-xs text-neutral-400">
                          Basket is empty. Select medicines from the left to start dispensing.
                        </div>
                      )}
                    </div>

                    {/* Payment Channel & Discounts */}
                    <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div>
                        <label className="block text-[11px] text-neutral-500 mb-1">Payment Method</label>
                        <div className="grid grid-cols-4 gap-1">
                          {(['mpesa', 'cash', 'card', 'insurance'] as PaymentMethod[]).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-1.5 text-[11px] font-semibold uppercase rounded-md border text-center transition-colors cursor-pointer ${
                                paymentMethod === method
                                  ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      {paymentMethod === 'mpesa' && (
                        <div>
                          <label className="block text-[11px] text-neutral-500 mb-1">
                            Safaricom M-Pesa Transaction Code
                          </label>
                          <input
                            type="text"
                            value={mpesaRef}
                            onChange={(e) => setMpesaRef(e.target.value)}
                            placeholder="e.g. QK891294LA"
                            className="w-full px-2.5 py-1 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600 uppercase"
                            required
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-[11px] text-neutral-500 mb-1">Discount (KES)</label>
                          <input
                            type="number"
                            min="0"
                            max={subtotalKes}
                            value={discountKes}
                            onChange={(e) => setDiscountKes(Number(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[11px] text-neutral-500 mb-1">Dispensing Staff</label>
                          <input
                            type="text"
                            value={dispensedBy}
                            onChange={(e) => setDispensedBy(e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Totals & Submit */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Subtotal</span>
                      <span>{formatKes(subtotalKes)}</span>
                    </div>
                    {discountKes > 0 && (
                      <div className="flex justify-between text-xs text-emerald-600">
                        <span>Discount</span>
                        <span>-{formatKes(discountKes)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Total Due</span>
                      <span className="font-bold text-lg font-mono text-red-600 dark:text-red-400">
                        {formatKes(totalAmountKes)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={cartItems.length === 0}
                      className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
                    >
                      Complete Sale &amp; Issue Receipt
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Printable Preview Modal */}
      <PharmReceiptModal
        sale={selectedReceipt}
        settings={settings}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
