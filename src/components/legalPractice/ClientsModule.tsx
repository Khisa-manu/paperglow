import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  CreditCard,
  Briefcase,
  X,
  CheckCircle2,
  FileText,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import {
  LegalClient,
  LegalMatter,
  ClientType,
} from '../../types/legalPractice';

interface ClientsModuleProps {
  clients: LegalClient[];
  matters: LegalMatter[];
  onAddClient: (clientData: Omit<LegalClient, 'id' | 'clientNumber' | 'totalBilledKes' | 'outstandingBalanceKes' | 'createdAt'>) => void;
  onSelectClientMatters: (clientId: string) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clients,
  matters,
  onAddClient,
  onSelectClientMatters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<LegalClient | null>(clients[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [clientType, setClientType] = useState<ClientType>('Company / Corporate');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idOrRegNumber, setIdOrRegNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [notes, setNotes] = useState('');

  const filteredClients = clients.filter((c) => {
    if (typeFilter !== 'all' && c.clientType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.clientNumber.toLowerCase().includes(q) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
        c.email.toLowerCase().includes(q) ||
        c.idOrRegNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const clientMatters = selectedClient
    ? matters.filter((m) => m.clientId === selectedClient.id)
    : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddClient({
      name,
      clientType,
      contactPerson,
      email,
      phone,
      idOrRegNumber,
      address,
      city,
      notes,
    });

    setIsAddModalOpen(false);
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setIdOrRegNumber('');
    setAddress('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Client Directory &amp; Confidential Dossiers
          </h2>
          <p className="text-xs text-neutral-500">
            Maintain institutional retainers, corporate entities, and private individuals with active matters, KRA PIN records, and billing ledger.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Two-Column Layout: Clients List and Selected Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Directory List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="Company / Corporate">Corporate</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredClients.map((c) => {
              const isSelected = selectedClient?.id === c.id;
              const mattersCount = matters.filter((m) => m.clientId === c.id).length;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-red-600 bg-red-50/40 dark:bg-red-950/20 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-neutral-400">
                          {c.clientNumber}
                        </span>
                        <span className="text-[10px] font-medium text-neutral-500">
                          {c.clientType === 'Company / Corporate' ? 'Corporate' : 'Individual'}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-white mt-0.5">
                        {c.name}
                      </h3>
                      {c.contactPerson && (
                        <p className="text-[11px] text-neutral-500">Attn: {c.contactPerson}</p>
                      )}
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {mattersCount} Matter{mattersCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{c.phone}</span>
                    </span>
                    {c.outstandingBalanceKes > 0 ? (
                      <span className="text-red-600 font-bold font-mono text-[10px]">
                        KES {c.outstandingBalanceKes.toLocaleString()} due
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold text-[10px]">Settled</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Client Dossier */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-6">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                      {selectedClient.clientNumber}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      {selectedClient.clientType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1 font-['Poppins']">
                    {selectedClient.name}
                  </h3>
                  <p className="text-xs text-neutral-500">{selectedClient.idOrRegNumber}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-500">Outstanding Receivable</div>
                  <div className="text-base font-bold font-mono text-red-600">
                    KES {selectedClient.outstandingBalanceKes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Lifetime: KES {selectedClient.totalBilledKes.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Contact Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Contact Person</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedClient.contactPerson || 'Direct'}
                  </div>
                  <div className="text-neutral-500 text-[11px]">{selectedClient.phone}</div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Official Email</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    {selectedClient.email}
                  </div>
                  <div className="text-neutral-500 text-[11px]">Primary notifications</div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Physical Address</span>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    {selectedClient.address}
                  </div>
                  <div className="text-neutral-500 text-[11px]">{selectedClient.city}, Kenya</div>
                </div>
              </div>

              {/* Private Notes */}
              {selectedClient.notes && (
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Confidential Client Notes</span>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {selectedClient.notes}
                  </p>
                </div>
              )}

              {/* Linked Matters Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-['Poppins']">
                    Linked Legal Matters ({clientMatters.length})
                  </h4>
                  <button
                    onClick={() => onSelectClientMatters(selectedClient.id)}
                    className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    Manage in Matters Registry →
                  </button>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Matter No</th>
                        <th className="py-2.5 px-3">Matter Title</th>
                        <th className="py-2.5 px-3">Advocate</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Balance Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {clientMatters.map((m) => (
                        <tr key={m.id}>
                          <td className="py-2.5 px-3 font-mono font-bold text-red-600">
                            {m.matterNumber}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-neutral-900 dark:text-white max-w-xs truncate">
                            {m.title}
                          </td>
                          <td className="py-2.5 px-3">{m.assignedAdvocateName}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                              {m.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                            KES {m.outstandingBalanceKes.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {clientMatters.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-xs text-neutral-500">
                            No active matters currently registered for this client.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl">
              Select a client to view dossier details.
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Add New Client Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Client Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Holdings Ltd or Jane W. Mutua"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Client Classification
                  </label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value as ClientType)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="Company / Corporate">Company / Corporate</option>
                    <option value="Individual">Individual</option>
                    <option value="Government / Statutory">Government / Statutory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Contact Person (if company)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Director or Legal Officer"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Telephone / Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+254 7..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    KRA PIN or National ID / Reg *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. P051289110B or ID 12345678"
                    value={idOrRegNumber}
                    onChange={(e) => setIdOrRegNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Physical City
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
                  Physical / Postal Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chancery Towers, Valley Road, Nairobi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Client Background Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Retainer terms, corporate structure, preferred billing cycle..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
