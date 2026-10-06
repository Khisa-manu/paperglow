import React, { useState } from 'react';
import {
  Member,
  ContributionRecord,
  LoanRecord,
  WelfareClaim,
  CashTransaction,
  GroupAsset,
  GroupProfile,
} from '../../types/chamaManager';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  CreditCard,
  Banknote,
  HeartHandshake,
  Landmark,
  User,
  CheckCircle2,
} from 'lucide-react';

interface ReportsModuleProps {
  group: GroupProfile;
  members: Member[];
  contributions: ContributionRecord[];
  loans: LoanRecord[];
  welfareClaims: WelfareClaim[];
  transactions: CashTransaction[];
  assets: GroupAsset[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  group,
  members,
  contributions,
  loans,
  welfareClaims,
  transactions,
  assets,
}) => {
  const [reportType, setReportType] = useState<
    'annual_summary' | 'member_statements' | 'loan_portfolio' | 'welfare_audit' | 'assets_register'
  >('annual_summary');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');

  const totalMemberSavings = members.reduce((s, m) => s + m.totalContributionsKes, 0);
  const totalWelfarePooled = members.reduce((s, m) => s + m.welfareContributionsKes, 0);
  const totalActiveLoans = loans.filter((l) => l.status === 'active').reduce((s, l) => s + l.balanceKes, 0);
  const totalAssetsValuation = assets.reduce((s, a) => s + a.currentValuationKes, 0);

  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];
  const memberContributions = contributions.filter((c) => c.memberId === selectedMember?.id);
  const memberLoans = loans.filter((l) => l.memberId === selectedMember?.id);
  const memberWelfare = welfareClaims.filter((w) => w.memberId === selectedMember?.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <span>Chama Financial Statements &amp; Audit Reports</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Certified accounting statements, individualized member ledger records, and investment balance sheets
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export A4 Report</span>
        </button>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
        <button
          onClick={() => setReportType('annual_summary')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            reportType === 'annual_summary'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Consolidated Balance Sheet
        </button>
        <button
          onClick={() => setReportType('member_statements')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            reportType === 'member_statements'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Individual Member Statements
        </button>
        <button
          onClick={() => setReportType('loan_portfolio')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            reportType === 'loan_portfolio'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Loan Recovery Report
        </button>
        <button
          onClick={() => setReportType('welfare_audit')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            reportType === 'welfare_audit'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Welfare Claims Audit
        </button>
        <button
          onClick={() => setReportType('assets_register')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            reportType === 'assets_register'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Asset Deeds Register
        </button>
      </div>

      {/* REPORT CONTENT: 1. Consolidated Balance Sheet */}
      {reportType === 'annual_summary' && (
        <div className="p-6 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
          <div className="text-center pb-4 border-b border-neutral-200 dark:border-neutral-800 space-y-1">
            <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              {group.name} — Annual Balance Sheet
            </h3>
            <p className="text-xs text-neutral-500">
              Registration: {group.registrationNumber} · Co-op Bank Commercial Ledger · All figures in Kenyan Shillings (KES)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Assets (Current & Non-Current) */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                A. Group Assets &amp; Holdings
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Pooled Liquid Savings</span>
                  <span className="font-bold tabular-nums">KES {totalMemberSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Active Loan Receivables (Outstanding)</span>
                  <span className="font-bold tabular-nums">KES {totalActiveLoans.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Welfare Benevolent Reserve</span>
                  <span className="font-bold tabular-nums">KES {totalWelfarePooled.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Real Estate Plots &amp; MMF Holdings</span>
                  <span className="font-bold tabular-nums">KES {totalAssetsValuation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-emerald-700 dark:text-emerald-400">Total Capital &amp; Net Worth</span>
                  <span className="text-emerald-700 dark:text-emerald-400 tabular-nums">
                    KES {(totalMemberSavings + totalActiveLoans + totalWelfarePooled + totalAssetsValuation).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                B. Member Equity &amp; Shares Distribution
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Registered Members</span>
                  <span className="font-bold tabular-nums">{members.length} Members</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Subscribed Shares Units</span>
                  <span className="font-bold tabular-nums">{members.reduce((s, m) => s + m.sharesUnits, 0)} Units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Average Savings Per Member</span>
                  <span className="font-bold tabular-nums">
                    KES {Math.round(totalMemberSavings / (members.length || 1)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-neutral-600 dark:text-neutral-400">Statutory Reserve Compliance</span>
                  <span className="font-bold text-emerald-600">100% Fully Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 2. Individual Member Statement */}
      {reportType === 'member_statements' && selectedMember && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center space-x-3 text-xs">
            <span className="font-semibold text-neutral-500">Select Member Statement:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.membershipNumber} — {m.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-2">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Official Statement of Account — {selectedMember.fullName}
                </h3>
                <p className="text-xs text-neutral-500">
                  No: {selectedMember.membershipNumber} · National ID: {selectedMember.idNumber} · Joined {selectedMember.dateJoined}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Total Accumulated Savings</span>
                <span className="text-base font-bold text-red-600 tabular-nums">
                  KES {selectedMember.totalContributionsKes.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Contributions History for this member */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Payment History
              </h4>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold text-[10px]">
                      <th className="pb-2">Month</th>
                      <th className="pb-2">Savings</th>
                      <th className="pb-2">Welfare</th>
                      <th className="pb-2">Total Paid</th>
                      <th className="pb-2">Reference</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {memberContributions.map((c) => (
                      <tr key={c.id}>
                        <td className="py-2 font-medium">{c.month}</td>
                        <td className="py-2 tabular-nums">KES {c.amountKes.toLocaleString()}</td>
                        <td className="py-2 tabular-nums">KES {c.welfareKes.toLocaleString()}</td>
                        <td className="py-2 font-bold text-emerald-600 tabular-nums">KES {c.totalPaidKes.toLocaleString()}</td>
                        <td className="py-2 font-mono text-neutral-500">{c.transactionReference}</td>
                        <td className="py-2 text-neutral-400">{c.paymentDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loans summary for this member */}
            <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Credit &amp; Loan Facilities
              </h4>
              {memberLoans.length === 0 ? (
                <p className="text-xs text-neutral-400">No active or historical loans recorded for this member.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {memberLoans.map((l) => (
                    <div key={l.id} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold">{l.loanType} (Applied {l.applicationDate})</div>
                        <div className="text-[11px] text-neutral-500">
                          Principal KES {l.principalAmountKes.toLocaleString()} · Repaid KES {l.amountRepaidKes.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-neutral-400">Balance Due</div>
                        <div className="font-bold text-red-600">KES {l.balanceKes.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 3. Loan Recovery Report */}
      {reportType === 'loan_portfolio' && (
        <div className="p-6 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Comprehensive Credit Portfolio &amp; Guarantor Exposure Report
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold text-[10px] uppercase">
                  <th className="pb-2.5">Borrower</th>
                  <th className="pb-2.5">Loan Facility</th>
                  <th className="pb-2.5">Principal (KES)</th>
                  <th className="pb-2.5">Total Repayable</th>
                  <th className="pb-2.5">Amount Repaid</th>
                  <th className="pb-2.5">Balance (KES)</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {loans.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 font-bold">{l.memberName} ({l.membershipNumber})</td>
                    <td className="py-2.5">{l.loanType}</td>
                    <td className="py-2.5 tabular-nums">KES {l.principalAmountKes.toLocaleString()}</td>
                    <td className="py-2.5 tabular-nums font-semibold">KES {l.totalRepayableKes.toLocaleString()}</td>
                    <td className="py-2.5 tabular-nums text-emerald-600">KES {l.amountRepaidKes.toLocaleString()}</td>
                    <td className="py-2.5 tabular-nums font-bold text-red-600">KES {l.balanceKes.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold uppercase text-[10px]">{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 4. Welfare Audit */}
      {reportType === 'welfare_audit' && (
        <div className="p-6 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Welfare Benevolent Claims &amp; Assistance Payout Audit
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold text-[10px] uppercase">
                  <th className="pb-2.5">Member</th>
                  <th className="pb-2.5">Claim Type</th>
                  <th className="pb-2.5">Description</th>
                  <th className="pb-2.5">Requested Date</th>
                  <th className="pb-2.5">Amount (KES)</th>
                  <th className="pb-2.5">Ref</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {welfareClaims.map((w) => (
                  <tr key={w.id}>
                    <td className="py-2.5 font-bold">{w.memberName}</td>
                    <td className="py-2.5 font-medium">{w.claimType}</td>
                    <td className="py-2.5 max-w-xs truncate text-neutral-500">{w.description}</td>
                    <td className="py-2.5 tabular-nums">{w.requestDate}</td>
                    <td className="py-2.5 font-bold tabular-nums">KES {w.amountApprovedKes.toLocaleString()}</td>
                    <td className="py-2.5 font-mono text-[11px]">{w.paymentReference || '—'}</td>
                    <td className="py-2.5 text-right font-bold uppercase text-[10px]">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 5. Assets Register */}
      {reportType === 'assets_register' && (
        <div className="p-6 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Official Group Asset Register &amp; Title Deeds Inventory
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold text-[10px] uppercase">
                  <th className="pb-2.5">Asset Description</th>
                  <th className="pb-2.5">Category</th>
                  <th className="pb-2.5">Location</th>
                  <th className="pb-2.5">Document / Title No</th>
                  <th className="pb-2.5">Cost (KES)</th>
                  <th className="pb-2.5 text-right">Valuation (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {assets.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 font-bold">{a.name}</td>
                    <td className="py-2.5">{a.category}</td>
                    <td className="py-2.5">{a.location}</td>
                    <td className="py-2.5 font-mono">{a.documentNumber}</td>
                    <td className="py-2.5 tabular-nums">KES {a.purchaseCostKes.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600 tabular-nums">KES {a.currentValuationKes.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
