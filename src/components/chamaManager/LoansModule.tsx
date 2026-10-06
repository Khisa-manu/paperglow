import React, { useState } from 'react';
import { LoanRecord, Member, GroupProfile } from '../../types/chamaManager';
import {
  Banknote,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Calendar,
  FileCheck,
} from 'lucide-react';

interface LoansModuleProps {
  loans: LoanRecord[];
  members: Member[];
  group: GroupProfile;
  onOpenApplyLoan: () => void;
  onApproveLoan: (loanId: string) => void;
  onRejectLoan: (loanId: string) => void;
  onOpenRecordRepayment: (loan: LoanRecord) => void;
}

export const LoansModule: React.FC<LoansModuleProps> = ({
  loans,
  members,
  group,
  onOpenApplyLoan,
  onApproveLoan,
  onRejectLoan,
  onOpenRecordRepayment,
}) => {
  const [statusTab, setStatusTab] = useState<'all' | 'active' | 'pending' | 'cleared'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLoans = loans.filter((l) => {
    const matchesStatus =
      statusTab === 'all'
        ? true
        : statusTab === 'active'
        ? l.status === 'active'
        : statusTab === 'pending'
        ? l.status === 'pending_approval'
        : l.status === 'cleared';

    const matchesSearch =
      l.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalActiveBook = loans
    .filter((l) => l.status === 'active')
    .reduce((s, l) => s + l.balanceKes, 0);

  const totalDisbursed = loans.reduce((s, l) => s + l.principalAmountKes, 0);
  const totalRepaid = loans.reduce((s, l) => s + l.amountRepaidKes, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Banknote className="w-5 h-5 text-red-600" />
            <span>Chama Credit &amp; Loan Facilities</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Flat 8% annual interest rate · Max loan multiplier {group.loanMaxMultiplier}x member savings · 2 guarantors required
          </p>
        </div>

        <button
          onClick={onOpenApplyLoan}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Loan</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Outstanding Active Loan Book
          </span>
          <div className="text-lg font-bold font-['Poppins'] text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            KES {totalActiveBook.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Across {loans.filter((l) => l.status === 'active').length} active borrowers
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Total Capital Disbursed
          </span>
          <div className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            KES {totalDisbursed.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Cumulative credit extended
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Recovered Capital &amp; Interest
          </span>
          <div className="text-lg font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            KES {totalRepaid.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            {Math.round((totalRepaid / (totalDisbursed || 1)) * 100)}% recovery benchmark
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Committee Queue
          </span>
          <div className="text-lg font-bold font-['Poppins'] text-red-600 mt-1 tabular-nums">
            {loans.filter((l) => l.status === 'pending_approval').length} Pending
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Awaiting executive sign-off
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setStatusTab('all')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              statusTab === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            All Loans ({loans.length})
          </button>
          <button
            onClick={() => setStatusTab('active')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              statusTab === 'active'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Active ({loans.filter((l) => l.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusTab('pending')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              statusTab === 'pending'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Pending Review ({loans.filter((l) => l.status === 'pending_approval').length})
          </button>
          <button
            onClick={() => setStatusTab('cleared')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              statusTab === 'cleared'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Cleared ({loans.filter((l) => l.status === 'cleared').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search borrower or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Loans Cards & Schedule List */}
      <div className="space-y-4">
        {filteredLoans.map((loan) => {
          const progressPercent = Math.min(
            100,
            Math.round((loan.amountRepaidKes / (loan.totalRepayableKes || 1)) * 100)
          );

          return (
            <div
              key={loan.id}
              className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold text-sm">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        {loan.memberName}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {loan.membershipNumber}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {loan.loanType} · Applied {loan.applicationDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      loan.status === 'active'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        : loan.status === 'pending_approval'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {loan.status.replace('_', ' ')}
                  </span>

                  {loan.status === 'active' && (
                    <button
                      onClick={() => onOpenRecordRepayment(loan)}
                      className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Record Repayment
                    </button>
                  )}

                  {loan.status === 'pending_approval' && (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onApproveLoan(loan.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onRejectLoan(loan.id)}
                        className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-700 dark:text-neutral-300 text-xs font-semibold cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Purpose */}
              <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80">
                <strong>Purpose:</strong> {loan.purpose}
              </p>

              {/* Loan Financial Figures */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                    Principal Amount
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    KES {loan.principalAmountKes.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                    Total Repayable (8% Int.)
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    KES {loan.totalRepayableKes.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                    Monthly Installment
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    KES {loan.monthlyInstallmentKes.toLocaleString()} / mo
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                    Current Balance
                  </span>
                  <span className="font-bold text-red-600 tabular-nums">
                    KES {loan.balanceKes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Repayment Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span>
                    Repaid KES {loan.amountRepaidKes.toLocaleString()} of KES {loan.totalRepayableKes.toLocaleString()}
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">{progressPercent}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Guarantors */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Guarantors:
                </span>
                {loan.guarantors.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                  >
                    {g.memberName} (Pledged KES {g.amountPledgedKes.toLocaleString()})
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
