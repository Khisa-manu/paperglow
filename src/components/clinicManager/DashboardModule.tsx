import React from 'react';
import {
  ClinicProfile,
  Patient,
  Appointment,
  QueueItem,
  ConsultationRecord,
  StaffMember,
  Invoice,
  ClinicNotification,
  ClinicModule,
} from '../../types/clinicManager';
import {
  CalendarDays,
  Users,
  Clock,
  ClipboardCheck,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Activity,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface DashboardModuleProps {
  clinic: ClinicProfile;
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueItem[];
  consultations: ConsultationRecord[];
  staff: StaffMember[];
  invoices: Invoice[];
  notifications: ClinicNotification[];
  onNavigateModule: (module: ClinicModule) => void;
  onOpenRegisterPatient: () => void;
  onOpenBookAppointment: () => void;
  onSelectPatient: (patientId: string) => void;
  onAdvanceQueueItem: (queueId: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  clinic,
  patients,
  appointments,
  queue,
  consultations,
  staff,
  invoices,
  notifications,
  onNavigateModule,
  onOpenRegisterPatient,
  onOpenBookAppointment,
  onSelectPatient,
  onAdvanceQueueItem,
}) => {
  const todayStr = '2026-10-06';

  // Metrics
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const waitingQueue = queue.filter((q) => q.stage === 'waiting' || q.stage === 'triage');
  const inConsultationQueue = queue.filter((q) => q.stage === 'in_consultation');
  const todayConsultations = consultations.filter((c) => c.date === todayStr);

  const totalRevenueCollectedKes = invoices.reduce((sum, inv) => sum + inv.amountPaidKes, 0);
  const totalOutstandingBalanceKes = invoices.reduce((sum, inv) => sum + inv.balanceKes, 0);
  const activeStaffOnDuty = staff.filter((s) => s.onDuty);

  const unreadAlerts = notifications.filter((n) => !n.isRead);

  return (
    <div className="space-y-6">
      {/* Top Banner with Today's Operational Status */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-neutral-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-[11px] font-semibold text-red-100 bg-white/15 px-2.5 py-0.5 rounded-full">
            <span>KMPDC Ambulatory Facility</span>
            <span>&middot;</span>
            <span>Outpatient Cockpit Live</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Poppins'] tracking-tight">
            {clinic.name}
          </h1>
          <p className="text-xs text-red-100 max-w-2xl leading-relaxed">
            {clinic.tagline}. Operating hours: {clinic.workingHours}. Standard consultation KES {clinic.defaultConsultationFeeKes.toLocaleString()}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <button
            onClick={onOpenRegisterPatient}
            className="px-3.5 py-2 rounded-lg bg-white text-red-700 hover:bg-neutral-100 text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Patient</span>
          </button>
          <button
            onClick={onOpenBookAppointment}
            className="px-3.5 py-2 rounded-lg bg-red-900/60 hover:bg-red-900/90 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer border border-white/20"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 text-xs">
        {/* Stat 1: Today's Appointments */}
        <div
          onClick={() => onNavigateModule('appointments')}
          className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-red-300 dark:hover:border-red-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[11px] font-medium">Appointments</span>
            <CalendarDays className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
            {todayAppointments.length}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">
            Today&apos;s outpatient schedule
          </span>
        </div>

        {/* Stat 2: Queue Waiting */}
        <div
          onClick={() => onNavigateModule('queue')}
          className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-400 mb-1">
            <span className="text-[11px] font-semibold">Waiting Queue</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-amber-900 dark:text-amber-200 tabular-nums">
            {waitingQueue.length}
          </div>
          <span className="text-[10px] text-amber-700/80 dark:text-amber-400 block mt-0.5">
            {inConsultationQueue.length} in doctor room
          </span>
        </div>

        {/* Stat 3: Total Patients */}
        <div
          onClick={() => onNavigateModule('patients')}
          className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-red-300 dark:hover:border-red-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[11px] font-medium">Registered Patients</span>
            <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
            {patients.length}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">
            Active medical dossiers
          </span>
        </div>

        {/* Stat 4: Consultations Done */}
        <div
          onClick={() => onNavigateModule('consultations')}
          className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-red-300 dark:hover:border-red-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[11px] font-medium">Consultations</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
            {todayConsultations.length}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-medium">
            Logged in EHR today
          </span>
        </div>

        {/* Stat 5: Revenue Collected in KES */}
        <div
          onClick={() => onNavigateModule('billing')}
          className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-red-300 dark:hover:border-red-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[11px] font-medium">Revenue (KES)</span>
            <TrendingUp className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-black font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums truncate">
            KES {totalRevenueCollectedKes.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">
            M-Pesa, Cash &amp; Insurance
          </span>
        </div>

        {/* Stat 6: Outstanding Bills in KES */}
        <div
          onClick={() => onNavigateModule('billing')}
          className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:border-red-300 dark:hover:border-red-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[11px] font-medium">Outstanding (KES)</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black font-['Poppins'] text-amber-600 dark:text-amber-400 tabular-nums truncate">
            KES {totalOutstandingBalanceKes.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">
            Unsettled copays / claims
          </span>
        </div>
      </div>

      {/* Main Grid: Live Queue & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Live Reception & Triage Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Queue Cockpit */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Live Outpatient Queue &amp; Patient Flow
                </h3>
              </div>
              <button
                onClick={() => onNavigateModule('queue')}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Full Queue Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {queue.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">
                No patients currently in the reception queue.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">#</th>
                      <th className="py-2.5 px-3 font-semibold">Patient</th>
                      <th className="py-2.5 px-3 font-semibold">Stage</th>
                      <th className="py-2.5 px-3 font-semibold">Doctor / Room</th>
                      <th className="py-2.5 px-3 font-semibold">Wait Time</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                    {queue.map((q) => (
                      <tr key={q.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-red-600 dark:text-red-400">
                          Q-{q.queueNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => onSelectPatient(q.patientId)}
                            className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-red-600 text-left cursor-pointer"
                          >
                            {q.patientName}
                          </button>
                          <span className="block text-[10px] text-neutral-400 font-mono">
                            {q.patientNumber}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              q.stage === 'in_consultation'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : q.stage === 'waiting'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                            }`}
                          >
                            {q.stage.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium">{q.assignedPractitionerName}</span>
                          <span className="block text-[10px] text-neutral-500">{q.consultingRoom}</span>
                        </td>
                        <td className="py-2.5 px-3 text-neutral-500 font-mono">
                          {q.waitTimeMinutes} mins
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onAdvanceQueueItem(q.id)}
                            className="px-2.5 py-1 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            {q.stage === 'waiting'
                              ? 'Start Consult'
                              : q.stage === 'triage'
                              ? 'To Doctor'
                              : 'Discharge'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Today's Consultations EHR Summary */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Recent Consultations &amp; Visit Notes
                </h3>
              </div>
              <button
                onClick={() => onNavigateModule('consultations')}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>View All Visits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {consultations.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                        {c.patientName}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">({c.patientNumber})</span>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {c.date} &middot; {c.time}
                    </span>
                  </div>

                  <div className="text-neutral-700 dark:text-neutral-300">
                    <strong className="text-neutral-900 dark:text-neutral-100">Impression / Diagnosis: </strong>
                    <span className="text-red-700 dark:text-red-400 font-medium">
                      {c.clinicalImpressionDiagnosis}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 line-clamp-1">
                    <strong>Chief Complaint:</strong> {c.chiefComplaint}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 dark:border-neutral-800 text-[10px] text-neutral-500">
                    <span>Practitioner: {c.practitionerName}</span>
                    <span>
                      Vitals: BP {c.vitals.bpSystolic}/{c.vitals.bpDiastolic} mmHg &middot; Temp {c.vitals.temperatureCelsius}&deg;C
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Appointments, On-duty Staff & Alerts */}
        <div className="space-y-6">
          {/* Today's Scheduled Appointments */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Appointments ({todayAppointments.length})
                </h3>
              </div>
              <button
                onClick={onOpenBookAppointment}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                + Book
              </button>
            </div>

            <div className="space-y-2.5">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                      {apt.patientName}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {apt.practitionerName} &middot; {apt.serviceName}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      Slot: {apt.timeSlot} ({apt.type})
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      apt.status === 'in_consultation'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : apt.status === 'in_queue'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {apt.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* On-Duty Practitioners & Staff */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Staff On Duty ({activeStaffOnDuty.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateModule('staff')}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
              >
                Roster &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {activeStaffOnDuty.map((st) => (
                <div key={st.id} className="flex items-center justify-between text-xs py-1">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                      {st.fullName}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {st.role} &middot; {st.consultingRoom || st.department}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                    {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Clinic Notices */}
          {unreadAlerts.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-red-800 dark:text-red-300 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Clinical Notices &amp; Reminders</span>
              </div>
              {unreadAlerts.map((n) => (
                <div key={n.id} className="text-neutral-700 dark:text-neutral-300 text-[11px]">
                  <strong>{n.title}: </strong>
                  <span>{n.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
