import React, { useState, useMemo } from 'react';
import {
  Appointment,
  Patient,
  StaffMember,
  MedicalService,
  AppointmentStatus,
  AppointmentType,
} from '../../types/clinicManager';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bell,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface AppointmentsModuleProps {
  appointments: Appointment[];
  patients: Patient[];
  staff: StaffMember[];
  services: MedicalService[];
  onOpenBookAppointment: () => void;
  onUpdateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onSendAppointmentReminder: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

export const AppointmentsModule: React.FC<AppointmentsModuleProps> = ({
  appointments,
  patients,
  staff,
  services,
  onOpenBookAppointment,
  onUpdateAppointmentStatus,
  onSendAppointmentReminder,
  onCancelAppointment,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [practitionerFilter, setPractitionerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const datesList = useMemo(() => {
    const dates = Array.from(new Set(appointments.map((a) => a.date))).sort();
    return ['all', ...dates];
  }, [appointments]);

  const practitionersList = useMemo(() => {
    return staff.filter((s) => s.role.includes('Doctor') || s.role.includes('Clinical Officer'));
  }, [staff]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesDate = selectedDate === 'all' || a.date === selectedDate;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesPractitioner =
        practitionerFilter === 'all' || a.practitionerId === practitionerFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        a.patientName.toLowerCase().includes(q) ||
        a.appointmentNumber.toLowerCase().includes(q) ||
        a.patientPhone.includes(q) ||
        a.serviceName.toLowerCase().includes(q);

      return matchesDate && matchesStatus && matchesPractitioner && matchesSearch;
    });
  }, [appointments, selectedDate, statusFilter, practitionerFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-red-600" />
            <span>Outpatient Appointments &amp; Scheduling</span>
          </h2>
          <p className="text-xs text-neutral-500">
            {appointments.length} total appointments &middot; Synchronized with doctor consulting room rosters
          </p>
        </div>

        <button
          onClick={onOpenBookAppointment}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, phone, appointment #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            <option value="all">All Dates</option>
            {datesList
              .filter((d) => d !== 'all')
              .map((d) => (
                <option key={d} value={d}>
                  {d} {d === '2026-10-06' ? '(Today)' : ''}
                </option>
              ))}
          </select>

          <select
            value={practitionerFilter}
            onChange={(e) => setPractitionerFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            <option value="all">All Practitioners</option>
            {practitionersList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_queue">In Queue / Arrived</option>
            <option value="in_consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List View */}
      <div className="rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Appointment #</th>
                <th className="py-3 px-4 font-semibold">Date &amp; Slot</th>
                <th className="py-3 px-4 font-semibold">Patient Details</th>
                <th className="py-3 px-4 font-semibold">Doctor &amp; Service</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Notes</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No matching appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40">
                    <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                      {apt.appointmentNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{apt.date}</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {apt.timeSlot} ({apt.type})
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                        {apt.patientName}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {apt.patientPhone} &middot; <span className="font-mono">{apt.patientNumber}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100 block">
                        {apt.practitionerName}
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        {apt.serviceName}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          apt.status === 'in_consultation'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : apt.status === 'confirmed'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                            : apt.status === 'in_queue'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {apt.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-[200px] truncate text-neutral-500" title={apt.notes}>
                      {apt.notes || '—'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {apt.status === 'scheduled' && (
                          <button
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                            className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => onSendAppointmentReminder(apt)}
                          className="p-1 rounded text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          title="Send SMS/App Reminder"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            onClick={() => onCancelAppointment(apt.id)}
                            className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
