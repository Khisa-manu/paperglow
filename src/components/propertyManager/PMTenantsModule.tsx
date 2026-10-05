import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Building,
  Key,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  Send,
  X,
  CreditCard,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import {
  Tenant,
  Property,
  Unit,
  Lease,
  RentPayment,
} from '../../types/propertyManager';

interface PMTenantsModuleProps {
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  leases: Lease[];
  payments: RentPayment[];
  onAddTenant: (newTenant: Omit<Tenant, 'id'>) => void;
  onSendReminder: (tenant: Tenant) => void;
  onRecordRentForTenant: (tenant: Tenant) => void;
}

export const PMTenantsModule: React.FC<PMTenantsModuleProps> = ({
  tenants,
  properties,
  units,
  leases,
  payments,
  onAddTenant,
  onSendReminder,
  onRecordRentForTenant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'overdue' | 'clear'>('all');
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [selectedTenantDossier, setSelectedTenantDossier] = useState<Tenant | null>(null);

  // New Tenant Form
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    nationalIdOrPassport: string;
    emergencyContact: string;
    emergencyPhone: string;
    employer: string;
    propertyId: string;
    unitId: string;
    monthlyRentKes: number;
    depositKes: number;
    moveInDate: string;
    notes: string;
  }>({
    name: '',
    email: '',
    phone: '+254 7',
    nationalIdOrPassport: '',
    emergencyContact: '',
    emergencyPhone: '+254 7',
    employer: '',
    propertyId: properties[0]?.id || '',
    unitId: '',
    monthlyRentKes: 65000,
    depositKes: 65000,
    moveInDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Vacant units for selected property in modal
  const modalAvailableUnits = units.filter(
    (u) => u.propertyId === formData.propertyId && (u.status === 'vacant' || !u.currentTenantId)
  );

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredTenants = tenants.filter((tenant) => {
    const propMatch = propertyFilter === 'all' || tenant.propertyId === propertyFilter;
    const balanceMatch =
      balanceFilter === 'all'
        ? true
        : balanceFilter === 'overdue'
        ? tenant.balanceKes > 0
        : tenant.balanceKes <= 0;
    const query = searchQuery.toLowerCase();
    const searchMatch =
      !searchQuery ||
      tenant.name.toLowerCase().includes(query) ||
      tenant.phone.toLowerCase().includes(query) ||
      tenant.email.toLowerCase().includes(query) ||
      tenant.nationalIdOrPassport.toLowerCase().includes(query);

    return propMatch && balanceMatch && searchMatch;
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.propertyId || !formData.unitId) return;

    onAddTenant({
      name: formData.name,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: formData.phone,
      nationalIdOrPassport: formData.nationalIdOrPassport || 'ID-PENDING',
      emergencyContact: formData.emergencyContact || 'Family Next of Kin',
      emergencyPhone: formData.emergencyPhone || '+254 700 000 000',
      employer: formData.employer || 'Private Sector',
      propertyId: formData.propertyId,
      unitId: formData.unitId,
      leaseId: `lease-${Date.now()}`,
      balanceKes: 0,
      moveInDate: formData.moveInDate,
      status: 'active',
      notes: formData.notes,
    });

    setIsAddTenantModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Tenant Directory &amp; Balances
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Profiles, national IDs, emergency contacts, lease links, and payment ledgers.
          </p>
        </div>

        <button
          onClick={() => {
            const firstVacant = units.find((u) => u.status === 'vacant');
            setFormData((prev) => ({
              ...prev,
              propertyId: firstVacant?.propertyId || properties[0]?.id || '',
              unitId: firstVacant?.id || '',
              monthlyRentKes: firstVacant?.monthlyRentKes || 65000,
              depositKes: firstVacant?.depositKes || 65000,
            }));
            setIsAddTenantModalOpen(true);
          }}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Tenant</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, national ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Property Filter */}
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">All Properties ({tenants.length})</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Balance Filter */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setBalanceFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                balanceFilter === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setBalanceFilter('overdue')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                balanceFilter === 'overdue'
                  ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Overdue ({tenants.filter((t) => t.balanceKes > 0).length})
            </button>
            <button
              onClick={() => setBalanceFilter('clear')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                balanceFilter === 'clear'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Cleared
            </button>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4">Tenant Name</th>
                <th className="py-3 px-4">Assigned Location</th>
                <th className="py-3 px-4">Phone / Email</th>
                <th className="py-3 px-4">National ID / Passport</th>
                <th className="py-3 px-4">Employer / Organization</th>
                <th className="py-3 px-4">Monthly Rent</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No tenants found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => {
                  const prop = properties.find((p) => p.id === tenant.propertyId);
                  const unit = units.find((u) => u.id === tenant.unitId);
                  const lease = leases.find((l) => l.tenantId === tenant.id);
                  const isOverdue = tenant.balanceKes > 0;

                  return (
                    <tr
                      key={tenant.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        <button
                          onClick={() => setSelectedTenantDossier(tenant)}
                          className="hover:text-red-600 transition-colors text-left cursor-pointer group flex items-center space-x-1.5"
                        >
                          <span>{tenant.name}</span>
                        </button>
                        <div className="text-[10px] text-neutral-400 font-normal">
                          Since {tenant.moveInDate}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {unit?.unitNumber || 'Unassigned'}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[140px]">
                          {prop?.name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-mono text-neutral-800 dark:text-neutral-200">
                          {tenant.phone}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-[150px]">
                          {tenant.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                        {tenant.nationalIdOrPassport}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 truncate max-w-[150px]">
                        {tenant.employer}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
                        {formatKes(unit?.monthlyRentKes || lease?.monthlyRentKes || 0)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                        {isOverdue ? (
                          <span className="text-red-600 dark:text-red-400 flex items-center space-x-1">
                            <span>{formatKes(tenant.balanceKes)}</span>
                            <span className="text-[9px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-1 rounded uppercase">
                              Due
                            </span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            KES 0 · Cleared
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onRecordRentForTenant(tenant)}
                            className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded cursor-pointer"
                            title="Record Rent Payment"
                          >
                            Pay Rent
                          </button>
                          {isOverdue && (
                            <button
                              onClick={() => onSendReminder(tenant)}
                              className="px-2 py-1 text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 rounded cursor-pointer flex items-center space-x-1"
                              title="Send SMS / WhatsApp Rent Reminder"
                            >
                              <Send className="w-3 h-3" />
                              <span>Remind</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTenantDossier(tenant)}
                            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded cursor-pointer"
                            title="View Tenant Dossier"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tenant Dossier & Ledger History */}
      {selectedTenantDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  Tenant Dossier &amp; Rent Ledger
                </span>
                <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                  {selectedTenantDossier.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTenantDossier(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-[10px] text-neutral-400 block">Phone</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedTenantDossier.phone}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-[10px] text-neutral-400 block">National ID / Passport</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedTenantDossier.nationalIdOrPassport}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-[10px] text-neutral-400 block">Current Balance</span>
                <span
                  className={`font-mono font-bold ${
                    selectedTenantDossier.balanceKes > 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {formatKes(selectedTenantDossier.balanceKes)}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-[10px] text-neutral-400 block">Employer</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedTenantDossier.employer}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-[10px] text-neutral-400 block">Emergency Contact</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedTenantDossier.emergencyContact} ({selectedTenantDossier.emergencyPhone})
                </span>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <span className="text-[10px] text-neutral-400 block">Move In Date</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedTenantDossier.moveInDate}
                </span>
              </div>
            </div>

            {/* Payment History for this Tenant */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Payment History Ledger
              </h4>
              <div className="max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-400 font-medium">
                    <tr>
                      <th className="py-2 px-3">Receipt #</th>
                      <th className="py-2 px-3">Month For</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 px-3">Reference</th>
                      <th className="py-2 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {payments
                      .filter((p) => p.tenantId === selectedTenantDossier.id)
                      .map((pay) => (
                        <tr key={pay.id}>
                          <td className="py-2 px-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                            {pay.receiptNumber}
                          </td>
                          <td className="py-2 px-3 text-neutral-700 dark:text-neutral-300">
                            {pay.monthFor}
                          </td>
                          <td className="py-2 px-3 font-mono font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                            {formatKes(pay.amountKes)}
                          </td>
                          <td className="py-2 px-3 uppercase text-[10px]">
                            {pay.paymentMethod}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-neutral-500">
                            {pay.transactionReference}
                          </td>
                          <td className="py-2 px-3 text-neutral-500">{pay.paymentDate}</td>
                        </tr>
                      ))}
                    {payments.filter((p) => p.tenantId === selectedTenantDossier.id).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-neutral-400">
                          No previous payments recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => {
                  onSendReminder(selectedTenantDossier);
                }}
                className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Notice via WhatsApp/SMS</span>
              </button>

              <button
                onClick={() => setSelectedTenantDossier(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Tenant */}
      {isAddTenantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Register New Tenant
              </h3>
              <button
                onClick={() => setIsAddTenantModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Samuel Mutua"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="samuel@gmail.com"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    National ID / Passport *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nationalIdOrPassport}
                    onChange={(e) => setFormData({ ...formData, nationalIdOrPassport: e.target.value })}
                    placeholder="e.g. ID-28910293"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Property Selection *
                  </label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => {
                      const newPropId = e.target.value;
                      const nextVacant = units.find(
                        (u) => u.propertyId === newPropId && (u.status === 'vacant' || !u.currentTenantId)
                      );
                      setFormData({
                        ...formData,
                        propertyId: newPropId,
                        unitId: nextVacant?.id || '',
                        monthlyRentKes: nextVacant?.monthlyRentKes || 65000,
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Assign Unit *
                  </label>
                  <select
                    required
                    value={formData.unitId}
                    onChange={(e) => {
                      const u = units.find((x) => x.id === e.target.value);
                      setFormData({
                        ...formData,
                        unitId: e.target.value,
                        monthlyRentKes: u?.monthlyRentKes || formData.monthlyRentKes,
                        depositKes: u?.depositKes || formData.depositKes,
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="">Select an available unit...</option>
                    {modalAvailableUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.unitNumber} ({u.unitType} - {formatKes(u.monthlyRentKes)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Employer / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.employer}
                    onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                    placeholder="e.g. Kenya Commercial Bank"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Move In Date
                  </label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="e.g. Mercy Mutua (Wife)"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddTenantModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm &amp; Register Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
