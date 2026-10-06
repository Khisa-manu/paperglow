import React, { useState, useMemo } from 'react';
import { ContributionRecord, Member, GroupProfile } from '../../types/chamaManager';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface ContributionsModuleProps {
  contributions: ContributionRecord[];
  members: Member[];
  group: GroupProfile;
  onOpenRecordContribution: () => void;
}

export const ContributionsModule: React.FC<ContributionsModuleProps> = ({
  contributions,
  members,
  group,
  onOpenRecordContribution,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statementMemberId, setStatementMemberId] = useState<string>('');

  const monthsList = useMemo(() => {
    const set = new Set(contributions.map((c) => c.month));
    return ['all', ...Array.from(set)];
  }, [contributions]);

  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      const matchesMonth = selectedMonth === 'all' || c.month === selectedMonth;
      const matchesSearch =
        c.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.transactionReference.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMonth && matchesSearch;
    });
  }, [contributions, selectedMonth, searchQuery]);

  const totalCollectedInView = filteredContributions.reduce((s, c) => s + c.totalPaidKes, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>Monthly Contributions &amp; M-Pesa Ledgers</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Monthly Target: KES {group.monthlyContributionKes.toLocaleString()} (Core) + KES {group.monthlyWelfareKes.toLocaleString()} (Welfare) per member
          </p>
        </div>

        <button
          onClick={onOpenRecordContribution}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment Receipt</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Current Target Per Member
          </span>
          <div className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            KES {(group.monthlyContributionKes + group.monthlyWelfareKes).toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            KES {group.monthlyContributionKes.toLocaleString()} Core + KES {group.monthlyWelfareKes.toLocaleString()} Welfare
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            M-Pesa Collections in View
          </span>
          <div className="text-lg font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            KES {totalCollectedInView.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Across {filteredContributions.length} verified receipts
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Late Payment Penalty Rule
          </span>
          <div className="text-lg font-bold font-['Poppins'] text-red-600 mt-1 tabular-nums">
            KES {group.latePenaltyKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Applied automatically after 10th day
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            M-Pesa Paybill Coordinate
          </span>
          <div className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
            {group.mpesaPaybill}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            A/C: {group.mpesaAccountNumber}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name or M-Pesa code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-neutral-500 font-medium shrink-0">Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            {monthsList.map((m) => (
              <option key={m} value={m}>
                {m === 'all' ? 'All Billing Cycles' : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contributions Ledger Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold uppercase text-[10px]">
                <th className="pb-3">Member Details</th>
                <th className="pb-3">Month</th>
                <th className="pb-3">Core Savings</th>
                <th className="pb-3">Welfare</th>
                <th className="pb-3">Fines</th>
                <th className="pb-3">Total Paid</th>
                <th className="pb-3">Payment Channel</th>
                <th className="pb-3">Transaction Ref</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredContributions.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {c.memberName}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {c.membershipNumber}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-neutral-700 dark:text-neutral-300">
                    {c.month}
                  </td>
                  <td className="py-3 font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
                    KES {c.amountKes.toLocaleString()}
                  </td>
                  <td className="py-3 text-neutral-600 dark:text-neutral-400 tabular-nums">
                    KES {c.welfareKes.toLocaleString()}
                  </td>
                  <td className="py-3 tabular-nums">
                    {c.penaltyKes > 0 ? (
                      <span className="text-red-600 font-bold">
                        KES {c.penaltyKes.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    KES {c.totalPaidKes.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {c.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-red-600 text-[11px]">
                    {c.transactionReference}
                  </td>
                  <td className="py-3 text-neutral-500 tabular-nums">
                    {c.paymentDate}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center space-x-1 text-emerald-600 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
