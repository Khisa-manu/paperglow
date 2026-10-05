import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Calendar,
  Building,
  User,
  ExternalLink,
  Shield,
  Printer,
  Download,
} from 'lucide-react';
import {
  Lease,
  Tenant,
  Property,
  Unit,
  LeaseStatus,
} from '../../types/propertyManager';

interface PMLeasesModuleProps {
  leases: Lease[];
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  onAddLease: (newLease: Omit<Lease, 'id'>) => void;
  onRenewLease: (leaseId: string, newEndDate: string) => void;
  onSendRenewalNotice: (lease: Lease) => void;
}

export const PMLeasesModule: React.FC<PMLeasesModuleProps> = ({
  leases,
  tenants,
  properties,
  units,
  onAddLease,
  onRenewLease,
  onSendRenewalNotice,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | LeaseStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false);
  const [viewAgreementLease, setViewAgreementLease] = useState<Lease | null>(null);

  // Form State
  const [leaseForm, setLeaseForm] = useState<{
    propertyId: string;
    unitId: string;
    tenantId: string;
    startDate: string;
    endDate: string;
    monthlyRentKes: number;
    depositKes: number;
    paymentDayOfMonth: number;
    termsText: string;
  }>({
    propertyId: properties[0]?.id || '',
    unitId: '',
    tenantId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    monthlyRentKes: 65000,
    depositKes: 65000,
    paymentDayOfMonth: 5,
    termsText:
      'Standard Kenyan residential tenancy agreement. Rent payable on or before 5th of each month. Deposit refundable on vacating subject to exit inspection.',
  });

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredLeases = leases.filter((l) => {
    const statusMatch = statusFilter === 'all' || l.status === statusFilter;
    const tenant = tenants.find((t) => t.id === l.tenantId);
    const prop = properties.find((p) => p.id === l.propertyId);
    const unit = units.find((u) => u.id === l.unitId);
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !searchQuery ||
      (tenant && tenant.name.toLowerCase().includes(q)) ||
      (prop && prop.name.toLowerCase().includes(q)) ||
      (unit && unit.unitNumber.toLowerCase().includes(q)) ||
      l.leaseDocumentTitle.toLowerCase().includes(q);

    return statusMatch && searchMatch;
  });

  const handleCreateLease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaseForm.propertyId || !leaseForm.unitId || !leaseForm.tenantId) return;

    const prop = properties.find((p) => p.id === leaseForm.propertyId);
    const unit = units.find((u) => u.id === leaseForm.unitId);

    onAddLease({
      propertyId: leaseForm.propertyId,
      unitId: leaseForm.unitId,
      tenantId: leaseForm.tenantId,
      startDate: leaseForm.startDate,
      endDate: leaseForm.endDate,
      monthlyRentKes: Number(leaseForm.monthlyRentKes),
      depositKes: Number(leaseForm.depositKes),
      status: 'active',
      paymentDayOfMonth: Number(leaseForm.paymentDayOfMonth) || 5,
      leaseDocumentTitle: `Tenancy Agreement (${prop?.name.split(' ')[0]} #${unit?.unitNumber})`,
      termsText: leaseForm.termsText,
    });

    setIsAddLeaseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Lease Agreements &amp; Renewals
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Track fixed-term tenancy agreements, security deposits held, expiry alerts, and digital contract archives.
          </p>
        </div>

        <button
          onClick={() => setIsAddLeaseModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Draft New Lease</span>
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
            placeholder="Search leases by tenant, building, unit..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded font-medium cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500'
            }`}
          >
            All Leases ({leases.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded font-medium cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500'
            }`}
          >
            Active ({leases.filter((l) => l.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('expiring_soon')}
            className={`px-3 py-1 rounded font-medium cursor-pointer ${
              statusFilter === 'expiring_soon'
                ? 'bg-white dark:bg-neutral-900 text-amber-700 dark:text-amber-400 font-semibold shadow-xs'
                : 'text-neutral-500'
            }`}
          >
            Expiring Soon ({leases.filter((l) => l.status === 'expiring_soon').length})
          </button>
        </div>
      </div>

      {/* Leases Table */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4">Lease Document</th>
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Property &amp; Unit</th>
                <th className="py-3 px-4">Term Dates</th>
                <th className="py-3 px-4">Monthly Rent</th>
                <th className="py-3 px-4">Deposit Held</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredLeases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No lease agreements found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLeases.map((lease) => {
                  const tenant = tenants.find((t) => t.id === lease.tenantId);
                  const prop = properties.find((p) => p.id === lease.propertyId);
                  const unit = units.find((u) => u.id === lease.unitId);

                  return (
                    <tr
                      key={lease.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        <button
                          onClick={() => setViewAgreementLease(lease)}
                          className="hover:text-red-600 text-left transition-colors cursor-pointer block group"
                        >
                          <span className="truncate max-w-[200px] block font-medium">
                            {lease.leaseDocumentTitle}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Due: {lease.paymentDayOfMonth}th of month
                          </span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                        {tenant?.name || 'Unassigned'}
                        <div className="text-[10px] text-neutral-400">{tenant?.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {unit?.unitNumber}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[130px]">
                          {prop?.name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                        <div>{lease.startDate}</div>
                        <div className="text-neutral-400">to {lease.endDate}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                        {formatKes(lease.monthlyRentKes)}
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                        {formatKes(lease.depositKes)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            lease.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : lease.status === 'expiring_soon'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-semibold'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                          }`}
                        >
                          {lease.status === 'expiring_soon'
                            ? 'Expiring Soon'
                            : lease.status === 'active'
                            ? 'Active Term'
                            : 'Terminated'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {lease.status === 'expiring_soon' && (
                            <button
                              onClick={() => onSendRenewalNotice(lease)}
                              className="px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded cursor-pointer"
                              title="Send Lease Renewal Notice"
                            >
                              Notice
                            </button>
                          )}
                          <button
                            onClick={() => setViewAgreementLease(lease)}
                            className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded cursor-pointer flex items-center space-x-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>View</span>
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

      {/* Modal: View Tenancy Agreement Document */}
      {viewAgreementLease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-600" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                  Kenyan Residential Tenancy Agreement
                </h3>
              </div>
              <button
                onClick={() => setViewAgreementLease(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal Document Parchment Style Container */}
            <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs font-serif leading-relaxed text-neutral-800 dark:text-neutral-200">
              <div className="text-center pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <h4 className="font-bold text-sm tracking-wide uppercase font-sans text-neutral-900 dark:text-neutral-100">
                  REPUBLIC OF KENYA · THE LAND REGISTRATION ACT
                </h4>
                <p className="text-[11px] font-sans text-neutral-500">
                  AGREEMENT FOR LEASE OF RESIDENTIAL / COMMERCIAL PREMISES
                </p>
              </div>

              <div>
                <strong>LANDLORD / MANAGING AGENT:</strong> Paperglow Premier Property Management Ltd (KRA PIN: P051982736Z), of P.O. Box 48912-00100 Nairobi.
              </div>

              <div>
                <strong>TENANT:</strong>{' '}
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {tenants.find((t) => t.id === viewAgreementLease.tenantId)?.name}
                </span>{' '}
                (National ID/Passport:{' '}
                {tenants.find((t) => t.id === viewAgreementLease.tenantId)?.nationalIdOrPassport}).
              </div>

              <div>
                <strong>DEMISED PREMISES:</strong> Unit{' '}
                {units.find((u) => u.id === viewAgreementLease.unitId)?.unitNumber} at{' '}
                {properties.find((p) => p.id === viewAgreementLease.propertyId)?.name},{' '}
                {properties.find((p) => p.id === viewAgreementLease.propertyId)?.address}.
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 font-sans">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Monthly Rent</span>
                  <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {formatKes(viewAgreementLease.monthlyRentKes)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Security Deposit Held</span>
                  <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {formatKes(viewAgreementLease.depositKes)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Commencement Date</span>
                  <span className="font-mono font-medium">{viewAgreementLease.startDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Expiration Date</span>
                  <span className="font-mono font-medium">{viewAgreementLease.endDate}</span>
                </div>
              </div>

              <div>
                <strong>SPECIAL COVENANTS &amp; CONDITIONS:</strong>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400 italic">
                  {viewAgreementLease.termsText}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-sans text-[11px]">
                <div>
                  <p className="font-bold">Signed for Landlord:</p>
                  <p className="text-neutral-500 italic mt-4">Eng. David M. Kariuki (MD)</p>
                  <p className="text-[9px] text-emerald-600">✓ Digitally Signed &amp; Stamped</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Signed by Tenant:</p>
                  <p className="text-neutral-500 italic mt-4">
                    {tenants.find((t) => t.id === viewAgreementLease.tenantId)?.name}
                  </p>
                  <p className="text-[9px] text-emerald-600">✓ Verified via National ID</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Agreement</span>
              </button>

              <button
                onClick={() => setViewAgreementLease(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Draft New Lease */}
      {isAddLeaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Draft New Tenancy Lease
              </h3>
              <button
                onClick={() => setIsAddLeaseModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLease} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Property *
                  </label>
                  <select
                    value={leaseForm.propertyId}
                    onChange={(e) => setLeaseForm({ ...leaseForm, propertyId: e.target.value })}
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
                    Unit *
                  </label>
                  <select
                    value={leaseForm.unitId}
                    onChange={(e) => {
                      const u = units.find((x) => x.id === e.target.value);
                      setLeaseForm({
                        ...leaseForm,
                        unitId: e.target.value,
                        monthlyRentKes: u?.monthlyRentKes || leaseForm.monthlyRentKes,
                        depositKes: u?.depositKes || leaseForm.depositKes,
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="">Select a unit...</option>
                    {units
                      .filter((u) => u.propertyId === leaseForm.propertyId)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.unitNumber} ({u.unitType})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tenant *
                </label>
                <select
                  value={leaseForm.tenantId}
                  onChange={(e) => setLeaseForm({ ...leaseForm, tenantId: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                >
                  <option value="">Select tenant...</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={leaseForm.startDate}
                    onChange={(e) => setLeaseForm({ ...leaseForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    End Date (Expiration)
                  </label>
                  <input
                    type="date"
                    value={leaseForm.endDate}
                    onChange={(e) => setLeaseForm({ ...leaseForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Monthly Rent (KES) *
                  </label>
                  <input
                    type="number"
                    value={leaseForm.monthlyRentKes}
                    onChange={(e) => setLeaseForm({ ...leaseForm, monthlyRentKes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Deposit Held (KES) *
                  </label>
                  <input
                    type="number"
                    value={leaseForm.depositKes}
                    onChange={(e) => setLeaseForm({ ...leaseForm, depositKes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Special Tenancy Clauses
                </label>
                <textarea
                  rows={2}
                  value={leaseForm.termsText}
                  onChange={(e) => setLeaseForm({ ...leaseForm, termsText: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeaseModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Issue Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
