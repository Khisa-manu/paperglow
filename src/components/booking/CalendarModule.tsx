import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from 'lucide-react';
import {
  BookingAppointment,
  StaffMember,
  ServiceItem,
  BookingStatus,
} from '../../types/booking';

interface CalendarModuleProps {
  appointments: BookingAppointment[];
  staff: StaffMember[];
  services: ServiceItem[];
  onOpenCreateBooking: (initialDate?: string, initialTime?: string, initialStaffId?: string) => void;
  onSelectAppointment: (appointment: BookingAppointment) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({
  appointments,
  staff,
  services,
  onOpenCreateBooking,
  onSelectAppointment,
  onUpdateStatus,
  onReschedule,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [reschedulingApt, setReschedulingApt] = useState<BookingAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Date formatters
  const formatDateKey = (date: Date): string => date.toISOString().split('T')[0];
  const currentDateKey = formatDateKey(currentDate);

  // Time grid slots (08:00 to 19:00 hourly or half-hourly)
  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  ];

  // Helper to shift dates
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get week dates for current week view (Monday to Sunday)
  const getWeekDates = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (selectedStaffId !== 'all' && apt.staffId !== selectedStaffId) return false;
    return true;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-600 text-white border-blue-700';
      case 'completed':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'cancelled':
        return 'bg-neutral-400 text-white border-neutral-500 line-through';
      case 'no_show':
        return 'bg-red-700 text-white border-red-800';
      default:
        return 'bg-amber-500 text-white border-amber-600';
    }
  };

  const handleConfirmReschedule = () => {
    if (reschedulingApt && rescheduleDate && rescheduleTime) {
      onReschedule(reschedulingApt.id, rescheduleDate, rescheduleTime);
      setReschedulingApt(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        {/* Date Navigation & Label */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tracking-tight">
            {viewMode === 'day' &&
              currentDate.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {viewMode === 'week' && (
              <>
                {weekDates[0].toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })} –{' '}
                {weekDates[6].toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
              </>
            )}
            {viewMode === 'month' &&
              currentDate.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Staff Filter Dropdown */}
          <div className="flex items-center space-x-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1">
            <User className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="text-xs bg-transparent border-none text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Specialists ({staff.length})</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.title})
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-[#12151b] text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-[#12151b] text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-[#12151b] text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Month
            </button>
          </div>

          {/* Quick Book */}
          <button
            onClick={() => onOpenCreateBooking(currentDateKey)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* VIEW: WEEK VIEW (Primary Service Salon / Studio Calendar Layout) */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Header Row */}
            <div className="grid grid-cols-8 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="p-3 text-center font-mono font-medium border-r border-neutral-200 dark:border-neutral-800">
                Time
              </div>
              {weekDates.map((day) => {
                const dayKey = formatDateKey(day);
                const isToday = dayKey === formatDateKey(new Date());
                const countForDay = filteredAppointments.filter((a) => a.date === dayKey).length;
                return (
                  <div
                    key={dayKey}
                    className={`p-3 text-center border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 ${
                      isToday ? 'bg-red-50/40 dark:bg-red-950/20 font-bold text-red-600 dark:text-red-400' : ''
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wider">
                      {day.toLocaleDateString('en-KE', { weekday: 'short' })}
                    </div>
                    <div className="text-sm mt-0.5 font-bold font-['Poppins']">
                      {day.getDate()}
                    </div>
                    {countForDay > 0 && (
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full text-[9px] bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                        {countForDay} appts
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Slots Rows */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 min-h-[58px]">
                  {/* Time indicator column */}
                  <div className="p-2 text-center text-xs font-mono text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 self-center">
                    {time}
                  </div>

                  {/* 7 Day cells */}
                  {weekDates.map((day) => {
                    const dayKey = formatDateKey(day);
                    // Match appointments in this time block (starts with this hour or slot)
                    const aptsInSlot = filteredAppointments.filter((a) => {
                      if (a.date !== dayKey) return false;
                      return a.startTime === time;
                    });

                    return (
                      <div
                        key={`${dayKey}-${time}`}
                        onClick={() => {
                          if (aptsInSlot.length === 0) {
                            onOpenCreateBooking(dayKey, time, selectedStaffId !== 'all' ? selectedStaffId : undefined);
                          }
                        }}
                        className="p-1 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 relative hover:bg-neutral-50/80 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer group"
                      >
                        {aptsInSlot.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAppointment(apt);
                            }}
                            className={`p-1.5 rounded text-[11px] mb-1 border shadow-xs cursor-pointer transition-transform hover:scale-[1.01] ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            <div className="flex items-center justify-between font-bold leading-tight">
                              <span className="truncate">{apt.customerName}</span>
                              <span className="text-[9px] font-mono opacity-85 ml-1">{apt.startTime}</span>
                            </div>
                            <div className="truncate text-[10px] opacity-90">{apt.serviceName}</div>
                            <div className="text-[9px] opacity-80 flex items-center justify-between mt-1">
                              <span>{apt.staffName.split(' ')[0]}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReschedulingApt(apt);
                                  setRescheduleDate(apt.date);
                                  setRescheduleTime(apt.startTime);
                                }}
                                title="Reschedule"
                                className="underline hover:opacity-100 text-[9px]"
                              >
                                Move
                              </button>
                            </div>
                          </div>
                        ))}

                        {aptsInSlot.length === 0 && (
                          <div className="hidden group-hover:flex items-center justify-center h-full text-neutral-300 dark:text-neutral-700 text-xs">
                            <Plus className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DAY VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="space-y-3">
            {timeSlots.map((time) => {
              const aptsAtTime = filteredAppointments.filter(
                (a) => a.date === currentDateKey && a.startTime === time
              );

              return (
                <div
                  key={time}
                  className="flex items-start space-x-4 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="w-16 font-mono font-bold text-xs text-neutral-500 pt-1 shrink-0">
                    {time}
                  </div>

                  <div className="flex-1">
                    {aptsAtTime.length === 0 ? (
                      <button
                        onClick={() => onOpenCreateBooking(currentDateKey, time)}
                        className="text-xs text-neutral-400 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Empty Slot — Click to Book Appointment</span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {aptsAtTime.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => onSelectAppointment(apt)}
                            className={`p-3 rounded-lg border shadow-xs cursor-pointer ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>{apt.customerName}</span>
                              <span className="text-xs uppercase">{apt.status}</span>
                            </div>
                            <div className="text-xs mt-1">{apt.serviceName}</div>
                            <div className="text-[11px] opacity-85 mt-2 flex items-center justify-between">
                              <span>Specialist: {apt.staffName}</span>
                              <span>KES {apt.priceKes.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          {/* Days grid of current month */}
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="p-2 text-center text-xs font-bold text-neutral-500 uppercase">
                {d}
              </div>
            ))}

            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
              const key = formatDateKey(dateObj);
              const aptsForDay = filteredAppointments.filter((a) => a.date === key);

              return (
                <div
                  key={key}
                  onClick={() => {
                    setCurrentDate(dateObj);
                    setViewMode('day');
                  }}
                  className={`min-h-[90px] p-2 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:border-red-500/50 transition-colors cursor-pointer flex flex-col justify-between ${
                    key === formatDateKey(new Date()) ? 'bg-red-50/20 dark:bg-red-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {dayNum}
                    </span>
                    {aptsForDay.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">
                        {aptsForDay.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {aptsForDay.slice(0, 2).map((a) => (
                      <div
                        key={a.id}
                        className="text-[10px] truncate px-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {a.startTime} {a.customerName}
                      </div>
                    ))}
                    {aptsForDay.length > 2 && (
                      <div className="text-[9px] text-neutral-400">+{aptsForDay.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Reschedule Appointment ({reschedulingApt.id})
            </h3>
            <p className="text-xs text-neutral-500">
              Moving {reschedulingApt.customerName}'s booking for <strong>{reschedulingApt.serviceName}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  New Appointment Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  New Start Time Slot
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setReschedulingApt(null)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
