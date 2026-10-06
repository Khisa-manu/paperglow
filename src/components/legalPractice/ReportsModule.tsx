import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Clock,
  Gavel,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import {
  LegalMatter,
  LegalInvoice,
  TimeEntry,
  LegalStaff,
  LegalDeadline,
} from '../../types/legalPractice';

interface ReportsModuleProps {
  matters: LegalMatter[];
  invoices: LegalInvoice[];
  timeEntries: TimeEntry[];
  staff: LegalStaff[];
  deadlines: LegalDeadline[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  matters,
  invoices,
  timeEntries,
  staff,
  deadlines,
}) => {
  const [period, setPeriod] = useState<'quarter' | 'year' | 'all'>('quarter');

  const totalBilledKes = invoices.reduce((sum, inv) => sum + inv.grandTotalKes, 0);
  const totalPaidKes = invoices.reduce((sum, inv) => sum + inv.amountPaidKes, 0);
  const totalOutstandingKes = invoices.reduce((sum, inv) => sum + inv.balanceDueKes, 0);
  const totalDisbursementsKes = invoices.reduce((sum, inv) => sum + inv.disbursementsTotalKes, 0);
  const totalHoursLogged = timeEntries.reduce((sum, t) => sum + t.durationMinutes / 60, 0);
  const totalBillableValueKes = timeEntries.reduce((sum, t) => sum + (t.isBillable ? t.totalAmountKes : 0), 0);

  // Practice area breakdown
  const practiceAreaStats = [
    'Commercial Litigation',
    'Conveyancing & Real Estate',
    'Employment & Labour Relations',
    'Environment and Land Court (ELC)',
    'Corporate & M&A',
  ].map((area) => {
    const areaMatters = matters.filter((m) => m.matterType === area);
    const areaBilled = areaMatters.reduce((sum, m) => sum + m.totalBilledKes, 0);
    const disputeSum = areaMatters.reduce((sum, m) => sum + (m.disputeValueKes || 0), 0);
    return {
      name: area,
      count: areaMatters.length,
      billedKes: areaBilled,
      disputeSumKes: disputeSum,
    };
  });

  // Advocate utilization leaderboard
  const advocatePerformance = staff.map((member) => {
    const memberEntries = timeEntries.filter((t) => t.staffId === member.id);
    const hours = memberEntries.reduce((sum, t) => sum + t.durationMinutes / 60, 0);
    const billableVal = memberEntries.reduce((sum, t) => sum + (t.isBillable ? t.totalAmountKes : 0), 0);
    const mattersCount = matters.filter((m) => m.assignedAdvocateId === member.id).length;
    return {
      staff: member,
      hours,
      billableVal,
      mattersCount,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Practice Management Analytics &amp; Partner Reports
          </h2>
          <p className="text-xs text-neutral-500">
            Audit-grade performance metrics covering fee recoveries in KES, advocate billable utilization, registry disbursements, and statutory compliance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            <option value="quarter">Current Quarter (Q1 2026)</option>
            <option value="year">Full Calendar Year (2026)</option>
            <option value="all">Lifetime Practice Inception</option>
          </select>
        </div>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Gross Billed Fee Notes</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            KES {totalBilledKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Under Advocates Remuneration Order</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Client Fee Collections</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            KES {totalPaidKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600">
            {((totalPaidKes / (totalBilledKes || 1)) * 100).toFixed(1)}% recovery realization
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Aging Receivables Due</span>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
            KES {totalOutstandingKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-red-600 font-semibold">Active collection portfolio</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Total Billed Disbursements</span>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            KES {totalDisbursementsKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Court filing &amp; process service</span>
        </div>
      </div>

      {/* Two Column Grid: Practice Area Revenue & Advocate Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Area Revenue */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Revenue &amp; Portfolio Breakdown by Practice Area
            </h3>
            <span className="text-xs text-neutral-400 font-mono">{matters.length} Total Matters</span>
          </div>

          <div className="space-y-3">
            {practiceAreaStats.map((item) => (
              <div key={item.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {item.name} ({item.count} matters)
                  </span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">
                    KES {item.billedKes.toLocaleString()}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (item.billedKes / (totalBilledKes || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advocate Billable Utilization Leaderboard */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Advocate Workload &amp; Time Utilization
            </h3>
            <span className="text-xs text-neutral-400 font-mono">{totalHoursLogged.toFixed(1)} Total Hours</span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {advocatePerformance.map(({ staff: member, hours, billableVal, mattersCount }) => (
              <div key={member.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">{member.name}</div>
                  <div className="text-[11px] text-neutral-400">
                    {member.role} • {mattersCount} active matters
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-neutral-900 dark:text-white">
                    {hours.toFixed(1)} hrs logged
                  </div>
                  <div className="font-mono text-emerald-600 text-[11px]">
                    KES {billableVal.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
