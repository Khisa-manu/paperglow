import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Package,
  ShoppingCart,
  CheckCircle2,
  X,
  CreditCard,
} from 'lucide-react';
import {
  Supplier,
  InventoryProduct,
  PurchaseOrder,
} from '../../types/stockInventory';

interface SuppliersModuleProps {
  suppliers: Supplier[];
  products: InventoryProduct[];
  purchases: PurchaseOrder[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'outstandingBalanceKes' | 'totalPurchasesKes'>) => void;
}

export const SuppliersModule: React.FC<SuppliersModuleProps> = ({
  suppliers,
  products,
  purchases,
  onAddSupplier,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(suppliers[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days');

  const filteredSuppliers = suppliers.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    );
  });

  const selectedSupplier =
    suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

  const suppliedProducts = selectedSupplier
    ? products.filter((p) => p.supplierId === selectedSupplier.id)
    : [];

  const supplierPurchases = selectedSupplier
    ? purchases.filter((po) => po.supplierId === selectedSupplier.id)
    : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSupplier({
      name,
      contactPerson,
      email,
      phone,
      address,
      city,
      suppliedCategoryIds: [],
      paymentTerms,
    });

    setIsAddModalOpen(false);
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Vendor &amp; Supplier Management
          </h2>
          <p className="text-xs text-neutral-500">
            Maintain authorized supplier contacts, catalog items supplied, purchase order logs, and payables balances in KES.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Two Column Layout: Suppliers List and Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            {filteredSuppliers.map((sup) => {
              const isSelected = selectedSupplier?.id === sup.id;
              return (
                <div
                  key={sup.id}
                  onClick={() => setSelectedSupplierId(sup.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-red-600 bg-red-50/40 dark:bg-red-950/20 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-white">
                        {sup.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500">{sup.contactPerson}</p>
                    </div>
                    {sup.outstandingBalanceKes > 0 ? (
                      <span className="text-[10px] font-mono font-bold text-red-600 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                        KES {sup.outstandingBalanceKes.toLocaleString()} due
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600">
                        Paid up
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{sup.phone}</span>
                    </span>
                    <span>{sup.city}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Dossier */}
        <div className="lg:col-span-2">
          {selectedSupplier ? (
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-6">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-red-600" />
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
                      {selectedSupplier.name}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Authorized Commercial Wholesaler &amp; Stock Distributor
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-500">Outstanding Balance</div>
                  <div className="text-base font-bold font-mono text-red-600">
                    KES {selectedSupplier.outstandingBalanceKes.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Contact Person</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedSupplier.contactPerson}
                  </div>
                  <div className="text-neutral-500 text-[11px]">{selectedSupplier.phone}</div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Billing Address</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedSupplier.address}
                  </div>
                  <div className="text-neutral-500 text-[11px]">{selectedSupplier.city}, Kenya</div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Credit Terms</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedSupplier.paymentTerms}
                  </div>
                  <div className="text-emerald-600 text-[11px] font-mono">
                    Lifetime: KES {selectedSupplier.totalPurchasesKes.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Products Supplied Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-['Poppins']">
                  Products Supplied by this Vendor ({suppliedProducts.length})
                </h4>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">Current Stock</th>
                        <th className="py-2.5 px-3 text-right">Buying Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {suppliedProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2 px-3 font-medium text-neutral-900 dark:text-white">
                            {p.name}
                          </td>
                          <td className="py-2 px-3 font-mono">{p.sku}</td>
                          <td className="py-2 px-3 font-mono">
                            {p.currentQuantity} {p.unit}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-semibold">
                            KES {p.buyingPriceKes.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Purchase History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-['Poppins']">
                  Purchase Order History ({supplierPurchases.length})
                </h4>

                <div className="space-y-2">
                  {supplierPurchases.map((po) => (
                    <div
                      key={po.id}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-neutral-900 dark:text-white">
                            {po.poNumber}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-neutral-100 dark:bg-neutral-800">
                            {po.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Ordered on {po.orderDate} • {po.items.length} item(s)
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-neutral-900 dark:text-white">
                        KES {po.totalAmountKes.toLocaleString()}
                      </div>
                    </div>
                  ))}

                  {supplierPurchases.length === 0 && (
                    <p className="text-xs text-neutral-400">No purchase order history recorded yet for this supplier.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              Select a supplier on the left to view profile and catalog.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Supplier */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Add New Supplier Vendor
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Supplier Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Electrical Distributors Ltd"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Kenneth Otieno"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712..."
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@vendor.co.ke"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot 48, Lusaka Road"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  <option value="Payment on Delivery">Payment on Delivery</option>
                  <option value="Net 14 Days">Net 14 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Advance Payment">Advance Payment</option>
                </select>
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
