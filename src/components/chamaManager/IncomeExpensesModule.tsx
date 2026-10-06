import React, { useState } from 'react';
import { CashTransaction, GroupProfile } from '../../types/chamaManager';
import {
  Receipt,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  DollarSign,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface IncomeExpensesModuleProps {
  transactions: CashTransaction[];
  group: GroupProfile;
  onAddTransaction: (tx: Omit<CashTransaction, 'id'>) => void;
}

export const IncomeExpensesModule: React.FC<IncomeExpensesModuleProps> = ({
  transactions,
  group,
  onAddTransaction,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<CashTransaction['category']>('Member Contributions');
  const [amountKes, setAmountKes] = useState(25000);
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('CBK-TX-' + Math.floor(100000 + Math.random() * 900000));

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amountKes, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amountKes, 0);

  const netCashFlow = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amountKes <= 0) return;

    onAddTransaction({
      date,
      type,
      category,
      amountKes,
      description,
      reference,
      recordedBy: 'CPA Peter Otieno',
      approvedBy: 'Eng. David Koech',
    });

    setIsModalOpen(false);
    setDescription('');
    setAmountKes(25000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <span>Income &amp; Expenditure Cashbook Ledger</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time operating accounts, member inflows, loan payouts, welfare benevolent disbursements &amp; overheads
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Cash Entry</span>
        </button>
      </div>

      {/* 3 Key Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Total Revenue &amp; Inflows
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            KES {totalIncome.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Contributions, loan repayments &amp; interest
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Total Disbursements &amp; Expenses
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-red-600 mt-1 tabular-nums">
            KES {totalExpense.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Welfare, hall hire, legal fees &amp; bank charges
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Net Chama Operating Balance
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            KES {netCashFlow.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Reconciled at Co-operative Bank A/C
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            All Entries
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              filterType === 'income'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Inflows Only
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              filterType === 'expense'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Expenses Only
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search description or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold uppercase text-[10px]">
                <th className="pb-3">Date</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Particulars &amp; Description</th>
                <th className="pb-3">Reference</th>
                <th className="pb-3">Signatories</th>
                <th className="pb-3 text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 text-neutral-500 tabular-nums">{tx.date}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                    {tx.category}
                  </td>
                  <td className="py-3 text-neutral-600 dark:text-neutral-400">
                    {tx.description}
                  </td>
                  <td className="py-3 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    {tx.reference}
                  </td>
                  <td className="py-3 text-[11px] text-neutral-500">
                    {tx.recordedBy} {tx.approvedBy && `· Auth: ${tx.approvedBy}`}
                  </td>
                  <td className="py-3 text-right font-bold tabular-nums">
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

      {/* Record Cash Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Record Cashbook Transaction
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
                  >
                    <option value="income">Income / Inflow (+)</option>
                    <option value="expense">Expense / Outflow (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CashTransaction['category'])}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                >
                  <option value="Member Contributions">Member Contributions</option>
                  <option value="Loan Repayments">Loan Repayments</option>
                  <option value="Loan Interest">Loan Interest</option>
                  <option value="Registration Fees">Registration Fees</option>
                  <option value="Fines & Penalties">Fines &amp; Penalties</option>
                  <option value="Welfare Payout">Welfare Payout</option>
                  <option value="Meeting Refreshments">Meeting Refreshments</option>
                  <option value="Bank Charges">Bank Charges</option>
                  <option value="Administrative & Legal">Administrative &amp; Legal</option>
                  <option value="Asset Acquisition">Asset Acquisition</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Amount in KES
                </label>
                <input
                  type="number"
                  value={amountKes}
                  onChange={(e) => setAmountKes(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Particulars / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. October AGM venue hire deposit"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Reference Code (M-Pesa / Cheque / Bank Ref)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Save Ledger Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
