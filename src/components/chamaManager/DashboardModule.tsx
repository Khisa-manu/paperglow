import React from 'react';
import {
  GroupProfile,
  Member,
  ContributionRecord,
  LoanRecord,
  WelfareClaim,
  Meeting,
  CashTransaction,
  GroupAsset,
  ChamaModule,
} from '../../types/chamaManager';
import {
  Users,
  CreditCard,
  Banknote,
  HeartHandshake,
  Landmark,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Plus,
  FileCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface DashboardModuleProps {
  group: GroupProfile;
  members: Member[];
  contributions: ContributionRecord[];
  loans: LoanRecord[];
  welfareClaims: WelfareClaim[];
  meetings: Meeting[];
  transactions: CashTransaction[];
  assets: GroupAsset[];
  onNavigateModule: (module: ChamaModule) => void;
  onOpenRecordContribution: () => void;
  onOpenApplyLoan: () => void;
  onOpenAddMember: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  group,
  members,
  contributions,
  loans,
  welfareClaims,
  meetings,
  transactions,
  assets,
  onNavigateModule,
  onOpenRecordContribution,
  onOpenApplyLoan,
  onOpenAddMember,
}) => {
  // Calculated Key Metrics
  const totalContributions = members.reduce((sum, m) => sum + m.totalContributionsKes, 0);
  const totalWelfare = members.reduce((sum, m) => sum + m.welfareContributionsKes, 0);
  const totalOutstandingLoans = loans
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + l.balanceKes, 0);
  const totalAssetsValuation = assets.reduce((sum, a) => sum + a.currentValuationKes, 0);

  const pendingLoans = loans.filter((l) => l.status === 'pending_approval');
  const pendingWelfare = welfareClaims.filter((w) => w.status === 'pending');
  const nextMeeting = meetings.find((m) => m.status === 'scheduled');

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Group Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold text-white">
            <span>Registration: {group.registrationNumber}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] tracking-tight">
            {group.name}
          </h2>
          <p className="text-xs text-red-100 max-w-xl">
            {group.tagline} · Monthly savings target KES {group.monthlyContributionKes.toLocaleString()} · Welfare pool KES {group.monthlyWelfareKes.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <button
            onClick={onOpenRecordContribution}
            className="px-3.5 py-2 rounded-lg bg-white text-red-600 text-xs font-bold hover:bg-red-50 transition-colors shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Contribution</span>
          </button>
          <button
            onClick={() => onNavigateModule('documents')}
            className="px-3.5 py-2 rounded-lg bg-red-800/80 hover:bg-red-800 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Member IDs &amp; Certs</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Notices (if any) */}
      {(pendingLoans.length > 0 || pendingWelfare.length > 0) && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-amber-900 dark:text-amber-200">
                Action Items Awaiting Executive Approval:
              </span>
              <p className="text-amber-800 dark:text-amber-300">
                {pendingLoans.length > 0 && `${pendingLoans.length} pending loan application(s). `}
                {pendingWelfare.length > 0 && `${pendingWelfare.length} pending welfare claim(s).`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {pendingLoans.length > 0 && (
              <button
                onClick={() => onNavigateModule('loans')}
                className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
              >
                Review Loans
              </button>
            )}
            {pendingWelfare.length > 0 && (
              <button
                onClick={() => onNavigateModule('welfare')}
                className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
              >
                Review Welfare
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6 Key Financial & Membership Cockpit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Core Savings */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-medium">Total Member Savings</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
              KES {totalContributions.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 flex items-center space-x-1">
              <span className="text-emerald-600 font-bold">100% Co-op Bank Secured</span>
              <span>· {members.length} members</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('contributions')}
            className="mt-3 text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View Contribution Ledgers</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Outstanding Loans */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-medium">Active Loan Book</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
              KES {totalOutstandingLoans.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              {loans.filter((l) => l.status === 'active').length} active loans · 8% annual interest
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('loans')}
            className="mt-3 text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Manage Credit Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Welfare Reserve */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-medium">Welfare Benevolent Pool</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
              KES {totalWelfare.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Bereavement cover KES 100K · Inpatient KES 40K
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('welfare')}
            className="mt-3 text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View Welfare Fund</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Total Group Asset Valuation */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-medium">Tangible Assets Valuation</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
              KES {totalAssetsValuation.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Juja Commercial Plot, CIC MMF &amp; Fixed Deposits
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('assets')}
            className="mt-3 text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Inspect Asset Deeds</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 5: Total Members */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-medium">Active Member Roll</span>
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
              {members.length} Members
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              100% active standing · Executive: Chair, Sec, Treas
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('members')}
            className="mt-3 text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Browse Member Directory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 6: Next Upcoming Meeting */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-medium">Next Group Meeting</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              {nextMeeting ? nextMeeting.date : 'TBD'}
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
              {nextMeeting ? `${nextMeeting.venue} (${nextMeeting.time})` : 'No scheduled meeting'}
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('meetings')}
            className="mt-3 text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View Meeting Agendas &amp; Minutes</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Asset Allocation & Recent Cashbook Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Recent Cash Transactions */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                Recent Cashbook &amp; M-Pesa Activity
              </h3>
              <p className="text-xs text-neutral-500">
                Latest reconciled receipts, disbursements, and benevolent grants
              </p>
            </div>
            <button
              onClick={() => onNavigateModule('finance')}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Full Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5">Category</th>
                  <th className="pb-2.5">Description</th>
                  <th className="pb-2.5">Reference</th>
                  <th className="pb-2.5 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-2.5 text-neutral-500 tabular-nums">{tx.date}</td>
                    <td className="py-2.5">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-2.5 text-[11px] font-mono text-neutral-400">
                      {tx.reference}
                    </td>
                    <td className="py-2.5 text-right font-bold tabular-nums">
                      <span
                        className={
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {tx.type === 'income' ? '+' : '-'} KES {tx.amountKes.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1/3): Asset Allocation & Documents Widget */}
        <div className="space-y-6">
          {/* Asset Allocation Breakdown */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Chama Asset Portfolio
            </h3>
            <div className="space-y-3">
              {assets.map((asset) => {
                const percentage = Math.round((asset.currentValuationKes / totalAssetsValuation) * 100);
                return (
                  <div key={asset.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                        {asset.name}
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400">
                      <span>{asset.category}</span>
                      <span>KES {asset.currentValuationKes.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Member Credentials & PDF Card Banner */}
          <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 space-y-3">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Official Chama Credentials</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Generate authenticated <strong>Membership Certificates</strong> and verified <strong>Digital QR ID Cards</strong> for all registered members with 1-click PDF download &amp; printing.
            </p>
            <button
              onClick={() => onNavigateModule('documents')}
              className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Open Document Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
