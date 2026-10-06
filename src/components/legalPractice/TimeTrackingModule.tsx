import React, { useState } from 'react';
import {
  Clock,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  User,
  Briefcase,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import {
  TimeEntry,
  LegalMatter,
  LegalStaff,
} from '../../types/legalPractice';

interface TimeTrackingModuleProps {
  timeEntries: TimeEntry[];
  matters: LegalMatter[];
  staff: LegalStaff[];
  onAddTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
}

export const TimeTrackingModule: React.FC<TimeTrackingModuleProps> = ({
  timeEntries,
  matters,
  staff,
  onAddTimeEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [matterFilter, setMatterFilter] = useState<string>('all');
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Form State
  const [matterId, setMatterId] = useState(matters[0]?.id || '');
  const [staffId, setStaffId] = useState(staff[0]?.id || '');
  const [durationMinutes, setDurationMinutes] = useState('120');
  const [isBillable, setIsBillable] = useState(true);
  const [activityCategory, setActivityCategory] = useState<any>('Court Appearance');
  const [description, setDescription] = useState('');

  const selectedStaff = staff.find((s) => s.id === staffId) || staff[0];
  const hourlyRateKes = selectedStaff ? selectedStaff.hourlyRateKes : 18000;
  const computedTotalKes = isBillable ? (parseInt(durationMinutes, 10) / 60) * hourlyRateKes : 0;

  const totalMinutes = timeEntries.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalBillableKes = timeEntries.reduce(
    (sum, t) => sum + (t.isBillable ? t.totalAmountKes : 0),
    0
  );
  const totalBillableHours = timeEntries
    .filter((t) => t.isBillable)
    .reduce((sum, t) => sum + t.durationMinutes / 60, 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const matter = matters.find((m) => m.id === matterId) || matters[0];
    const mins = parseInt(durationMinutes, 10) || 60;
    const rate = selectedStaff.hourlyRateKes;
    const total = isBillable ? (mins / 60) * rate : 0;

    onAddTimeEntry({
      matterId: matter ? matter.id : 'mat-1',
      matterNumber: matter ? matter.matterNumber : 'HCCOMM/GEN/2026',
      matterTitle: matter ? matter.title : 'General Legal Work',
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      activityDate: new Date().toISOString().split('T')[0],
      durationMinutes: mins,
      hourlyRateKes: rate,
      totalAmountKes: total,
      isBillable,
      description,
      activityCategory,
      invoiced: false,
    });

    setIsLogOpen(false);
    setDescription('');
  };

  const filteredEntries = timeEntries.filter((t) => {
    if (staffFilter !== 'all' && t.staffId !== staffFilter) return false;
    if (matterFilter !== 'all' && t.matterId !== matterFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.staffName.toLowerCase().includes(q) ||
        t.matterNumber.toLowerCase().includes(q) ||
        t.activityCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Advocate Billable Time &amp; Activity Journal
          </h2>
          <p className="text-xs text-neutral-500">
            Log court appearance hours, legal research, pleadings drafting, and client consultations under LSK hourly scales in KES.
          </p>
        </div>

        <button
          onClick={() => setIsLogOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Billable Time</span>
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Total Recorded Hours</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {(totalMinutes / 60).toFixed(1)} hrs
          </div>
          <span className="text-[11px] text-neutral-400">
            Billable: {totalBillableHours.toFixed(1)} hrs ({((totalBillableHours / (totalMinutes / 60 || 1)) * 100).toFixed(0)}% utilization)
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Total Billable Time Value</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            KES {totalBillableKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600">Calculated under Partner &amp; Associate scales</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Active Advocates Logging</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {staff.length} fee earners
          </div>
          <span className="text-[11px] text-neutral-400">SC, Partners, Associates &amp; Pupils</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search activity description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Advocates &amp; Staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={matterFilter}
              onChange={(e) => setMatterFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Matters ({matters.length})</option>
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.matterNumber}: {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
            <thead className="bg-neutral-50 dark:bg-[#171a22] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-3">Advocate</th>
                <th className="py-3 px-3">Matter Reference</th>
                <th className="py-3 px-3">Activity Nature</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Scale Rate</th>
                <th className="py-3 px-3">Amount (KES)</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredEntries.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-neutral-500">
                    {t.activityDate}
                  </td>
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    {t.staffName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-red-600 font-bold block">{t.matterNumber}</span>
                    <span className="text-[11px] text-neutral-400 max-w-xs truncate block">{t.matterTitle}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 block">
                      {t.activityCategory}
                    </span>
                    <span className="text-[11px] text-neutral-500 max-w-xs block leading-tight">
                      {t.description}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">
                    {(t.durationMinutes / 60).toFixed(1)} hrs
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-500">
                    KES {t.hourlyRateKes.toLocaleString()}/hr
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">
                    {t.isBillable ? `KES ${t.totalAmountKes.toLocaleString()}` : 'Non-Billable'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {t.invoiced ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                        Invoiced
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                        Unbilled (WIP)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Time Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Record Advocate Time Entry
              </h3>
              <button
                onClick={() => setIsLogOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Matter Case File *
                </label>
                <select
                  value={matterId}
                  onChange={(e) => setMatterId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.matterNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Fee Earner / Advocate *
                  </label>
                  <select
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role} • KES {s.hourlyRateKes.toLocaleString()}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Activity Classification
                  </label>
                  <select
                    value={activityCategory}
                    onChange={(e) => setActivityCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="Court Appearance">Court Appearance</option>
                    <option value="Drafting Pleadings">Drafting Pleadings</option>
                    <option value="Legal Research">Legal Research</option>
                    <option value="Client Consultation">Client Consultation</option>
                    <option value="Opposing Counsel Negotiation">Opposing Counsel Negotiation</option>
                    <option value="Document Review">Document Review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                  <span className="text-[10px] text-neutral-400">
                    {(parseInt(durationMinutes, 10) / 60 || 0).toFixed(1)} billable hours
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="billableCheck"
                      checked={isBillable}
                      onChange={(e) => setIsBillable(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="billableCheck" className="text-xs text-neutral-800 dark:text-neutral-200 font-semibold cursor-pointer">
                      Billable to Client
                    </label>
                  </div>
                  {isBillable && (
                    <span className="text-xs font-mono font-bold text-emerald-600 mt-1">
                      Computed: KES {computedTotalKes.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Activity Notes &amp; Itemization *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Conducted cross-examination preparation or drafted written submissions on preliminary objection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Log Time Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
