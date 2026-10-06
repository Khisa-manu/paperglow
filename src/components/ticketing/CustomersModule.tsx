import React, { useState } from 'react';
import {
  Search,
  Plus,
  Users,
  Building,
  Mail,
  Phone,
  Star,
  FileText,
  Clock,
  ArrowRight,
  X,
  MessageSquare,
} from 'lucide-react';
import { Customer, Ticket } from '../../types/ticketing';

interface CustomersModuleProps {
  customers: Customer[];
  tickets: Ticket[];
  onNavigateTicketDetail: (ticketId: string) => void;
  onAddCustomer: (newCust: Omit<Customer, 'id' | 'totalTickets' | 'openTickets' | 'satisfactionRating' | 'notes' | 'createdAt'>) => void;
  onAddCustomerNote: (customerId: string, noteText: string, authorName: string) => void;
}

export const CustomersModule: React.FC<CustomersModuleProps> = ({
  customers,
  tickets,
  onNavigateTicketDetail,
  onAddCustomer,
  onAddCustomerNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustTier, setNewCustTier] = useState<Customer['tier']>('Business Standard');

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.tier.toLowerCase().includes(q)
    );
  });

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerTickets = selectedCustomer
    ? tickets.filter((t) => t.customerId === selectedCustomer.id || t.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase())
    : [];

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail || !newCustCompany) return;
    onAddCustomer({
      name: newCustName,
      email: newCustEmail,
      phone: newCustPhone || '+254 700 000 000',
      company: newCustCompany,
      tier: newCustTier,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    });
    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustCompany('');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !newNoteText.trim()) return;
    onAddCustomerNote(selectedCustomerId, newNoteText, 'Wanjiku Kamau');
    setNewNoteText('');
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
            Customer Directory
          </h2>
          <p className="text-xs text-neutral-500">
            Client account dossiers, SLA tiers, satisfaction ratings, and complete ticket histories
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between text-xs">
        <div className="w-full sm:w-96 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, company, or email..."
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>
        <span className="text-neutral-500 hidden sm:inline">
          {filteredCustomers.length} customers registered
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-[#181c24] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
              <tr>
                <th className="py-3 px-4">Customer & Company</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">SLA Tier</th>
                <th className="py-3 px-3 text-center">Open Tickets</th>
                <th className="py-3 px-3 text-center">Total History</th>
                <th className="py-3 px-3 text-center">CSAT Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredCustomers.map((cust) => {
                const openCount = tickets.filter(
                  (t) => (t.customerId === cust.id || t.customerEmail === cust.email) && t.status !== 'resolved' && t.status !== 'closed'
                ).length;
                const totalCount = tickets.filter(
                  (t) => t.customerId === cust.id || t.customerEmail === cust.email
                ).length;

                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-[#181c24]/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {cust.name}
                          </p>
                          <p className="text-[11px] text-neutral-500">{cust.company}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="text-neutral-700 dark:text-neutral-300">{cust.email}</p>
                      <p className="text-[11px] text-neutral-400">{cust.phone}</p>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {cust.tier}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center tabular-nums">
                      {openCount > 0 ? (
                        <span className="font-bold text-red-600 dark:text-red-400">{openCount}</span>
                      ) : (
                        <span className="text-neutral-400">0</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center tabular-nums text-neutral-600 dark:text-neutral-400">
                      {totalCount}
                    </td>

                    <td className="py-3 px-3 text-center tabular-nums">
                      <span className="inline-flex items-center space-x-1 font-semibold text-amber-600 dark:text-amber-400">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{cust.satisfactionRating}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {selectedCustomer.company} · {selectedCustomer.tier}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Contact & Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-[#181c24] rounded">
                <span className="text-neutral-400 block text-[10px]">Email</span>
                <span className="font-medium text-neutral-900 dark:text-white truncate block">
                  {selectedCustomer.email}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-[#181c24] rounded">
                <span className="text-neutral-400 block text-[10px]">Phone</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {selectedCustomer.phone}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-[#181c24] rounded">
                <span className="text-neutral-400 block text-[10px]">Total Tickets</span>
                <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                  {customerTickets.length}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-[#181c24] rounded">
                <span className="text-neutral-400 block text-[10px]">Customer Rating</span>
                <span className="font-bold text-amber-500 tabular-nums">
                  {selectedCustomer.satisfactionRating} / 5.0
                </span>
              </div>
            </div>

            {/* Tickets by this Customer */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Support Ticket History ({customerTickets.length})
              </h4>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {customerTickets.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No tickets on record for this customer.
                  </div>
                ) : (
                  customerTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedCustomerId(null);
                        onNavigateTicketDetail(t.id);
                      }}
                      className="p-3 hover:bg-neutral-50 dark:hover:bg-[#181c24] transition-colors cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-red-600 dark:text-red-400">
                            {t.id}
                          </span>
                          <span className="text-neutral-400">·</span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {t.subject}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500">{t.categoryName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] px-2 py-0.5 rounded capitalize bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {t.status.replace('_', ' ')}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Account Notes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Internal Account Notes
              </h4>
              <div className="space-y-2">
                {selectedCustomer.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded text-xs"
                  >
                    <p className="text-amber-900 dark:text-amber-100 leading-relaxed">{n.content}</p>
                    <span className="text-[10px] text-amber-700/60 dark:text-amber-400/60 mt-1 block">
                      Added by {n.authorName} on {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add private note about this customer..."
                  className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded hover:opacity-90 disabled:opacity-40 cursor-pointer"
                >
                  Save Note
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Add New Customer Account
              </h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Samuel Kariuki"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={newCustCompany}
                  onChange={(e) => setNewCustCompany(e.target.value)}
                  placeholder="e.g. Rift Valley Distributing Ltd"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="samuel@riftvalleydist.co.ke"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+254 712 000 000"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">SLA Tier</label>
                <select
                  value={newCustTier}
                  onChange={(e) => setNewCustTier(e.target.value as Customer['tier'])}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                >
                  <option value="Enterprise VIP">Enterprise VIP (1h SLA)</option>
                  <option value="Business Standard">Business Standard (4h SLA)</option>
                  <option value="Growth">Growth (8h SLA)</option>
                  <option value="Starter">Starter (24h SLA)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
