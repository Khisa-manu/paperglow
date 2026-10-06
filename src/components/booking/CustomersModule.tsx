import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  X,
  CreditCard,
} from 'lucide-react';
import {
  BookingCustomer,
  BookingAppointment,
} from '../../types/booking';

interface CustomersModuleProps {
  customers: BookingCustomer[];
  appointments: BookingAppointment[];
  onAddCustomer: (newCust: Omit<BookingCustomer, 'id' | 'totalBookings' | 'totalSpentKes' | 'createdAt' | 'notes'>) => void;
  onAddCustomerNote: (customerId: string, noteText: string, authorName: string) => void;
  onSelectAppointment: (appointment: BookingAppointment) => void;
  onOpenCreateBookingForCustomer: (customerId: string) => void;
}

export const CustomersModule: React.FC<CustomersModuleProps> = ({
  customers,
  appointments,
  onAddCustomer,
  onAddCustomerNote,
  onSelectAppointment,
  onOpenCreateBookingForCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // New Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerAppointments = selectedCustomer
    ? appointments.filter((a) => a.customerId === selectedCustomer.id || a.customerPhone === selectedCustomer.phone)
    : [];

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAddCustomer({
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@client.paperglow.io`,
      address: address || 'Nairobi, Kenya',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80`,
    });

    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setIsAddModalOpen(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCustomer) return;
    onAddCustomerNote(selectedCustomer.id, newNoteText, 'Front Desk Staff');
    setNewNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Customer Dossiers &amp; Appointment History
          </h2>
          <p className="text-xs text-neutral-500">
            Client preferences, treatment notes, contact details, and lifetime spending in KES.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Customer Profile</span>
        </button>
      </div>

      {/* Split Grid: Customer Directory & Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Directory */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              const openCount = appointments.filter(
                (a) => (a.customerId === cust.id || a.customerPhone === cust.phone) && a.status === 'confirmed'
              ).length;

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900'
                      : 'bg-neutral-50/40 dark:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {cust.name}
                    </span>
                    {openCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        {openCount} active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{cust.phone}</div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2">
                    <span>{cust.totalBookings} visits</span>
                    <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      KES {cust.totalSpentKes.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 spans): Selected Customer Dossier */}
        {selectedCustomer ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold font-['Poppins'] flex items-center justify-center text-base border border-red-200 dark:border-red-900 shrink-0">
                    {selectedCustomer.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
                      {selectedCustomer.name}
                    </h3>
                    <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{selectedCustomer.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        <span>{selectedCustomer.email}</span>
                      </span>
                      {selectedCustomer.address && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{selectedCustomer.address}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenCreateBookingForCustomer(selectedCustomer.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Schedule Appointment
                </button>
              </div>

              {/* Quick Stat Chips */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Lifetime Visits</div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                    {selectedCustomer.totalBookings}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Total Spent</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
                    KES {selectedCustomer.totalSpentKes.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Registered Date</div>
                  <div className="text-xs font-mono text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment History List */}
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white font-['Poppins'] uppercase tracking-wider">
                Booking History ({customerAppointments.length})
              </h4>

              {customerAppointments.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400">
                  No appointment history records found for this client.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {customerAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => onSelectAppointment(apt)}
                      className="py-2.5 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                          <span>{apt.serviceName}</span>
                          <span className="text-[10px] font-mono text-neutral-400">({apt.id})</span>
                        </div>
                        <div className="text-neutral-500 text-[11px] mt-0.5">
                          {apt.date} at {apt.startTime} · Specialist: {apt.staffName}
                        </div>
                      </div>

                      <div className="text-right flex items-center space-x-3">
                        <div>
                          <div className="font-mono font-bold text-neutral-900 dark:text-white">
                            KES {apt.priceKes.toLocaleString()}
                          </div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400">
                            {apt.status}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Private Treatment / Service Notes */}
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white font-['Poppins'] uppercase tracking-wider">
                Specialist Notes &amp; Preferences
              </h4>

              <div className="space-y-2">
                {selectedCustomer.notes.length === 0 ? (
                  <p className="text-xs text-neutral-400">
                    No private preferences or allergy notes recorded yet.
                  </p>
                ) : (
                  selectedCustomer.notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {n.authorName}
                        </span>
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300">{n.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="pt-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add private note (e.g. style preference, skin sensitivity)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  Add Note
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Create New Customer Profile
            </h3>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Christine Wangari"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number (M-Pesa Ready) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="christine@example.co.ke"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Residential Area / Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Kilimani, Nairobi"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
