import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  CreditCard,
  UserCheck,
  Plus,
  ArrowRight,
  Globe,
  Sparkles,
  Phone,
  Mail,
  MoreVertical,
} from 'lucide-react';
import {
  BookingAppointment,
  StaffMember,
  ServiceItem,
  BookingStatus,
} from '../../types/booking';

interface DashboardModuleProps {
  appointments: BookingAppointment[];
  staff: StaffMember[];
  services: ServiceItem[];
  onNavigateModule: (moduleName: any) => void;
  onOpenCreateBooking: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onSelectAppointment: (appointment: BookingAppointment) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  appointments,
  staff,
  services,
  onNavigateModule,
  onOpenCreateBooking,
  onUpdateStatus,
  onSelectAppointment,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculated Metrics
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = appointments.filter((a) => a.date >= todayStr && a.status !== 'cancelled' && a.status !== 'completed');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');
  const cancelledAppointments = appointments.filter((a) => a.status === 'cancelled' || a.status === 'no_show');

  // Revenue Calculations in KES
  const totalRevenueKes = appointments
    .filter((a) => a.status === 'completed' || a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.priceKes, 0);

  const todayRevenueKes = todayAppointments
    .filter((a) => a.paymentStatus === 'paid' || a.paymentStatus === 'deposit_paid')
    .reduce((sum, a) => sum + (a.paymentStatus === 'paid' ? a.priceKes : a.depositAmountKes), 0);

  const pendingPaymentsKes = appointments
    .filter((a) => a.status !== 'cancelled' && (a.paymentStatus === 'pending' || a.paymentStatus === 'deposit_paid'))
    .reduce((sum, a) => sum + (a.priceKes - (a.paymentStatus === 'deposit_paid' ? a.depositAmountKes : 0)), 0);

  // Available Time Slots estimate based on staff count and active hours
  const activeStaffCount = staff.filter((s) => s.status === 'available').length;
  const estimatedAvailableSlots = Math.max(0, activeStaffCount * 8 - todayAppointments.length);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Launcher */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Service Operations &amp; Appointments Cockpit
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Live Scheduler Active
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time tracking of client reservations, staff specialist allocations, and M-Pesa receipts in Kenyan Shillings (KES).
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigateModule('online_booking')}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-red-600" />
            <span>Public Booking Link</span>
          </button>
          <button
            onClick={onOpenCreateBooking}
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* KPI 6-Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Today's Appointments */}
        <div
          onClick={() => onNavigateModule('bookings')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Today's Bookings</span>
            <Calendar className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {todayAppointments.length}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">Active scheduled</p>
        </div>

        {/* 2. Upcoming Appointments */}
        <div
          onClick={() => onNavigateModule('calendar')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Upcoming</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {upcomingAppointments.length}
          </p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Next 14 days</p>
        </div>

        {/* 3. Completed Appointments */}
        <div
          onClick={() => onNavigateModule('bookings')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {completedAppointments.length}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Fulfilled</p>
        </div>

        {/* 4. Cancelled & No-shows */}
        <div
          onClick={() => onNavigateModule('bookings')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Cancelled / No-show</span>
            <XCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {cancelledAppointments.length}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Released slots</p>
        </div>

        {/* 5. Revenue in KES */}
        <div
          onClick={() => onNavigateModule('payments')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            KES {totalRevenueKes.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            +KES {todayRevenueKes.toLocaleString()} today
          </p>
        </div>

        {/* 6. Available Time Slots */}
        <div
          onClick={() => onNavigateModule('calendar')}
          className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Available Slots</span>
            <UserCheck className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {estimatedAvailableSlots}
          </p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">{activeStaffCount} active staff</p>
        </div>
      </div>

      {/* Main Split Grid: Today's Schedule & Staff Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Appointments Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Today's Appointment Schedule
              </h3>
            </div>
            <button
              onClick={() => onNavigateModule('calendar')}
              className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
              <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                No appointments scheduled for today yet.
              </p>
              <button
                onClick={onOpenCreateBooking}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Schedule First Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 p-2 rounded-lg transition-colors"
                >
                  {/* Left: Time & Info */}
                  <div className="flex items-start space-x-3">
                    <div className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-bold shrink-0">
                      {apt.startTime}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          {apt.customerName}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ({apt.id})
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {apt.serviceName} · <span className="font-medium text-neutral-800 dark:text-neutral-300">{apt.staffName}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center space-x-2">
                        <span>KES {apt.priceKes.toLocaleString()}</span>
                        <span>•</span>
                        <span className="capitalize">{apt.source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill & Inline Action Buttons */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'confirmed'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : apt.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : apt.status === 'cancelled'
                          ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      {apt.status}
                    </span>

                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'completed')}
                          title="Mark Completed"
                          className="p-1 rounded text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'cancelled')}
                          title="Cancel Booking"
                          className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onSelectAppointment(apt)}
                      className="px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 bg-neutral-100 dark:bg-neutral-800 rounded transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Staff Roster & Service Breakdown */}
        <div className="space-y-6">
          {/* Active Staff Today */}
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Specialists on Duty Today
              </h3>
              <button
                onClick={() => onNavigateModule('staff')}
                className="text-xs text-red-600 hover:underline"
              >
                Manage Staff
              </button>
            </div>

            <div className="space-y-3">
              {staff.map((s) => {
                const staffAppointmentsCount = todayAppointments.filter((a) => a.staffId === s.id).length;
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800/80 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                      />
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-neutral-500">{s.title}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">
                        {staffAppointmentsCount}
                      </span>{' '}
                      <span className="text-neutral-400 text-[10px]">appts</span>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize">
                        {s.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick M-Pesa / Financial Summary */}
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Receivables Reconciliation (KES)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span>Today's Settled Revenue:</span>
                <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                  KES {todayRevenueKes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span>Outstanding Balance on Open Bookings:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  KES {pendingPaymentsKes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span>Safaricom Paybill:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">889210</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('payments')}
              className="w-full mt-2 py-1.5 text-xs font-semibold text-center text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
            >
              View Payment Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
