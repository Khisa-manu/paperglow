import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import {
  BookingAppointment,
  StaffMember,
  ServiceItem,
  BookingStatus,
} from '../../types/booking';

interface BookingsListModuleProps {
  appointments: BookingAppointment[];
  staff: StaffMember[];
  services: ServiceItem[];
  onOpenCreateBooking: () => void;
  onSelectAppointment: (appointment: BookingAppointment) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

export const BookingsListModule: React.FC<BookingsListModuleProps> = ({
  appointments,
  staff,
  services,
  onOpenCreateBooking,
  onSelectAppointment,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Status filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      // Staff filter
      if (staffFilter !== 'all' && apt.staffId !== staffFilter) return false;

      // Date filter
      if (dateFilter === 'today' && apt.date !== todayStr) return false;
      if (dateFilter === 'upcoming' && apt.date < todayStr) return false;
      if (dateFilter === 'past' && apt.date >= todayStr) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = apt.id.toLowerCase().includes(q);
        const matchesCustomer = apt.customerName.toLowerCase().includes(q);
        const matchesPhone = apt.customerPhone.toLowerCase().includes(q);
        const matchesService = apt.serviceName.toLowerCase().includes(q);
        const matchesStaff = apt.staffName.toLowerCase().includes(q);
        if (!matchesId && !matchesCustomer && !matchesPhone && !matchesService && !matchesStaff) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort by date and start time descending
      return new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime();
    });
  }, [appointments, statusFilter, staffFilter, dateFilter, searchQuery, todayStr]);

  const handleExportCSV = () => {
    alert(`Exporting ${filteredAppointments.length} appointments to CSV spreadsheet.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            All Appointments &amp; Reservations
          </h2>
          <p className="text-xs text-neutral-500">
            View, verify, reschedule, or cancel client bookings with real-time status tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenCreateBooking}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, client or service..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No-Show</option>
          </select>

          {/* Staff Filter */}
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
          >
            <option value="all">All Specialists</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Today Only</option>
            <option value="upcoming">Upcoming (Future)</option>
            <option value="past">Past / Completed</option>
          </select>
        </div>

        {/* Active Results Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span>
            Showing <strong>{filteredAppointments.length}</strong> matching appointments
          </span>
          {(statusFilter !== 'all' || staffFilter !== 'all' || dateFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setStaffFilter('all');
                setDateFilter('all');
                setSearchQuery('');
              }}
              className="text-red-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-medium uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service &amp; Duration</th>
                <th className="px-4 py-3">Specialist</th>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Price (KES)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-700 dark:text-neutral-300">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No appointments found matching your selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                  >
                    {/* Booking ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-neutral-900 dark:text-white">
                      {apt.id}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-neutral-900 dark:text-white">
                        {apt.customerName}
                      </div>
                      <div className="text-[11px] text-neutral-500">{apt.customerPhone}</div>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {apt.serviceName}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {apt.serviceDuration} mins
                      </div>
                    </td>

                    {/* Specialist */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{apt.staffName}</span>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3.5 font-mono">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {apt.date}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {apt.startTime} – {apt.endTime}
                      </div>
                    </td>

                    {/* Price & Payment */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-neutral-900 dark:text-white tabular-nums">
                        KES {apt.priceKes.toLocaleString()}
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase mt-0.5 ${
                          apt.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : apt.paymentStatus === 'deposit_paid'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {apt.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Status Select Inline */}
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={apt.status}
                        onChange={(e) => onUpdateStatus(apt.id, e.target.value as BookingStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-md border cursor-pointer focus:outline-none ${
                          apt.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                            : apt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : apt.status === 'cancelled'
                            ? 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                            : apt.status === 'no_show'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No-Show</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectAppointment(apt)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-red-600 bg-neutral-100 dark:bg-neutral-800 rounded transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
