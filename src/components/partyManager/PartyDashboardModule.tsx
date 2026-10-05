import React from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Building,
  ShieldCheck,
  Megaphone,
  ArrowRight,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Plus,
} from 'lucide-react';
import {
  PartyMember,
  PartyBranch,
  PartyEvent,
  PartyTask,
  PartyFinanceTransaction,
  PartyCommunication,
  PartyModule,
} from '../../types/partyManager';

interface PartyDashboardModuleProps {
  members: PartyMember[];
  branches: PartyBranch[];
  events: PartyEvent[];
  tasks: PartyTask[];
  transactions: PartyFinanceTransaction[];
  communications: PartyCommunication[];
  onNavigate: (module: PartyModule) => void;
  onQuickAddMember: () => void;
  onQuickScheduleEvent: () => void;
  onQuickRecordFinance: () => void;
}

export const PartyDashboardModule: React.FC<PartyDashboardModuleProps> = ({
  members,
  branches,
  events,
  tasks,
  transactions,
  communications,
  onNavigate,
  onQuickAddMember,
  onQuickScheduleEvent,
  onQuickRecordFinance,
}) => {
  // Key KPI calculations
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const activePercentage = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

  const totalRegisteredEstimate = branches.reduce((sum, b) => sum + b.memberCount, 0);

  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const outstandingTasks = tasks.filter((t) => t.status !== 'completed');
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed');

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.direction === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.direction === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netTreasuryBalance = totalIncome - totalExpenses;

  const membershipDuesCollected = transactions
    .filter((t) => t.type === 'membership_dues')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Statutory & Compliance Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-5 rounded-2xl shadow-md border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Office of Registrar of Political Parties (ORPP)
              </span>
              <span className="text-xs text-slate-300 font-mono">Ref: RPP/REG/2013/0488</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              United Civic Alliance of Kenya (UCA-K)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              National Secretariat Portal • Certified 47-county representation roll • Registered pursuant to the Political Parties Act 2011 (Cap 7D).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onQuickAddMember}
              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Member</span>
            </button>
            <button
              onClick={onQuickScheduleEvent}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Plan Meeting</span>
            </button>
            <button
              onClick={() => onNavigate('documents')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Constitution</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Registry Members</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalRegisteredEstimate.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +8.4%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Sampled Demo Profiles: {totalMembers}</span>
            <span className="font-semibold text-slate-700">6 Regional Hubs</span>
          </div>
        </div>

        {/* Active Members Ratio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Status Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activePercentage}%</span>
            <span className="text-xs text-slate-500 font-medium">{activeMembers} active in roster</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Dues Compliant: 78%</span>
            <button
              onClick={() => onNavigate('members')}
              className="text-red-600 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Directory <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Upcoming Assemblies */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Upcoming Assemblies</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{upcomingEvents.length}</span>
            <span className="text-xs text-blue-700 font-semibold">Agendas Gazetted</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Next: Coast AGM (March 22)</span>
            <button
              onClick={() => onNavigate('events')}
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Schedules <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Treasury Operating Fund */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Net Operating Fund</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              KES {netTreasuryBalance.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Dues: KES {membershipDuesCollected.toLocaleString()}</span>
            <button
              onClick={() => onNavigate('finance')}
              className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Treasury <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Events & Tasks vs Financial and Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Upcoming Events & Urgent Workflows */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Statutory Assemblies & Sessions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Upcoming Organs, AGMs & Assemblies
                </h3>
              </div>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>View All Assemblies</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-red-100 text-red-800">
                          {evt.eventType.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {evt.date} • {evt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {evt.venue}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        Expected: {evt.attendeesExpected} Delegates
                      </span>
                    </div>
                  </div>

                  {evt.agendaItems && evt.agendaItems.length > 0 && (
                    <div className="mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                      <div className="font-semibold text-slate-700 mb-1">Key Agenda Topics:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {evt.agendaItems.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding Secretariat Tasks & Compliance Workflows */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Secretariat Action Items & Deadlines
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>Task Board ({outstandingTasks.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 4).map((tsk) => {
                const isUrgent = tsk.priority === 'urgent' || tsk.priority === 'high';
                const isDone = tsk.status === 'completed';
                return (
                  <div key={tsk.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isDone
                              ? 'bg-emerald-500'
                              : isUrgent
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {tsk.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tsk.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span>Assigned to: <strong className="text-slate-600">{tsk.assignedTo}</strong></span>
                        <span>Due: <strong className="text-slate-600">{tsk.dueDate}</strong></span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize shrink-0 ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isUrgent
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tsk.status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Financial Snapshot & Latest Circulars */}
        <div className="space-y-6">
          {/* Quick Treasury Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Treasury Overview
              </h3>
              <button
                onClick={onQuickRecordFinance}
                className="text-[11px] text-emerald-700 font-semibold hover:underline"
              >
                + Record Entry
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Verified Inflows (Q1)</div>
                <div className="text-lg font-bold text-slate-900">
                  KES {totalIncome.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Includes Dues & Statutory Donations
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Disbursements & Operations</div>
                <div className="text-lg font-bold text-slate-900">
                  KES {totalExpenses.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Regional grants, ORPP gazetting & lease
                </div>
              </div>

              <div className="p-3 bg-red-50/60 rounded-lg border border-red-200/80">
                <div className="text-xs text-red-900 font-medium">M-Pesa Official Paybill</div>
                <div className="text-sm font-bold text-red-950 font-mono">522522</div>
                <div className="text-[10px] text-red-700 mt-0.5">
                  Account: Member National ID Number
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('finance')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold text-center transition-colors"
            >
              Open Financial Ledger
            </button>
          </div>

          {/* Latest Circulars & Communications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-red-600" />
                Latest Circulars
              </h3>
              <button
                onClick={() => onNavigate('communications')}
                className="text-[11px] text-red-600 font-semibold hover:underline"
              >
                All Memos
              </button>
            </div>

            <div className="space-y-3">
              {communications.slice(0, 3).map((comm) => (
                <div
                  key={comm.id}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-red-700">
                      {comm.messageType}
                    </span>
                    <span>{comm.sentAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{comm.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{comm.body}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>By: {comm.senderName}</span>
                    <span className="text-emerald-700 font-medium">
                      Delivered to {comm.recipientCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
