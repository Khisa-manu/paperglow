import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  ChevronDown,
  X,
  Flame,
  LifeBuoy,
} from 'lucide-react';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketCategory,
  StaffMember,
} from '../../types/ticketing';

interface TicketsModuleProps {
  tickets: Ticket[];
  categories: TicketCategory[];
  staffMembers: StaffMember[];
  initialFilter?: string;
  onNavigateTicketDetail: (ticketId: string) => void;
  onOpenCreateTicket: () => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onUpdateTicketAssignee: (ticketId: string, staffId: string) => void;
}

export const TicketsModule: React.FC<TicketsModuleProps> = ({
  tickets,
  categories,
  staffMembers,
  initialFilter = 'all',
  onNavigateTicketDetail,
  onOpenCreateTicket,
  onUpdateTicketStatus,
  onUpdateTicketAssignee,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Multi-select for bulk actions
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [bulkAssignStaffId, setBulkAssignStaffId] = useState('');

  // Filtered tickets calculation
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter === 'open' && ticket.status !== 'open') return false;
      if (statusFilter === 'in_progress' && ticket.status !== 'in_progress') return false;
      if (statusFilter === 'pending' && ticket.status !== 'pending') return false;
      if (statusFilter === 'resolved' && ticket.status !== 'resolved' && ticket.status !== 'closed') return false;
      if (statusFilter === 'urgent' && ticket.priority !== 'urgent' && ticket.priority !== 'high') return false;
      if (statusFilter === 'overdue' && !ticket.isOverdue && !ticket.isResponseOverdue) return false;
      if (statusFilter === 'unassigned' && ticket.assignedStaffId) return false;

      // Priority filter
      if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && ticket.categoryId !== categoryFilter) return false;

      // Assignee filter
      if (assigneeFilter !== 'all') {
        if (assigneeFilter === 'unassigned' && ticket.assignedStaffId) return false;
        if (assigneeFilter !== 'unassigned' && ticket.assignedStaffId !== assigneeFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = ticket.id.toLowerCase().includes(q);
        const matchesSubject = ticket.subject.toLowerCase().includes(q);
        const matchesCustomer = ticket.customerName.toLowerCase().includes(q);
        const matchesCompany = ticket.customerCompany.toLowerCase().includes(q);
        const matchesCategory = ticket.categoryName.toLowerCase().includes(q);
        const matchesTags = ticket.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesId && !matchesSubject && !matchesCustomer && !matchesCompany && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'createdAt') {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortOrder === 'desc' ? diff : -diff;
      }
      if (sortBy === 'dueDate') {
        const diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        return sortOrder === 'asc' ? diff : -diff;
      }
      if (sortBy === 'priority') {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        return sortOrder === 'desc' ? diff : -diff;
      }
      return 0;
    });
  }, [tickets, statusFilter, priorityFilter, categoryFilter, assigneeFilter, searchQuery, sortBy, sortOrder]);

  const toggleSelectTicket = (id: string) => {
    setSelectedTicketIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTicketIds.length === filteredTickets.length) {
      setSelectedTicketIds([]);
    } else {
      setSelectedTicketIds(filteredTickets.map((t) => t.id));
    }
  };

  const handleBulkStatus = (status: TicketStatus) => {
    selectedTicketIds.forEach((id) => onUpdateTicketStatus(id, status));
    setSelectedTicketIds([]);
  };

  const handleBulkAssign = (staffId: string) => {
    if (!staffId) return;
    selectedTicketIds.forEach((id) => onUpdateTicketAssignee(id, staffId));
    setSelectedTicketIds([]);
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="font-semibold text-red-600 dark:text-red-400 flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>Urgent</span>
          </span>
        );
      case 'high':
        return <span className="font-semibold text-amber-600 dark:text-amber-400">High</span>;
      case 'medium':
        return <span className="font-medium text-blue-600 dark:text-blue-400">Medium</span>;
      case 'low':
        return <span className="font-medium text-neutral-500">Low</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            In Progress
          </span>
        );
      case 'pending':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
            Pending
          </span>
        );
      case 'resolved':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Status Tabs & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Status Filter Tabs (Button Segmented Controls) */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Tickets', count: tickets.length },
            { id: 'open', label: 'Open', count: tickets.filter((t) => t.status === 'open').length },
            { id: 'in_progress', label: 'In Progress', count: tickets.filter((t) => t.status === 'in_progress').length },
            { id: 'pending', label: 'Pending', count: tickets.filter((t) => t.status === 'pending').length },
            { id: 'resolved', label: 'Resolved', count: tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length },
            { id: 'urgent', label: 'Urgent & High', count: tickets.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'closed' && t.status !== 'resolved').length },
            { id: 'overdue', label: 'Overdue SLA', count: tickets.filter((t) => t.isOverdue || t.isResponseOverdue).length },
            { id: 'unassigned', label: 'Unassigned', count: tickets.filter((t) => !t.assignedStaffId).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer flex items-center space-x-1.5 ${
                statusFilter === tab.id
                  ? 'bg-red-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.1 rounded-full tabular-nums ${
                  statusFilter === tab.id
                    ? 'bg-red-700/60 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onOpenCreateTicket}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by ID, subject, customer, or tags..."
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Assignee */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {staffMembers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-') as ['createdAt' | 'dueDate' | 'priority', 'asc' | 'desc'];
              setSortBy(sb);
              setSortOrder(so);
            }}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Soonest</option>
            <option value="priority-desc">Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar (if items selected) */}
      {selectedTicketIds.length > 0 && (
        <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-red-700 dark:text-red-300">
              {selectedTicketIds.length} tickets selected
            </span>
            <button
              onClick={() => setSelectedTicketIds([])}
              className="text-neutral-500 hover:text-neutral-700 underline cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkStatus('in_progress')}
              className="px-2.5 py-1 bg-white dark:bg-[#181c24] border border-neutral-300 dark:border-neutral-700 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 cursor-pointer"
            >
              Mark In Progress
            </button>
            <button
              onClick={() => handleBulkStatus('resolved')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium cursor-pointer"
            >
              Mark Resolved
            </button>

            <select
              value={bulkAssignStaffId}
              onChange={(e) => {
                setBulkAssignStaffId(e.target.value);
                handleBulkAssign(e.target.value);
              }}
              className="px-2.5 py-1 bg-white dark:bg-[#181c24] border border-neutral-300 dark:border-neutral-700 rounded text-neutral-700 dark:text-neutral-300 focus:outline-none"
            >
              <option value="">Assign to Agent...</option>
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tickets Table / Queue View */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-[#181c24] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedTicketIds.length > 0 && selectedTicketIds.length === filteredTickets.length}
                    onChange={toggleSelectAll}
                    className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="py-3 px-3 w-24">Ticket ID</th>
                <th className="py-3 px-4 min-w-[280px]">Subject & Category</th>
                <th className="py-3 px-3 min-w-[160px]">Customer</th>
                <th className="py-3 px-3 w-24">Priority</th>
                <th className="py-3 px-3 w-28">Status</th>
                <th className="py-3 px-3 min-w-[140px]">Assignee</th>
                <th className="py-3 px-3 min-w-[120px]">Due / SLA</th>
                <th className="py-3 px-3 w-24 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    <LifeBuoy className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                      No tickets match the selected filters
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Try clearing search parameters or status tabs
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const isSelected = selectedTicketIds.includes(ticket.id);
                  return (
                    <tr
                      key={ticket.id}
                      className={`hover:bg-neutral-50/80 dark:hover:bg-[#181c24]/80 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTicket(ticket.id)}
                          className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                        />
                      </td>

                      {/* Ticket ID */}
                      <td
                        className="py-3 px-3 font-mono font-bold text-red-600 dark:text-red-400 whitespace-nowrap"
                        onClick={() => onNavigateTicketDetail(ticket.id)}
                      >
                        {ticket.id}
                      </td>

                      {/* Subject & Category */}
                      <td className="py-3 px-4" onClick={() => onNavigateTicketDetail(ticket.id)}>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                          {ticket.subject}
                        </p>
                        <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-0.5">
                          <span className="font-medium text-neutral-600 dark:text-neutral-400">
                            {ticket.categoryName}
                          </span>
                          {ticket.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-neutral-400">
                              · {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3" onClick={() => onNavigateTicketDetail(ticket.id)}>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {ticket.customerName}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">{ticket.customerCompany}</p>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={() => onNavigateTicketDetail(ticket.id)}>
                        {getPriorityBadge(ticket.priority)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={ticket.status}
                          onChange={(e) => onUpdateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                          className="text-[11px] font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer p-0"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <div className="mt-0.5">{getStatusBadge(ticket.status)}</div>
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-1.5">
                          {ticket.assignedStaffAvatar ? (
                            <img
                              src={ticket.assignedStaffAvatar}
                              alt={ticket.assignedStaffName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px]">
                              ?
                            </div>
                          )}
                          <select
                            value={ticket.assignedStaffId || ''}
                            onChange={(e) => onUpdateTicketAssignee(ticket.id, e.target.value)}
                            className="text-[11px] bg-transparent border-0 text-neutral-700 dark:text-neutral-300 focus:ring-0 cursor-pointer p-0 max-w-[100px] truncate"
                          >
                            <option value="">Unassigned</option>
                            {staffMembers.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name.split(' ')[0]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Due / SLA */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={() => onNavigateTicketDetail(ticket.id)}>
                        {ticket.isOverdue ? (
                          <div className="flex items-center space-x-1 text-red-600 font-semibold text-[11px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Overdue</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-neutral-500 tabular-nums flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>
                              {new Date(ticket.dueDate).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Created */}
                      <td
                        className="py-3 px-3 text-right text-neutral-400 text-[11px] tabular-nums whitespace-nowrap"
                        onClick={() => onNavigateTicketDetail(ticket.id)}
                      >
                        {new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-neutral-50 dark:bg-[#181c24] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing <strong className="text-neutral-900 dark:text-white tabular-nums">{filteredTickets.length}</strong> of{' '}
            <strong className="text-neutral-900 dark:text-white tabular-nums">{tickets.length}</strong> tickets
          </span>
          <span className="text-[11px]">Click any ticket row to open conversation & timeline</span>
        </div>
      </div>
    </div>
  );
};
