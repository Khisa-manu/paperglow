import React from 'react';
import {
  Student,
  TeacherStaff,
  SchoolClass,
  AttendanceRecord,
  FeeInvoice,
  FeePayment,
  ExamRecord,
  SchoolEvent,
  SchoolAnnouncement,
  SchoolNotification,
  SchoolModule,
} from '../../types/schoolManager';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  Receipt,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Send,
} from 'lucide-react';

interface DashboardModuleProps {
  students: Student[];
  teachers: TeacherStaff[];
  classes: SchoolClass[];
  attendance: AttendanceRecord[];
  invoices: FeeInvoice[];
  payments: FeePayment[];
  exams: ExamRecord[];
  events: SchoolEvent[];
  announcements: SchoolAnnouncement[];
  notifications: SchoolNotification[];
  onNavigateModule: (module: SchoolModule) => void;
  onOpenAdmitStudent: () => void;
  onOpenRecordPayment: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  students,
  teachers,
  classes,
  attendance,
  invoices,
  payments,
  exams,
  events,
  announcements,
  notifications,
  onNavigateModule,
  onOpenAdmitStudent,
  onOpenRecordPayment,
}) => {
  // Compute Key Metrics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const boardersCount = students.filter((s) => s.boardingStatus === 'Boarder').length;
  const dayScholarsCount = totalStudents - boardersCount;

  const totalTeachers = teachers.length;
  const tscTeachers = teachers.filter((t) => t.tscNumber.startsWith('TSC/')).length;

  // Today Attendance
  const todayAttendance = attendance;
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'late').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'absent').length;
  const attendanceRate =
    todayAttendance.length > 0
      ? Math.round(((presentCount + lateCount) / todayAttendance.length) * 100)
      : 96;

  // Fee Metrics
  const totalFeesInvoiced = invoices.reduce((acc, inv) => acc + inv.amountDueKes, 0);
  const totalFeesCollected = payments.reduce((acc, p) => acc + p.amountKes, 0);
  const totalArrears = invoices.reduce((acc, inv) => acc + inv.balanceKes, 0);
  const collectionRate =
    totalFeesInvoiced > 0 ? Math.round((totalFeesCollected / totalFeesInvoiced) * 100) : 0;

  // Upcoming Exam
  const upcomingExam = exams.find((e) => !e.isPublished) || exams[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Term Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <GraduationCap className="w-64 h-64 -mr-12" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
            <span>2026 Academic Session</span>
            <span>•</span>
            <span>Term 1 in Progress</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] tracking-tight">
            School Operations &amp; Academic Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
            Welcome back. All school registries, KNEC examination dockets, M-Pesa fee collections, and CBC student attendance records are synced in real time.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenAdmitStudent}
              className="px-3.5 py-2 rounded-lg bg-white text-red-700 text-xs font-bold shadow-xs hover:bg-neutral-100 cursor-pointer flex items-center space-x-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit Student</span>
            </button>
            <button
              onClick={onOpenRecordPayment}
              className="px-3.5 py-2 rounded-lg bg-red-900/50 hover:bg-red-900 text-white text-xs font-bold border border-white/20 cursor-pointer flex items-center space-x-1.5 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>Record Fee Receipt (KES)</span>
            </button>
            <button
              onClick={() => onNavigateModule('attendance')}
              className="px-3.5 py-2 rounded-lg bg-red-900/50 hover:bg-red-900 text-white text-xs font-bold border border-white/20 cursor-pointer flex items-center space-x-1.5 transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Roll Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div
          onClick={() => onNavigateModule('students')}
          className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs hover:border-red-300 dark:hover:border-red-900/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Student Enrollment</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {totalStudents}
            </span>
            <span className="text-xs text-neutral-400 font-medium">Students enrolled</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
            <span>{boardersCount} Boarders</span>
            <span>•</span>
            <span>{dayScholarsCount} Day Scholars</span>
          </div>
        </div>

        {/* Card 2: Teachers & Staff */}
        <div
          onClick={() => onNavigateModule('teachers')}
          className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs hover:border-red-300 dark:hover:border-red-900/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Teaching Staff</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {totalTeachers}
            </span>
            <span className="text-xs text-neutral-400 font-medium">Faculty &amp; Staff</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
            <span>{tscTeachers} TSC Reg.</span>
            <span>•</span>
            <span>{classes.length} Streams Active</span>
          </div>
        </div>

        {/* Card 3: Today's Attendance */}
        <div
          onClick={() => onNavigateModule('attendance')}
          className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs hover:border-red-300 dark:hover:border-red-900/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Today's Attendance</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {attendanceRate}%
            </span>
            <span className="text-xs text-neutral-400 font-medium">Present today</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
            <span className="text-emerald-600 font-medium">{presentCount} Present</span>
            <span>{lateCount} Late</span>
            <span className="text-red-500 font-medium">{absentCount} Absent</span>
          </div>
        </div>

        {/* Card 4: Fees Collections */}
        <div
          onClick={() => onNavigateModule('fees')}
          className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs hover:border-red-300 dark:hover:border-red-900/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Term 1 Fees Recovery</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className="text-xs font-semibold text-neutral-400">KES</span>
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {totalFeesCollected.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
            <span className="text-amber-600 font-medium">KES {totalArrears.toLocaleString()} Arrears</span>
            <span className="text-neutral-400">{collectionRate}% Paid</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Daily Operations & Classes Ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Class Distribution & Capacity */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Classes &amp; Streams Distribution
                </h2>
                <p className="text-xs text-neutral-500">
                  Real-time enrollment versus classroom physical capacity
                </p>
              </div>
              <button
                onClick={() => onNavigateModule('classes')}
                className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <span>Manage Classes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classes.slice(0, 4).map((cls) => {
                const fillPercent = Math.round((cls.studentCount / cls.capacity) * 100);
                return (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                        {cls.name}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {cls.studentCount} / {cls.capacity} Enrolled
                      </span>
                    </div>

                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          fillPercent >= 90 ? 'bg-amber-500' : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(fillPercent, 100)}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                      <span>Teacher: {cls.classTeacherName}</span>
                      <span className="font-mono text-neutral-400">{cls.roomNumber}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Recent Fee Payments Audit */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Recent Fee Payments (Paybill &amp; Bank Ledgers)
                </h2>
                <p className="text-xs text-neutral-500">
                  Direct receipts through M-Pesa 400200 and KCB School Account
                </p>
              </div>
              <button
                onClick={() => onNavigateModule('fees')}
                className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <span>All Transactions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-semibold">
                    <th className="pb-2.5">Receipt #</th>
                    <th className="pb-2.5">Student</th>
                    <th className="pb-2.5">Method &amp; Ref</th>
                    <th className="pb-2.5 text-right">Amount (KES)</th>
                    <th className="pb-2.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                  {payments.slice(0, 5).map((pay) => (
                    <tr key={pay.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30">
                      <td className="py-2.5 font-mono text-neutral-500">{pay.receiptNumber}</td>
                      <td className="py-2.5">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {pay.studentName}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {pay.admissionNumber}
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase mr-1">
                          {pay.paymentMethod.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-neutral-400 text-[11px]">
                          {pay.transactionReference}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        KES {pay.amountKes.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right text-neutral-400 text-[11px]">
                        {pay.paymentDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Events, Alerts & Notices */}
        <div className="space-y-6">
          {/* Upcoming School Events */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-red-600" />
                <span>Upcoming School Events</span>
              </h2>
              <button
                onClick={() => onNavigateModule('events')}
                className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                      {ev.eventType}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">{ev.startDate}</span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 pt-0.5">
                    {ev.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">{ev.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Announcements */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-1.5">
                <Send className="w-4 h-4 text-red-600" />
                <span>Parent Notices &amp; Circulars</span>
              </h2>
              <button
                onClick={() => onNavigateModule('communication')}
                className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                Notices
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        ann.isUrgent
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-neutral-400">{ann.publishedDate}</span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {ann.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Action Checklist */}
          <div className="p-4 rounded-xl bg-neutral-900 text-white dark:bg-[#181b22] dark:border dark:border-neutral-800 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-xs text-white">Daily Administrative Checklist</h3>
            </div>
            <ul className="text-[11px] space-y-2 text-neutral-300">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Morning roll call completed for 7 streams</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Chemistry volumetric lab materials prepped</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Follow up on 3 student fee commitment letters</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
