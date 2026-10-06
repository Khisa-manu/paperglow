import React from 'react';
import {
  Clock,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  BellRing,
  UserCheck,
} from 'lucide-react';
import {
  SLAEscalationPolicy,
  Ticket,
  StaffMember,
} from '../../types/ticketing';

interface SLAModuleProps {
  policies: SLAEscalationPolicy[];
  tickets: Ticket[];
  staffMembers: StaffMember[];
  onNavigateTicketDetail: (ticketId: string) => void;
  onEscalateTicket: (ticketId: string) => void;
}

export const SLAModule: React.FC<SLAModuleProps> = ({
  policies,
  tickets,
  staffMembers,
  onNavigateTicketDetail,
  onEscalateTicket,
}) => {
  // Overdue and at-risk tickets
  const overdueTickets = tickets.filter((t) => t.isOverdue || t.isResponseOverdue);
  const urgentTickets = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Service Level Agreement (SLA) & Priority Escalation
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900">
                Automated Rules Active
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Guaranteed first response and resolution deadlines mapped to incident severity tiers with automated supervisor alerts.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-700 dark:text-emerald-300">
              <span className="font-bold tabular-nums">96.4%</span> SLA Adherence Rate
            </div>
          </div>
        </div>
      </div>

      {/* SLA Tier Policy Cards */}
      <div>
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Configured SLA Thresholds by Severity Tier
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {policies.map((pol) => {
            const isUrgent = pol.priority === 'urgent';
            const isHigh = pol.priority === 'high';

            return (
              <div
                key={pol.id}
                className={`p-5 rounded-lg border space-y-3 ${
                  isUrgent
                    ? 'bg-red-50/20 dark:bg-red-950/15 border-red-200 dark:border-red-900/60'
                    : isHigh
                    ? 'bg-amber-50/20 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/60'
                    : 'bg-white dark:bg-[#12151b] border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isUrgent
                        ? 'text-red-600'
                        : isHigh
                        ? 'text-amber-600'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {pol.label}
                  </span>
                  {isUrgent && <Flame className="w-4 h-4 text-red-600 animate-pulse" />}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white/80 dark:bg-[#181c24] rounded border border-neutral-200/60 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Response Deadline</span>
                    <span className="font-bold text-neutral-900 dark:text-white tabular-nums text-sm">
                      {pol.responseHours} {pol.responseHours === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white/80 dark:bg-[#181c24] rounded border border-neutral-200/60 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Resolution Target</span>
                    <span className="font-bold text-neutral-900 dark:text-white tabular-nums text-sm">
                      {pol.resolutionHours} hours
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <p>
                    <strong>Escalation:</strong> {pol.escalationRole}
                  </p>
                  <p className="text-[10px] text-neutral-500 leading-snug">{pol.escalationAction}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live SLA Overdue & Risk Monitor */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Live At-Risk & Overdue Ticket Monitor
            </h3>
          </div>
          <span className="text-xs text-neutral-500">
            {overdueTickets.length} tickets requiring escalation intervention
          </span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {overdueTickets.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                100% of tickets currently within target SLAs!
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">No overdue escalations at this moment.</p>
            </div>
          ) : (
            overdueTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onNavigateTicketDetail(ticket.id)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-red-600 dark:text-red-400">
                      {ticket.id}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {ticket.subject}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-1">
                    <span>{ticket.customerName}</span>
                    <span>·</span>
                    <span>{ticket.customerCompany}</span>
                    <span>·</span>
                    <span className="text-red-600 font-semibold">
                      Due: {new Date(ticket.dueDate).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold">
                    Target Breached
                  </span>

                  <button
                    onClick={() => onEscalateTicket(ticket.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-xs transition-colors cursor-pointer"
                  >
                    Escalate to Lead
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
