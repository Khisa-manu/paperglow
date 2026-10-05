import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  X,
  CreditCard,
  Package,
  Layers,
} from 'lucide-react';
import {
  PharmacySupplier,
  PurchaseOrder,
} from '../../types/pharmacyManager';

interface PharmSuppliersModuleProps {
  suppliers: PharmacySupplier[];
  purchaseOrders: PurchaseOrder[];
  onAddSupplier: (supplier: Omit<PharmacySupplier, 'id' | 'outstandingBalanceKes'>) => void;
  onPaySupplierBalance: (supplierId: string, amount: number) => void;
}

export const PharmSuppliersModule: React.FC<PharmSuppliersModuleProps> = ({
  suppliers,
  purchaseOrders,
  onAddSupplier,
  onPaySupplierBalance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<PharmacySupplier | null>(null);
  const [payModalSupplier, setPayModalSupplier] = useState<PharmacySupplier | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);

  // New Supplier Form
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [leadTimeDays, setLeadTimeDays] = useState(3);
  const [categories, setCategories] = useState('Antibiotics, Analgesics, Cold Chain Vaccines');

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    onAddSupplier({
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      leadTimeDays: Number(leadTimeDays) || 3,
      categoriesSupplied: categories.split(',').map((c) => c.trim()),
    });

    setIsAddModalOpen(false);
    setCompanyName('');
    setContactPerson('');
    setPhone('+254 7');
    setEmail('');
    setAddress('');
  };

  const handleOpenPay = (supplier: PharmacySupplier) => {
    setPayModalSupplier(supplier);
    setPayAmount(supplier.outstandingBalanceKes);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalSupplier || payAmount <= 0) return;
    onPaySupplierBalance(payModalSupplier.id, payAmount);
    setPayModalSupplier(null);
  };

  const supplierPOs = selectedSupplier
    ? purchaseOrders.filter((po) => po.supplierId === selectedSupplier.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-600" />
            <span>Pharmaceutical Suppliers &amp; Wholesalers</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage pharmaceutical distributor accounts, credit facilities, lead times, and accounts payable balances.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Active Distributors</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {suppliers.length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Authorized PPB Wholesalers</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Total Outstanding Payables</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-red-600 dark:text-red-400">
            {formatKes(suppliers.reduce((sum, s) => sum + s.outstandingBalanceKes, 0))}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">30-day wholesale credit accounts</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Average Restock Lead Time</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {Math.round(suppliers.reduce((sum, s) => sum + s.leadTimeDays, 0) / Math.max(1, suppliers.length))} days
          </div>
          <div className="mt-1 text-[11px] text-emerald-600">Same-day delivery from Nairobi Industrial Area</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#11141a] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search distributor name, contact person, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>
        <div className="text-xs text-neutral-500">
          {filteredSuppliers.length} distributors registered
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{sup.companyName}</h4>
                <div className="text-xs text-neutral-500">Contact: {sup.contactPerson}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {sup.leadTimeDays}d Lead Time
              </span>
            </div>

            <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-mono text-[11px]">{sup.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[11px] truncate">{sup.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="text-[11px] truncate">{sup.address}</span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1">
              {sup.categoriesSupplied.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Balance & Action */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block">Payable Balance</span>
                <span
                  className={`font-mono font-bold text-xs ${
                    sup.outstandingBalanceKes > 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {formatKes(sup.outstandingBalanceKes)}
                </span>
              </div>

              <div className="flex space-x-1.5">
                {sup.outstandingBalanceKes > 0 && (
                  <button
                    onClick={() => handleOpenPay(sup)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Pay
                  </button>
                )}
                <button
                  onClick={() => setSelectedSupplier(sup)}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Orders
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Order History Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  {selectedSupplier.companyName}
                </h3>
                <p className="text-xs text-neutral-500">
                  Outstanding Balance: <span className="font-mono font-bold text-red-600">{formatKes(selectedSupplier.outstandingBalanceKes)}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">
                Purchase Orders Placed ({supplierPOs.length})
              </h4>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-3">PO Number</th>
                      <th className="py-2 px-3">Order Date</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {supplierPOs.map((po) => (
                      <tr key={po.id}>
                        <td className="py-2 px-3 font-mono font-bold text-red-600">{po.poNumber}</td>
                        <td className="py-2 px-3 text-neutral-500">{po.orderDate}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              po.status === 'received' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold">{formatKes(po.totalCostKes)}</td>
                      </tr>
                    ))}
                    {supplierPOs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-neutral-400 text-xs">
                          No purchase orders recorded for this supplier.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Supplier Balance Modal */}
      {payModalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Settle Payables: {payModalSupplier.companyName}</span>
              </h3>
              <button
                onClick={() => setPayModalSupplier(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPay} className="space-y-3">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Current Outstanding Balance:</span>
                  <span className="font-mono font-bold text-red-600">{formatKes(payModalSupplier.outstandingBalanceKes)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Amount (KES)
                </label>
                <input
                  type="number"
                  min="100"
                  max={payModalSupplier.outstandingBalanceKes}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayModalSupplier(null)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Supplier Remittance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                <span>Add Pharmaceutical Distributor</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Company / Distributor Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Harleys Ltd Kenya"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Samuel Mutiso"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@harleys.co.ke"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(Number(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Warehouse Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Harleys Complex, Enterprise Road, Industrial Area Nairobi"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Medicine Lines Supplied (Comma-separated)
                </label>
                <input
                  type="text"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="e.g. Antibiotics, Analgesics, Antimalarials"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
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
