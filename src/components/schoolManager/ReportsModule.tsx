import React, { useState } from 'react';
import {
  Student,
  TeacherStaff,
  SchoolClass,
  FeeInvoice,
  FeePayment,
  StudentExamResult,
  SchoolSettings,
} from '../../types/schoolManager';
import {
  BarChart3,
  Printer,
  TrendingUp,
  Users,
  CreditCard,
  Award,
  GraduationCap,
  CalendarCheck,
} from 'lucide-react';

interface ReportsModuleProps {
  students: Student[];
  teachers: TeacherStaff[];
  classes: SchoolClass[];
  invoices: FeeInvoice[];
  payments: FeePayment[];
  results: StudentExamResult[];
  settings: SchoolSettings;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  students,
  teachers,
  classes,
  invoices,
  payments,
  results,
  settings,
}) => {
  const [reportType, setReportType] = useState<'enrollment' | 'fees' | 'academics' | 'staff'>('enrollment');

  // Enrollment stats
  const totalStudents = students.length;
  const maleCount = students.filter((s) => s.gender === 'Male').length;
  const femaleCount = students.filter((s) => s.gender === 'Female').length;
  const boarderCount = students.filter((s) => s.boardingStatus === 'Boarder').length;
  const dayScholarCount = totalStudents - boarderCount;

  // Fee stats
  const totalBilled = invoices.reduce((acc, i) => acc + i.amountDueKes, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.amountKes, 0);
  const totalArrears = invoices.reduce((acc, i) => acc + i.balanceKes, 0);

  // M-Pesa vs Bank split
  const mpesaPayments = payments.filter((p) => p.paymentMethod === 'mpesa_paybill');
  const mpesaTotal = mpesaPayments.reduce((acc, p) => acc + p.amountKes, 0);
  const bankTotal = totalPaid - mpesaTotal;

  // Academics
  const gradeDistribution: Record<string, number> = { A: 0, 'A-': 0, 'B+': 0, B: 0, 'B-': 0, 'C+': 0 };
  results.forEach((r) => {
    if (gradeDistribution[r.meanGrade] !== undefined) {
      gradeDistribution[r.meanGrade]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Institutional Reports &amp; Academic Analytics
          </h1>
          <p className="text-xs text-neutral-500">
            Comprehensive statistical summaries for Ministry of Education, BOM and PTA audits
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#14171d] text-neutral-800 dark:text-neutral-200 text-xs font-semibold shadow-xs cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Export / Print Report Summary</span>
        </button>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setReportType('enrollment')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
            reportType === 'enrollment'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Enrollment</span>
        </button>

        <button
          onClick={() => setReportType('fees')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
            reportType === 'fees'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fees Recovery &amp; Arrears</span>
        </button>

        <button
          onClick={() => setReportType('academics')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
            reportType === 'academics'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Exam Performance</span>
        </button>

        <button
          onClick={() => setReportType('staff')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
            reportType === 'staff'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Staff Workload</span>
        </button>
      </div>

      {/* Report 1: Enrollment */}
      {reportType === 'enrollment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-2">
              <span className="text-xs text-neutral-500 font-bold uppercase">Total Pupils</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {totalStudents}
              </div>
              <p className="text-[11px] text-neutral-400">Master Roll active headcount</p>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-2">
              <span className="text-xs text-neutral-500 font-bold uppercase">Gender Ratio</span>
              <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {maleCount} Boys • {femaleCount} Girls
              </div>
              <p className="text-[11px] text-neutral-400">
                {Math.round((maleCount / totalStudents) * 100)}% Male / {Math.round((femaleCount / totalStudents) * 100)}% Female
              </p>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-2">
              <span className="text-xs text-neutral-500 font-bold uppercase">Residency Distribution</span>
              <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {boarderCount} Boarders • {dayScholarCount} Day
              </div>
              <p className="text-[11px] text-neutral-400">
                {Math.round((boarderCount / totalStudents) * 100)}% Boarding accommodation
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Stream-Level Enrollment vs Capacity
            </h3>
            <div className="space-y-3">
              {classes.map((cls) => {
                const pct = Math.round((cls.studentCount / cls.capacity) * 100);
                return (
                  <div key={cls.id} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>{cls.name} ({cls.gradeLevel})</span>
                      <span className="font-mono text-neutral-500">
                        {cls.studentCount} / {cls.capacity} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Fees & Collections */}
      {reportType === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-2">
              <span className="text-xs text-neutral-500 font-bold uppercase">Total Invoiced</span>
              <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                KES {totalBilled.toLocaleString()}
              </div>
              <p className="text-[11px] text-neutral-400">Term 1 2026 Academic Year</p>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-2">
              <span className="text-xs text-emerald-600 font-bold uppercase">Receipts Cleared</span>
              <div className="text-xl font-bold font-mono text-emerald-600">
                KES {totalPaid.toLocaleString()}
              </div>
              <p className="text-[11px] text-neutral-400">
                {Math.round((totalPaid / totalBilled) * 100)}% collection efficiency
              </p>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-2">
              <span className="text-xs text-amber-500 font-bold uppercase">Aging Arrears</span>
              <div className="text-xl font-bold font-mono text-amber-500">
                KES {totalArrears.toLocaleString()}
              </div>
              <p className="text-[11px] text-neutral-400">Subject to mid-term clearance notices</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Payment Gateway Distribution (Paybill vs Direct Bank Transfer)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-neutral-500 font-bold">M-Pesa Paybill (400200)</span>
                <div className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                  KES {mpesaTotal.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {Math.round((mpesaTotal / totalPaid) * 100)}% of total receipts
                </div>
              </div>

              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 space-y-1">
                <span className="text-neutral-500 font-bold">KCB Bank Operations Wire</span>
                <div className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                  KES {bankTotal.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {Math.round((bankTotal / totalPaid) * 100)}% of total receipts
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report 3: Academics */}
      {reportType === 'academics' && (
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
            Form 4 Candidates Mean Grade Distribution (Term 1 Mid-Term)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div
                key={grade}
                className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
              >
                <div className="font-black font-mono text-base text-red-600">{grade}</div>
                <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {count} Students
                </div>
                <div className="text-[10px] text-neutral-400">
                  {results.length > 0 ? Math.round((count / results.length) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report 4: Staff Workload */}
      {reportType === 'staff' && (
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
            Teacher Subject Period Workload Distribution
          </h3>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {teachers.map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {t.fullName}
                  </span>
                  <div className="text-[11px] text-neutral-400">
                    {t.department} • {t.tscNumber}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {t.role}
                  </span>
                  <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    {t.assignedClasses.length} Active Streams
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
