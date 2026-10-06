import React from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Plus,
  Filter,
  User,
  ExternalLink,
} from 'lucide-react';
import { Ticket, TicketActivity, TicketCategory, StaffMember } from '../../types/ticketing';

interface DashboardModuleProps {
  tickets: Ticket[];
  activities: TicketActivity[];
  categories: TicketCategory[];
  staffMembers: StaffMember[];
  onNavigateTickets: (filterStatus?: string) => void;
  onNavigateTicketDetail: (ticketId: string) => void;
  onOpenCreateTicket: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  tickets,
  activities,
  categories,
  staffMembers,
  onNavigateTickets,
  onNavigateTicketDetail,
  onOpenCreateTicket,
}) => {
  // Calculated Metrics
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress');
  const pendingTickets = tickets.filter((t) => t.status === 'pending');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed');
  const overdueTickets = tickets.filter((t) => t.isOverdue || t.isResponseOverdue);
  const highPriorityTickets = tickets.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'closed' && t.status !== 'resolved');

  // Average resolution time (mock calculation based on resolved tickets: ~2.8 hours)
  const avgResolutionTime = '2h 35m';
  const firstResponseTime = '24m';

  // Urgent tickets requiring immediate attention
  const attentionTickets = tickets
    .filter((t) => (t.priority === 'urgent' || t.isOverdue) && t.status !== 'resolved' && t.status !== 'closed')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Support Operations Cockpit
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
              Live Queue Active
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time tracking of customer issues, staff assignments, SLA deadlines, and resolution velocities.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigateTickets('all')}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors cursor-pointer"
          >
            View All Tickets
          </button>
          <button
            onClick={onOpenCreateTicket}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (6 Cards per prompt requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Open Tickets */}
        <div
          onClick={() => onNavigateTickets('open')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Open Tickets</span>
            <Inbox className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {openTickets.length}
          </p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Needs attention</p>
        </div>

        {/* 2. Pending Tickets */}
        <div
          onClick={() => onNavigateTickets('pending')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {pendingTickets.length}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">Waiting on customer</p>
        </div>

        {/* 3. Resolved Tickets */}
        <div
          onClick={() => onNavigateTickets('resolved')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {resolvedTickets.length}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">All settled</p>
        </div>

        {/* 4. Overdue Tickets */}
        <div
          onClick={() => onNavigateTickets('overdue')}
          className={`p-4 bg-white dark:bg-[#12151b] border rounded-lg transition-colors cursor-pointer ${
            overdueTickets.length > 0
              ? 'border-red-300 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Overdue SLA</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400 tabular-nums">
            {overdueTickets.length}
          </p>
          <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mt-1">Breached targets</p>
        </div>

        {/* 5. High-Priority Tickets */}
        <div
          onClick={() => onNavigateTickets('urgent')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">High / Urgent</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {highPriorityTickets.length}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">P1 & P2 priority</p>
        </div>

        {/* 6. Average Resolution Time */}
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Avg Resolution</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {avgResolutionTime}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Resp: {firstResponseTime}
          </p>
        </div>
      </div>

      {/* Main Grid: Urgent Attention List & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Columns): High Priority & Overdue Attention Queue */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Urgent Attention Queue
              </h3>
              <p className="text-xs text-neutral-500">
                Tickets approaching or exceeding SLA response and resolution targets
              </p>
            </div>
            <button
              onClick={() => onNavigateTickets('urgent')}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {attentionTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No tickets currently overdue or marked urgent. Great job!
              </div>
            ) : (
              attentionTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onNavigateTicketDetail(ticket.id)}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-50 dark:hover:bg-[#181c24] -mx-2 px-2 rounded-md transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">
                        {ticket.id}
                      </span>
                      <span className="text-neutral-400">·</span>
                      <span
                        className={`font-semibold ${
                          ticket.priority === 'urgent'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-neutral-500 truncate">{ticket.categoryName}</span>
                    </div>

                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 mt-1 truncate">
                      {ticket.subject}
                    </p>

                    <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-1">
                      <span>{ticket.customerName}</span>
                      <span>({ticket.customerCompany})</span>
                      {ticket.isOverdue && (
                        <>
                          <span className="text-neutral-400">·</span>
                          <span className="text-red-600 font-semibold flex items-center space-x-0.5">
                            <AlertTriangle className="w-3 h-3 inline mr-0.5" />
                            Overdue
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 sm:self-center">
                    {ticket.assignedStaffName ? (
                      <div className="flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {ticket.assignedStaffAvatar ? (
                          <img
                            src={ticket.assignedStaffAvatar}
                            alt={ticket.assignedStaffName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-neutral-400" />
                        )}
                        <span className="text-[11px]">{ticket.assignedStaffName.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                        Unassigned
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        ticket.status === 'open'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                          : ticket.status === 'in_progress'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right (1 Column): Category Breakdown & SLA Adherence */}
        <div className="space-y-6">
          {/* Category Ticket Volume */}
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
              Volume by Category
            </h3>
            <p className="text-xs text-neutral-500 mb-4">Distribution across technical areas</p>

            <div className="space-y-3">
              {categories.map((cat) => {
                const count = tickets.filter((t) => t.categoryId === cat.id).length;
                const percent = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {cat.name}
                      </span>
                      <span className="text-neutral-500 tabular-nums">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full"
                        style={{ width: `${Math.max(percent, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Staff Workload Summary */}
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
              Active Support Agents
            </h3>
            <p className="text-xs text-neutral-500 mb-3">Online capacity and assigned load</p>

            <div className="space-y-2.5">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-[#12151b] ${
                          staff.status === 'online'
                            ? 'bg-emerald-500'
                            : staff.status === 'busy'
                            ? 'bg-amber-500'
                            : 'bg-neutral-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 leading-tight">
                        {staff.name}
                      </p>
                      <p className="text-[10px] text-neutral-500">{staff.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {staff.activeTicketsCount}
                    </span>
                    <span className="text-[10px] text-neutral-500"> / {staff.maxCapacity} active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Recent Support Activity
            </h3>
          </div>
          <span className="text-xs text-neutral-500">System & Agent Event Log</span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
          {activities.slice(0, 6).map((act) => (
            <div key={act.id} className="py-2.5 flex items-start justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    {act.ticketId}
                  </span>
                  <span className="text-neutral-400">·</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {act.actorName}
                  </span>
                  <span className="text-neutral-500">{act.action}</span>
                </div>
                {act.details && (
                  <p className="text-[11px] text-neutral-500 pl-1">{act.details}</p>
                )}
              </div>

              <span className="text-[11px] text-neutral-400 tabular-nums shrink-0 ml-4">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
