import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  Gavel,
  Clock,
  User,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  FileText,
  MessageSquare,
  Scale,
} from 'lucide-react';
import {
  LegalMatter,
  LegalClient,
  LegalStaff,
  MatterStatus,
  MatterType,
  CourtForum,
} from '../../types/legalPractice';

interface MattersModuleProps {
  matters: LegalMatter[];
  clients: LegalClient[];
  staff: LegalStaff[];
  onOpenCreateMatter: () => void;
  onSelectMatter: (matter: LegalMatter) => void;
  onUpdateMatterStatus: (matterId: string, newStatus: MatterStatus) => void;
  onDeleteMatter: (matterId: string) => void;
}

export const MattersModule: React.FC<MattersModuleProps> = ({
  matters,
  clients,
  staff,
  onOpenCreateMatter,
  onSelectMatter,
  onUpdateMatterStatus,
  onDeleteMatter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [advocateFilter, setAdvocateFilter] = useState<string>('all');
  const [selectedMatterDetail, setSelectedMatterDetail] = useState<LegalMatter | null>(null);

  const filteredMatters = useMemo(() => {
    return matters.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (typeFilter !== 'all' && m.matterType !== typeFilter) return false;
      if (advocateFilter !== 'all' && m.assignedAdvocateId !== advocateFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          m.matterNumber.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.clientName.toLowerCase().includes(q) ||
          (m.courtForum && m.courtForum.toLowerCase().includes(q)) ||
          (m.opposingParty && m.opposingParty.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [matters, statusFilter, typeFilter, advocateFilter, searchQuery]);

  const getStatusBadge = (status: MatterStatus) => {
    switch (status) {
      case 'in_trial':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900">
            In Trial Hearing
          </span>
        );
      case 'open':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Active / Open
          </span>
        );
      case 'pending_court':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Pending Registry
          </span>
        );
      case 'settlement':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Settlement Negotiations
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            Closed / Disposed
          </span>
        );
      case 'on_hold':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
            On Hold
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Master Matters &amp; Case Files Registry
          </h2>
          <p className="text-xs text-neutral-500">
            Complete dossier tracking for civil litigation, conveyancing, employment claims, arbitration, and appellate briefs.
          </p>
        </div>

        <button
          onClick={onOpenCreateMatter}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Open New Case Matter</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search matter no, title, client or court..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Matter Statuses ({matters.length})</option>
              <option value="in_trial">In Trial Hearing</option>
              <option value="open">Active / Open</option>
              <option value="pending_court">Pending Registry / Directions</option>
              <option value="settlement">Settlement Negotiations</option>
              <option value="closed">Closed / Disposed</option>
            </select>
          </div>

          {/* Practice Area Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Practice Areas</option>
              <option value="Commercial Litigation">Commercial Litigation</option>
              <option value="Conveyancing & Real Estate">Conveyancing &amp; Real Estate</option>
              <option value="Employment & Labour Relations">Employment &amp; Labour</option>
              <option value="Environment and Land Court (ELC)">Environment &amp; Land (ELC)</option>
              <option value="Corporate & M&A">Corporate &amp; M&amp;A</option>
            </select>
          </div>

          {/* Assigned Advocate Filter */}
          <div>
            <select
              value={advocateFilter}
              onChange={(e) => setAdvocateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Assigned Advocates</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span>
            Displaying <strong className="text-neutral-900 dark:text-white">{filteredMatters.length}</strong> matter files
          </span>
          {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || advocateFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
                setAdvocateFilter('all');
              }}
              className="text-red-600 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Matters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatters.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                      {m.matterNumber}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-500">
                      {m.matterType}
                    </span>
                  </div>
                  <h3
                    onClick={() => {
                      setSelectedMatterDetail(m);
                      onSelectMatter(m);
                    }}
                    className="font-bold text-sm text-neutral-900 dark:text-white mt-1 cursor-pointer hover:text-red-600 transition-colors"
                  >
                    {m.title}
                  </h3>
                </div>
                {getStatusBadge(m.status)}
              </div>

              {/* Client & Court Info */}
              <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>
                    Client: <strong className="text-neutral-800 dark:text-neutral-200">{m.clientName}</strong>
                  </span>
                </div>
                {m.courtForum && (
                  <div className="flex items-center space-x-1.5">
                    <Gavel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {m.courtForum} • {m.caseJudge ? m.caseJudge : 'Court Division'}
                    </span>
                  </div>
                )}
                {m.opposingParty && (
                  <div className="text-[11px] text-neutral-500">
                    Opposing: {m.opposingParty} {m.opposingCounsel ? `(${m.opposingCounsel})` : ''}
                  </div>
                )}
              </div>

              {/* Next Court Date Banner if applicable */}
              {m.nextCourtDate && (
                <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-600" />
                    <span className="font-semibold">Next Court Date: {m.nextCourtDate}</span>
                  </div>
                  <span className="text-[10px] text-red-700 dark:text-red-400 truncate max-w-[150px]">
                    {m.nextCourtPurpose}
                  </span>
                </div>
              )}
            </div>

            {/* Financials & Action Footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[11px] text-neutral-500">
                  Lead Advocate: <strong className="text-neutral-800 dark:text-neutral-200">{m.assignedAdvocateName}</strong>
                </div>
                <div className="text-[11px] font-mono text-neutral-500">
                  Billed: KES {m.totalBilledKes.toLocaleString()} • Bal: <span className={m.outstandingBalanceKes > 0 ? 'text-red-600 font-bold' : 'text-emerald-600'}>KES {m.outstandingBalanceKes.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={m.status}
                  onChange={(e) => onUpdateMatterStatus(m.id, e.target.value as MatterStatus)}
                  className="px-2 py-1 text-[11px] border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="in_trial">In Trial</option>
                  <option value="pending_court">Pending</option>
                  <option value="settlement">Settlement</option>
                  <option value="closed">Closed</option>
                  <option value="on_hold">On Hold</option>
                </select>

                <button
                  onClick={() => {
                    setSelectedMatterDetail(m);
                    onSelectMatter(m);
                  }}
                  className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  title="View Matter Dossier"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMatters.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
            <Briefcase className="w-8 h-8 text-neutral-400 mx-auto" />
            <p>No legal matters found matching your search filter.</p>
          </div>
        )}
      </div>

      {/* Matter Dossier Modal / Drawer */}
      {selectedMatterDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                  {selectedMatterDetail.matterNumber}
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1 font-['Poppins']">
                  {selectedMatterDetail.title}
                </h3>
                <p className="text-xs text-neutral-500">
                  Client: {selectedMatterDetail.clientName} ({selectedMatterDetail.clientType})
                </p>
              </div>
              <button
                onClick={() => setSelectedMatterDetail(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matter Summary Card */}
            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {selectedMatterDetail.description}
              </p>
              {selectedMatterDetail.notes && (
                <p className="text-neutral-500 italic text-[11px] pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                  Private Advocate Notes: {selectedMatterDetail.notes}
                </p>
              )}
            </div>

            {/* Case Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Court Forum</span>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {selectedMatterDetail.courtForum || 'N/A (Pre-Action)'}
                </div>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Lead Advocate</span>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {selectedMatterDetail.assignedAdvocateName}
                </div>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Claim / Dispute Value</span>
                <div className="font-mono font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {selectedMatterDetail.disputeValueKes
                    ? `KES ${selectedMatterDetail.disputeValueKes.toLocaleString()}`
                    : 'Unliquidated Claim'}
                </div>
              </div>
            </div>

            {/* Matter Activity Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-['Poppins']">
                Case Activity &amp; Pleading Timeline
              </h4>
              <div className="space-y-2.5 divide-y divide-neutral-100 dark:divide-neutral-800">
                {selectedMatterDetail.timeline.map((ev) => (
                  <div key={ev.id} className="pt-2.5 first:pt-0 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {ev.title}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">{ev.date}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">{ev.description}</p>
                    <div className="text-[10px] text-neutral-400">By {ev.performedBy}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedMatterDetail(null)}
                className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
