import React, { useState, useMemo } from 'react';
import { Customer, SalesDocument, BusinessOrder, CustomerNote } from '../../types/businessManager';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Edit,
  Trash2,
  X,
  MessageSquare,
  Building,
  Receipt,
} from 'lucide-react';

interface CustomersModuleProps {
  customers: Customer[];
  documents: SalesDocument[];
  orders: BusinessOrder[];
  currencySymbol: string;
  onSaveCustomer: (cust: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onAddNote: (customerId: string, noteText: string) => void;
  onSelectForMessage?: (cust: Customer) => void;
}

export const CustomersModule: React.FC<CustomersModuleProps> = ({
  customers,
  documents,
  orders,
  currencySymbol,
  onSaveCustomer,
  onDeleteCustomer,
  onAddNote,
  onSelectForMessage,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState<Customer | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [kraPin, setKraPin] = useState('');

  // Note entry field in drawer
  const [newNote, setNewNote] = useState('');

  const handleOpenCreate = () => {
    setEditingCust(null);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('+254 ');
    setAddress('');
    setCity('Nairobi');
    setKraPin('P05');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    setEditingCust(cust);
    setName(cust.name);
    setCompany(cust.company);
    setEmail(cust.email);
    setPhone(cust.phone);
    setAddress(cust.address);
    setCity(cust.city);
    setKraPin(cust.kraPin);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: editingCust?.id || `cust-${Date.now()}`,
      name,
      company,
      email,
      phone,
      address,
      city,
      kraPin,
      outstandingBalance: editingCust?.outstandingBalance || 0,
      totalSpent: editingCust?.totalSpent || 0,
      notes: editingCust?.notes || [],
      createdAt: editingCust?.createdAt || '2026-03-31',
    };
    onSaveCustomer(customer);
    setIsModalOpen(false);
  };

  const handleAddCustomerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;
    onAddNote(selectedCustomer.id, newNote.trim());
    setNewNote('');
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.kraPin.toLowerCase().includes(q)
      );
    });
  }, [customers, search]);

  const activeCustomerDocs = useMemo(() => {
    if (!selectedCustomer) return [];
    return documents.filter((d) => d.customerId === selectedCustomer.id);
  }, [selectedCustomer, documents]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, company, email, PIN..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Customer Profile</span>
        </button>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const hasBalance = cust.outstandingBalance > 0;
          return (
            <div
              key={cust.id}
              className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-red-500/50 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {cust.name}
                    </h3>
                    <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-neutral-400" />
                      <span>{cust.company}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                        hasBalance
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}
                    >
                      {hasBalance ? 'Balance Due' : 'Account Cleared'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{cust.address}</span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500">
                    KRA PIN: {cust.kraPin || 'Not Provided'}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">Total Purchases</div>
                    <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {currencySymbol} {cust.totalSpent.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">Outstanding</div>
                    <div
                      className={`font-mono font-bold tabular-nums ${
                        hasBalance ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'
                      }`}
                    >
                      {currencySymbol} {cust.outstandingBalance.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-red-600 inline-flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> Dossier &amp; Notes ({cust.notes?.length || 0})
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cust)}
                    className="p-1 text-neutral-400 hover:text-blue-600 rounded-sm"
                    title="Edit Customer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(cust.id)}
                    className="p-1 text-neutral-400 hover:text-red-600 rounded-sm"
                    title="Delete Customer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Full Dossier Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 text-xs max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedCustomer.name}
                </h3>
                <p className="text-neutral-500">{selectedCustomer.company} · KRA PIN: {selectedCustomer.kraPin}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5">
              {/* Purchase History */}
              <div>
                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-red-600" />
                  <span>Document &amp; Invoicing History</span>
                </h4>
                {activeCustomerDocs.length === 0 ? (
                  <p className="text-neutral-500 py-2">No invoices or receipts issued yet to this client.</p>
                ) : (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-md divide-y divide-neutral-100 dark:divide-neutral-800">
                    {activeCustomerDocs.map((doc) => (
                      <div key={doc.id} className="p-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                            {doc.documentNumber} ({doc.documentType})
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            Issued: {doc.issueDate} · Due: {doc.dueDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                            {currencySymbol} {doc.grandTotal.toLocaleString()}
                          </div>
                          <span className="text-[10px] uppercase font-bold text-red-600">
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Notes CRM */}
              <div>
                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-neutral-600" />
                  <span>Internal Staff Notes &amp; Account History</span>
                </h4>

                <div className="space-y-2 mb-3">
                  {selectedCustomer.notes?.map((n) => (
                    <div key={n.id} className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                      <p className="text-neutral-800 dark:text-neutral-200">{n.content}</p>
                      <div className="mt-1 text-[10px] text-neutral-400 flex items-center justify-between">
                        <span>{n.author}</span>
                        <span>{n.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddCustomerNote} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log a client preference, meeting note, or follow-up..."
                    className="flex-1 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold rounded-md shadow-xs"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingCust ? 'Edit Customer' : 'Add New Customer Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Contact Person Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Physical Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">KRA PIN Number</label>
                  <input
                    type="text"
                    required
                    value={kraPin}
                    onChange={(e) => setKraPin(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
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
