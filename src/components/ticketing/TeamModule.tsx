import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Mail,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { StaffMember, Ticket } from '../../types/ticketing';

interface TeamModuleProps {
  staffMembers: StaffMember[];
  tickets: Ticket[];
  onAddStaffMember: (newStaff: Omit<StaffMember, 'id' | 'activeTicketsCount' | 'resolvedCount' | 'avgResolutionHours'>) => void;
  onUpdateStaffStatus: (staffId: string, status: StaffMember['status']) => void;
  onReassignTicket: (ticketId: string, newStaffId: string) => void;
  onNavigateTicketDetail: (ticketId: string) => void;
}

export const TeamModule: React.FC<TeamModuleProps> = ({
  staffMembers,
  tickets,
  onAddStaffMember,
  onUpdateStaffStatus,
  onReassignTicket,
  onNavigateTicketDetail,
}) => {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // New Staff Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Tier-1 Agent');
  const [department, setDepartment] = useState<StaffMember['department']>('Customer Care');
  const [maxCapacity, setMaxCapacity] = useState('10');

  const selectedStaff = staffMembers.find((s) => s.id === selectedStaffId);
  const staffTickets = selectedStaff
    ? tickets.filter((t) => t.assignedStaffId === selectedStaff.id)
    : [];

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddStaffMember({
      name,
      email,
      phone: phone || '+254 712 345 678',
      role,
      department,
      status: 'online',
      maxCapacity: parseInt(maxCapacity) || 10,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    });

    setIsAddStaffOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
            Support Team & Workload Overview
          </h2>
          <p className="text-xs text-neutral-500">
            Staff accounts, active ticket assignments, availability status, and workload capacity management
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staffMembers.map((staff) => {
          const activeCount = tickets.filter(
            (t) => t.assignedStaffId === staff.id && t.status !== 'resolved' && t.status !== 'closed'
          ).length;
          const capacityPercent = Math.min(Math.round((activeCount / staff.maxCapacity) * 100), 100);

          return (
            <div
              key={staff.id}
              className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#12151b] ${
                        staff.status === 'online'
                          ? 'bg-emerald-500'
                          : staff.status === 'busy'
                          ? 'bg-amber-500'
                          : 'bg-neutral-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {staff.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500">{staff.role}</p>
                    <p className="text-[10px] text-neutral-400">{staff.department}</p>
                  </div>
                </div>

                {/* Status Selector */}
                <select
                  value={staff.status}
                  onChange={(e) => onUpdateStaffStatus(staff.id, e.target.value as StaffMember['status'])}
                  className="text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded px-1.5 py-0.5 border-0 focus:ring-0 cursor-pointer capitalize"
                >
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* Workload Capacity Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 text-[11px]">Workload Load</span>
                  <span className="font-semibold tabular-nums text-neutral-800 dark:text-neutral-200">
                    {activeCount} / {staff.maxCapacity} ({capacityPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      capacityPercent >= 90
                        ? 'bg-red-600'
                        : capacityPercent >= 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(capacityPercent, 6)}%` }}
                  />
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px]">
                <div>
                  <span className="text-neutral-400 block">Resolved</span>
                  <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                    {staff.resolvedCount}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Avg Time</span>
                  <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                    {staff.avgResolutionHours}h
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStaffId(staff.id)}
                className="w-full py-1.5 text-xs font-semibold text-center border border-neutral-200 dark:border-neutral-800 hover:border-red-600 dark:hover:border-red-500 text-neutral-700 dark:text-neutral-300 hover:text-red-600 rounded transition-colors cursor-pointer"
              >
                Inspect Assigned Queue
              </button>
            </div>
          );
        })}
      </div>

      {/* Staff Assigned Tickets Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStaff.avatar}
                  alt={selectedStaff.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {selectedStaff.name}'s Assigned Queue
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {staffTickets.length} tickets currently assigned · {selectedStaff.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaffId(null)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {staffTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No tickets currently assigned to this agent.
                </div>
              ) : (
                staffTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => {
                        setSelectedStaffId(null);
                        onNavigateTicketDetail(t.id);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-red-600 dark:text-red-400">
                          {t.id}
                        </span>
                        <span className="text-neutral-400">·</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {t.subject}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {t.customerName} ({t.customerCompany})
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <select
                        value={t.assignedStaffId || ''}
                        onChange={(e) => onReassignTicket(t.id, e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-[#12151b] border border-neutral-300 dark:border-neutral-700 rounded text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none"
                      >
                        {staffMembers.map((s) => (
                          <option key={s.id} value={s.id}>
                            Reassign to: {s.name.split(' ')[0]}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setSelectedStaffId(null);
                          onNavigateTicketDetail(t.id);
                        }}
                        className="p-1 text-red-600 hover:text-red-700 cursor-pointer"
                        title="View details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Member Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Invite Support Team Member
              </h3>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Mutiso"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Company Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samuel@paperglow.co.ke"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Role / Access Level</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffMember['role'])}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                >
                  <option value="Support Lead">Support Lead (Admin & Escalation)</option>
                  <option value="Senior Support Engineer">Senior Support Engineer (P1 Technical)</option>
                  <option value="Tier-1 Agent">Tier-1 Agent (General Queue)</option>
                  <option value="Billing Specialist">Billing Specialist (KRA / Invoicing)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as StaffMember['department'])}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                >
                  <option value="Customer Care">Customer Care</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing & Accounts">Billing & Accounts</option>
                  <option value="Product Operations">Product Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Max Active Ticket Capacity</label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
