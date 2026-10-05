import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  X,
  UserCheck,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import {
  PharmacyCustomer,
  SaleTransaction,
  PharmacySettings,
} from '../../types/pharmacyManager';
import { PharmReceiptModal } from './PharmReceiptModal';

interface PharmCustomersModuleProps {
  customers: PharmacyCustomer[];
  sales: SaleTransaction[];
  settings: PharmacySettings;
  onAddCustomer: (customer: Omit<PharmacyCustomer, 'id' | 'totalSpendKes' | 'lastVisitDate'>) => void;
  onUpdateCustomer: (customer: PharmacyCustomer) => void;
}

export const PharmCustomersModule: React.FC<PharmCustomersModuleProps> = ({
  customers,
  sales,
  settings,
  onAddCustomer,
  onUpdateCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<PharmacyCustomer | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<SaleTransaction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<PharmacyCustomer | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [ageOrDob, setAgeOrDob] = useState('38 yrs');
  const [chronicCondition, setChronicCondition] = useState('');
  const [knownAllergies, setKnownAllergies] = useState('');
  const [notes, setNotes] = useState('');

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.chronicCondition && c.chronicCondition.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.knownAllergies && c.knownAllergies.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('+254 7');
    setEmail('');
    setAgeOrDob('38 yrs');
    setChronicCondition('');
    setKnownAllergies('');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (customer: PharmacyCustomer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email || '');
    setAgeOrDob(customer.ageOrDob || '');
    setChronicCondition(customer.chronicCondition || '');
    setKnownAllergies(customer.knownAllergies || '');
    setNotes(customer.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        ageOrDob: ageOrDob.trim() || undefined,
        chronicCondition: chronicCondition.trim() || undefined,
        knownAllergies: knownAllergies.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      onAddCustomer({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        ageOrDob: ageOrDob.trim() || undefined,
        chronicCondition: chronicCondition.trim() || undefined,
        knownAllergies: knownAllergies.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    setIsAddModalOpen(false);
  };

  // Get customer's sales transactions
  const customerSales = selectedCustomer
    ? sales.filter(
        (s) =>
          s.customerId === selectedCustomer.id ||
          (s.customerPhone && s.customerPhone === selectedCustomer.phone) ||
          s.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Patients &amp; Customers Directory</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Maintain patient dispensing records, manage chronic prescription refills, and monitor safety allergies.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Registered Patients</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {customers.length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">With dispensing history profiles</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Chronic Refill Enrollees</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-red-600 dark:text-red-400">
            {customers.filter((c) => !!c.chronicCondition).length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Hypertension, Diabetes, Asthma</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Documented Drug Allergies</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-amber-600 dark:text-amber-400">
            {customers.filter((c) => !!c.knownAllergies).length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Safety alerts for dispensers</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#11141a] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient name, phone, condition or allergy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>
        <div className="text-xs text-neutral-500">
          {filteredCustomers.length} patients found
        </div>
      </div>

      {/* Customer Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{cust.name}</h4>
                <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-0.5">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  <span>{cust.phone}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {cust.ageOrDob || 'Adult'}
              </span>
            </div>

            {/* Badges: Chronic Condition & Allergies */}
            <div className="flex flex-wrap gap-1.5">
              {cust.chronicCondition && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  {cust.chronicCondition}
                </span>
              )}
              {cust.knownAllergies && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  Allergy: {cust.knownAllergies}
                </span>
              )}
            </div>

            {/* Spend & Visit metadata */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block">Total Dispensary Spend</span>
                <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  {formatKes(cust.totalSpendKes)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Last Visit</span>
                <span className="text-neutral-600 dark:text-neutral-400 text-[11px]">{cust.lastVisitDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCustomer(cust)}
                className="flex-1 py-1.5 text-xs font-semibold rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer text-center"
              >
                Dispensary History
              </button>
              <button
                onClick={() => handleOpenEdit(cust)}
                className="px-3 py-1.5 text-xs font-medium rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Dispensary History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Patient Profile: {selectedCustomer.name}
                </h3>
                <p className="text-xs text-neutral-500">Phone: {selectedCustomer.phone} • Age: {selectedCustomer.ageOrDob}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drug Safety Caution Alert */}
            {selectedCustomer.knownAllergies && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center space-x-2 text-xs text-red-800 dark:text-red-300">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  <strong>Safety Alert:</strong> Patient has recorded allergy to{' '}
                  <span className="font-semibold underline">{selectedCustomer.knownAllergies}</span>. Check cross-sensitivities before dispensing.
                </span>
              </div>
            )}

            {/* Past Receipts */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Past Prescriptions &amp; Receipts ({customerSales.length})
              </h4>

              <div className="max-h-64 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800">
                {customerSales.map((sale) => (
                  <div key={sale.id} className="p-3 text-xs flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-red-600">{sale.receiptNumber}</span>
                        <span className="text-neutral-400">• {sale.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1">
                        {sale.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {formatKes(sale.totalAmountKes)}
                      </span>
                      <button
                        onClick={() => setSelectedReceipt(sale)}
                        className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-[11px] hover:bg-neutral-200 cursor-pointer"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
                {customerSales.length === 0 && (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No transactions found for this customer profile.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                <span>{editingCustomer ? 'Edit Patient Profile' : 'Register New Patient Profile'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Margaret Wambui"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Mobile Phone
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
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@gmail.com"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Age / DOB
                  </label>
                  <input
                    type="text"
                    value={ageOrDob}
                    onChange={(e) => setAgeOrDob(e.target.value)}
                    placeholder="e.g. 45 yrs"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Chronic Condition (Refill Tracking)
                </label>
                <input
                  type="text"
                  value={chronicCondition}
                  onChange={(e) => setChronicCondition(e.target.value)}
                  placeholder="e.g. Essential Hypertension, Type 2 Diabetes, Asthma"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Known Drug Allergies (Dispensing Safety)
                </label>
                <input
                  type="text"
                  value={knownAllergies}
                  onChange={(e) => setKnownAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa antibiotics, NSAIDs"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Additional patient dispensary notes or family member collection authorization..."
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
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shadow-xs"
                >
                  {editingCustomer ? 'Save Profile' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <PharmReceiptModal
        sale={selectedReceipt}
        settings={settings}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
