import React from 'react';
import {
  Briefcase,
  Gavel,
  Clock,
  CreditCard,
  Plus,
  ArrowRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  LegalMatter,
  CourtHearingEvent,
  LegalDeadline,
  LegalInvoice,
  ClientCommunication,
  LegalModule,
} from '../../types/legalPractice';

interface DashboardModuleProps {
  matters: LegalMatter[];
  hearings: CourtHearingEvent[];
  deadlines: LegalDeadline[];
  invoices: LegalInvoice[];
  communications: ClientCommunication[];
  onNavigateModule: (mod: LegalModule) => void;
  onOpenCreateMatter: () => void;
  onSelectMatter: (matter: LegalMatter) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  matters,
  hearings,
  deadlines,
  invoices,
  communications,
  onNavigateModule,
  onOpenCreateMatter,
  onSelectMatter,
}) => {
  const activeMatters = matters.filter((m) => m.status !== 'closed');
  const upcomingHearings = hearings.filter((h) => h.status === 'upcoming');
  const pendingDeadlines = deadlines.filter((d) => !d.isCompleted);
  const totalOutstandingKes = invoices.reduce((sum, inv) => sum + inv.balanceDueKes, 0);
  const totalBilledKes = invoices.reduce((sum, inv) => sum + inv.grandTotalKes, 0);
  const totalHours = matters.reduce((sum, m) => sum + m.totalHoursRecorded, 0);

  // Next court appearance
  const nextHearing = upcomingHearings[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Law Practice Operations &amp; Court Cockpit
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
              Kenyan Courts &amp; Registry
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time tracking of active dispute matters, Milimani court hearings, e-filing statutory deadlines, and client fee notes in KES.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateModule('court_deadlines')}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <Gavel className="w-3.5 h-3.5 text-red-600" />
            <span>Court Diary</span>
          </button>
          <button
            onClick={() => onNavigateModule('time_tracking')}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Record Time</span>
          </button>
          <button
            onClick={onOpenCreateMatter}
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open Matter</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Active Matters */}
        <div
          onClick={() => onNavigateModule('matters')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1 cursor-pointer hover:border-neutral-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Active Case Matters</span>
            <Briefcase className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {activeMatters.length}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>{matters.length} Total Matters</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {matters.filter((m) => m.status === 'in_trial').length} In Trial
            </span>
          </div>
        </div>

        {/* Metric 2: Court Appearances */}
        <div
          onClick={() => onNavigateModule('court_deadlines')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1 cursor-pointer hover:border-red-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Court Dates &amp; Hearings</span>
            <Gavel className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
            {upcomingHearings.length}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>High Court &amp; ELC</span>
            <span className="text-red-600 font-semibold underline">Court Diary →</span>
          </div>
        </div>

        {/* Metric 3: Upcoming Deadlines */}
        <div
          onClick={() => onNavigateModule('court_deadlines')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Upcoming Deadlines</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {pendingDeadlines.length}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>Filing &amp; Submissions</span>
            <span className="text-amber-600 font-semibold underline">View Dates →</span>
          </div>
        </div>

        {/* Metric 4: Outstanding Invoices */}
        <div
          onClick={() => onNavigateModule('billing')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1 cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Receivables (KES)</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            KES {totalOutstandingKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>Billed: KES {totalBilledKes.toLocaleString()}</span>
            <span className="text-emerald-600 font-semibold">Fee Notes →</span>
          </div>
        </div>

        {/* Metric 5: Billable Hours */}
        <div
          onClick={() => onNavigateModule('time_tracking')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1 cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Billable Hours Logged</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {totalHours.toFixed(1)} hrs
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
            <span>Across Active Files</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Scale Rates</span>
          </div>
        </div>
      </div>

      {/* Immediate Court Alert Banner */}
      {nextHearing && (
        <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center space-x-3">
            <span className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 shrink-0">
              <Gavel className="w-5 h-5 text-red-600" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-red-900 dark:text-red-200 uppercase tracking-wider text-[11px]">
                  Next Court Hearing • {nextHearing.date} ({nextHearing.time})
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-red-600 text-white">
                  {nextHearing.hearingType}
                </span>
              </div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs mt-0.5">
                {nextHearing.matterNumber}: {nextHearing.matterTitle}
              </div>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                Forum: {nextHearing.courtForum} • {nextHearing.courtRoom} • Presiding: {nextHearing.presidingJudge} • Counsel: {nextHearing.advocateInCharge}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateModule('court_deadlines')}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors shrink-0 text-center cursor-pointer shadow-xs self-start md:self-auto"
          >
            Review Court File
          </button>
        </div>
      )}

      {/* Two-Column Grid: Active Matters & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Matters */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Active Client Matters
              </h3>
            </div>
            <button
              onClick={() => onNavigateModule('matters')}
              className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {activeMatters.slice(0, 4).map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMatter(m)}
                className="py-3 flex items-start justify-between gap-3 text-xs cursor-pointer hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {m.matterNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === 'in_trial'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                          : m.status === 'open'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}
                    >
                      {m.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                    {m.title}
                  </h4>
                  <div className="text-[11px] text-neutral-500">
                    Client: {m.clientName} • Advocate: {m.assignedAdvocateName}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {m.nextCourtDate ? (
                    <div className="text-[11px] text-red-600 font-semibold">
                      Court: {m.nextCourtDate}
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-400">Filed {m.filingDate}</div>
                  )}
                  {m.disputeValueKes && (
                    <div className="text-[10px] font-mono text-neutral-400">
                      KES {(m.disputeValueKes / 1000000).toFixed(1)}M value
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deadlines & Statutory Limitation Watch */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Critical Filing &amp; Statutory Deadlines
              </h3>
            </div>
            <button
              onClick={() => onNavigateModule('court_deadlines')}
              className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>All Deadlines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {pendingDeadlines.slice(0, 4).map((dl) => (
              <div key={dl.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        dl.priority === 'urgent'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {dl.priority}
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {dl.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    File: <strong className="font-mono text-neutral-700 dark:text-neutral-300">{dl.matterNumber}</strong> • Assigned: {dl.assignedTo}
                  </div>
                  {dl.notes && (
                    <p className="text-[10px] text-neutral-400 italic">{dl.notes}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-red-600 text-xs block">
                    Due: {dl.dueDate}
                  </span>
                  <span className="text-[10px] text-neutral-400">{dl.deadlineType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Client Activity & Timeline */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Recent Client Communications &amp; Strategy Sessions
            </h3>
          </div>
          <button
            onClick={() => onNavigateModule('communications')}
            className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View Communication Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {communications.slice(0, 3).map((comm) => (
            <div
              key={comm.id}
              className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {comm.clientName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {comm.channel}
                </span>
              </div>
              <div className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11px]">
                {comm.subject}
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">
                {comm.content}
              </p>
              <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
                <span>By {comm.advocateName}</span>
                <span>{comm.timestamp.split('T')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
