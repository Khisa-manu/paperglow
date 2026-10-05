import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  User,
  Building,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import {
  MaintenanceTicket,
  Property,
  Unit,
  Tenant,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus,
} from '../../types/propertyManager';

interface PMMaintenanceModuleProps {
  tickets: MaintenanceTicket[];
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  onAddTicket: (newTicket: Omit<MaintenanceTicket, 'id' | 'ticketNumber'>) => void;
  onUpdateTicketStatus: (
    ticketId: string,
    status: MaintenanceStatus,
    actualCost?: number
  ) => void;
}

export const PMMaintenanceModule: React.FC<PMMaintenanceModuleProps> = ({
  tickets,
  properties,
  units,
  tenants,
  onAddTicket,
  onUpdateTicketStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | MaintenanceStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | MaintenancePriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<MaintenanceTicket | null>(null);

  // Form State
  const [ticketForm, setTicketForm] = useState<{
    propertyId: string;
    unitId: string;
    tenantId: string;
    title: string;
    description: string;
    category: MaintenanceCategory;
    priority: MaintenancePriority;
    assignedTo: string;
    estimatedCostKes: number;
  }>({
    propertyId: properties[0]?.id || '',
    unitId: '',
    tenantId: '',
    title: '',
    description: '',
    category: 'plumbing',
    priority: 'high',
    assignedTo: 'Fundi Juma Plumbing Services',
    estimatedCostKes: 5000,
  });

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredTickets = tickets.filter((t) => {
    const statusMatch = statusFilter === 'all' || t.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter;
    const prop = properties.find((p) => p.id === t.propertyId);
    const unit = units.find((u) => u.id === t.unitId);
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !searchQuery ||
      t.title.toLowerCase().includes(q) ||
      t.ticketNumber.toLowerCase().includes(q) ||
      t.assignedTo.toLowerCase().includes(q) ||
      (prop && prop.name.toLowerCase().includes(q)) ||
      (unit && unit.unitNumber.toLowerCase().includes(q));

    return statusMatch && priorityMatch && searchMatch;
  });

  const totalEstimated = tickets.reduce((sum, t) => sum + t.estimatedCostKes, 0);
  const totalActual = tickets.reduce((sum, t) => sum + t.actualCostKes, 0);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.propertyId || !ticketForm.unitId || !ticketForm.title) return;

    onAddTicket({
      propertyId: ticketForm.propertyId,
      unitId: ticketForm.unitId,
      tenantId: ticketForm.tenantId || undefined,
      title: ticketForm.title,
      description: ticketForm.description,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'reported',
      assignedTo: ticketForm.assignedTo,
      estimatedCostKes: Number(ticketForm.estimatedCostKes) || 0,
      actualCostKes: 0,
      reportedDate: new Date().toISOString().split('T')[0],
    });

    setIsNewTicketModalOpen(false);
    setTicketForm({
      propertyId: properties[0]?.id || '',
      unitId: '',
      tenantId: '',
      title: '',
      description: '',
      category: 'plumbing',
      priority: 'high',
      assignedTo: 'Fundi Juma Plumbing Services',
      estimatedCostKes: 5000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Maintenance &amp; Contractor Fundi Hub
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Log plumbing, electrical, borehole pump issues, assign technicians, and track actual repair expenditures.
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Maintenance Request</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">Open Tickets</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            {tickets.filter((t) => t.status !== 'resolved').length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            {tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length} urgent
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">In Progress with Fundis</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {tickets.filter((t) => t.status === 'in_progress').length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Contractors on site</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">Resolved to Date</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {tickets.filter((t) => t.status === 'resolved').length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Fully signed off</div>
        </div>

        <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500">Actual Repairs Cost</div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums truncate">
            {formatKes(totalActual)}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            Est. Budget: {formatKes(totalEstimated)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by issue, unit, fundi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              All ({tickets.length})
            </button>
            <button
              onClick={() => setStatusFilter('reported')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                statusFilter === 'reported'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              Reported ({tickets.filter((t) => t.status === 'reported').length})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                statusFilter === 'in_progress'
                  ? 'bg-white dark:bg-neutral-900 text-amber-700 dark:text-amber-400 font-semibold shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              In Progress ({tickets.filter((t) => t.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                statusFilter === 'resolved'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              Resolved ({tickets.filter((t) => t.status === 'resolved').length})
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 text-xs">
            No maintenance tickets found for this filter.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const prop = properties.find((p) => p.id === ticket.propertyId);
            const unit = units.find((u) => u.id === ticket.unitId);
            const tenant = tenants.find((t) => t.id === ticket.tenantId);

            return (
              <div
                key={ticket.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {ticket.ticketNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold uppercase text-[10px] ${
                        ticket.priority === 'urgent'
                          ? 'text-red-600 dark:text-red-400'
                          : ticket.priority === 'high'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-neutral-500'
                      }`}
                    >
                      {ticket.priority} priority
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-500 uppercase text-[10px]">
                      {ticket.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 pt-1">
                    <span>
                      <strong>Location:</strong> {prop?.name} (Unit {unit?.unitNumber})
                    </span>
                    {tenant && (
                      <span>
                        <strong>Tenant:</strong> {tenant.name} ({tenant.phone})
                      </span>
                    )}
                    <span>
                      <strong>Assigned:</strong> {ticket.assignedTo}
                    </span>
                    <span>
                      <strong>Reported:</strong> {ticket.reportedDate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-2 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {ticket.actualCostKes > 0 ? formatKes(ticket.actualCostKes) : formatKes(ticket.estimatedCostKes)}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {ticket.actualCostKes > 0 ? 'Actual Invoiced' : 'Estimated Cost'}
                    </div>
                  </div>

                  {/* Status Control Actions */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as MaintenanceStatus;
                        const cost =
                          newStatus === 'resolved' && ticket.actualCostKes === 0
                            ? ticket.estimatedCostKes
                            : ticket.actualCostKes;
                        onUpdateTicketStatus(ticket.id, newStatus, cost);
                      }}
                      className="text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                    >
                      <option value="reported">Reported</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved / Signed</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Maintenance Ticket */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Log Maintenance Request
              </h3>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Property *
                  </label>
                  <select
                    value={ticketForm.propertyId}
                    onChange={(e) => setTicketForm({ ...ticketForm, propertyId: e.target.value })}
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
                    required
                    value={ticketForm.unitId}
                    onChange={(e) => {
                      const u = units.find((x) => x.id === e.target.value);
                      setTicketForm({
                        ...ticketForm,
                        unitId: e.target.value,
                        tenantId: u?.currentTenantId || '',
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="">Select unit...</option>
                    {units
                      .filter((u) => u.propertyId === ticketForm.propertyId)
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
                  Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  placeholder="e.g. Master bathroom mixer tap leaking"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Details &amp; Diagnosis
                </label>
                <textarea
                  rows={2}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Describe problem observed, leak location, symptoms..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Trade Category
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, category: e.target.value as MaintenanceCategory })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="plumbing">Plumbing &amp; Water Pipes</option>
                    <option value="electrical">Electrical &amp; Lighting</option>
                    <option value="borehole_water">Borehole &amp; Booster Pump</option>
                    <option value="painting_structure">Carpentry &amp; Painting</option>
                    <option value="appliance">Kitchen Appliance / Water Heater</option>
                    <option value="security">Gate Motor &amp; Electric Fence</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, priority: e.target.value as MaintenancePriority })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="urgent">Urgent (Same Day Response)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (Routine Upkeep)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Assign Technician / Contractor
                  </label>
                  <input
                    type="text"
                    value={ticketForm.assignedTo}
                    onChange={(e) => setTicketForm({ ...ticketForm, assignedTo: e.target.value })}
                    placeholder="e.g. Fundi Juma Plumbing"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Estimated Cost (KES)
                  </label>
                  <input
                    type="number"
                    value={ticketForm.estimatedCostKes}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, estimatedCostKes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
