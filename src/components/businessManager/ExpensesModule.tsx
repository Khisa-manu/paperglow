import React, { useState, useMemo } from 'react';
import { ExpenseRecord, ExpenseCategory } from '../../types/businessManager';
import {
  WalletCards,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  Building,
  CreditCard,
  X,
  PieChart,
} from 'lucide-react';

interface ExpensesModuleProps {
  expenses: ExpenseRecord[];
  currencySymbol: string;
  onSaveExpense: (exp: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Rent & Utilities',
  'Payroll & Wages',
  'Raw Materials & Inventory',
  'Logistics & Delivery',
  'Software & Tech',
  'Marketing & Ads',
  'Office Supplies & Welfare',
  'Equipment & Maintenance',
  'Taxes & Compliance',
  'Miscellaneous',
];

export const ExpensesModule: React.FC<ExpensesModuleProps> = ({
  expenses,
  currencySymbol,
  onSaveExpense,
  onDeleteExpense,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Raw Materials & Inventory');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState('2026-03-31');
  const [payee, setPayee] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa_paybill');
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');

  const handleOpenCreate = () => {
    setDescription('');
    setCategory('Raw Materials & Inventory');
    setAmount(4500);
    setDate('2026-03-31');
    setPayee('');
    setPaymentMethod('mpesa_paybill');
    setStatus('Paid');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      voucherNumber: `VCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      category,
      description,
      amount: Number(amount),
      date,
      payee,
      paymentMethod,
      status,
      receiptAttached: true,
    };
    onSaveExpense(newExp);
    setIsModalOpen(false);
  };

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Breakdown by category
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.payee.toLowerCase().includes(search.toLowerCase()) ||
        e.voucherNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [expenses, search, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Overview Cards & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Expense KPI */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Total Recorded Expenses
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-100 mt-2 tabular-nums">
              {currencySymbol} {totalExpenseAmount.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Active ledger with {expenses.length} verified payment vouchers
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <button
              onClick={handleOpenCreate}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense Voucher</span>
            </button>
          </div>
        </div>

        {/* Category Breakdown (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-neutral-400" />
            <span>Monthly Category Expenditure Summary</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(categoryTotals).map(([cat, amt]) => {
              const pct = totalExpenseAmount > 0 ? Math.round((amt / totalExpenseAmount) * 100) : 0;
              return (
                <div
                  key={cat}
                  className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex justify-between items-center text-neutral-800 dark:text-neutral-200 font-semibold mb-1">
                    <span className="truncate">{cat}</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {currencySymbol} {amt.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-neutral-400 text-right mt-1 font-mono">
                    {pct}% of monthly outgoings
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description, payee, or voucher #..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Payee / Vendor</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount ({currencySymbol})</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {exp.voucherNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                    {exp.date}
                  </td>
                  <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200 font-medium">
                    {exp.category}
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                    {exp.description}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                    {exp.payee}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-mono text-neutral-500">
                    {exp.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded-sm"
                      title="Delete Expense Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Record New Expense Voucher
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Amount ({currencySymbol})</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Description / Particulars</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Purchase of 500gsm banner PVC rolls"
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Payee / Vendor</label>
                  <input
                    type="text"
                    required
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                    placeholder="Vendor Name"
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="mpesa_paybill">M-Pesa Paybill</option>
                    <option value="mpesa_till">M-Pesa Till</option>
                    <option value="bank_transfer">Bank Transfer (EFT)</option>
                    <option value="cash">Petty Cash</option>
                    <option value="credit_card">Credit / Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Payment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                >
                  Record Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
