import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Calendar,
  CreditCard,
  DollarSign,
  X,
  FileSpreadsheet,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import {
  PharmacyExpense,
  ExpenseCategory,
  PaymentMethod,
} from '../../types/pharmacyManager';

interface PharmExpensesModuleProps {
  expenses: PharmacyExpense[];
  onAddExpense: (expense: Omit<PharmacyExpense, 'id' | 'voucherNumber'>) => void;
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  regulatory_ppb: 'PPB Regulatory & Licensing',
  staff_wages: 'Staff Wages & Locum Pharmacists',
  electricity_cold_chain: 'Cold-Chain Electricity & Fuel',
  rent_premises: 'Premises Rent & Service Charge',
  packaging_disposables: 'Packaging Vials & Dispensing Envelopes',
  cleaning_supplies: 'Cleaning & Sterilization Supplies',
  equipment_maintenance: 'Fridge & Scale Calibration / Maintenance',
};

export const PharmExpensesModule: React.FC<PharmExpensesModuleProps> = ({
  expenses,
  onAddExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExpenseCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense State
  const [category, setCategory] = useState<ExpenseCategory>('packaging_disposables');
  const [description, setDescription] = useState('');
  const [amountKes, setAmountKes] = useState<number>(5000);
  const [expenseDate, setExpenseDate] = useState('2026-10-05');
  const [paidTo, setPaidTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseKes = filteredExpenses.reduce((sum, e) => sum + e.amountKes, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !paidTo.trim() || amountKes <= 0) return;

    onAddExpense({
      category,
      description: description.trim(),
      amountKes,
      expenseDate,
      paidTo: paidTo.trim(),
      paymentMethod,
    });

    setIsAddModalOpen(false);
    setDescription('');
    setPaidTo('');
    setAmountKes(5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <span>Dispensary Operational Expenses</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Log overhead operating costs, cold-chain backup utilities, PPB statutory compliance, and dispensary sundries.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense Voucher</span>
        </button>
      </div>

      {/* Expense Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Total Recorded Overhead</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-red-600 dark:text-red-400">
            {formatKes(totalExpenseKes)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">{filteredExpenses.length} payment vouchers</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Highest Cost Center</div>
          <div className="mt-1 text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 truncate">
            Staff &amp; Locum Pharmacists
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Dispensary coverage</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Cold Chain Backup Power</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-amber-600 dark:text-amber-400">
            {formatKes(
              expenses
                .filter((e) => e.category === 'electricity_cold_chain')
                .reduce((sum, e) => sum + e.amountKes, 0)
            )}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">Generator &amp; Kenya Power</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#11141a] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search voucher #, description, or payee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'all' | ExpenseCategory)}
            className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          >
            <option value="all">All Expense Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
              <option key={cat} value={cat}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                    {exp.voucherNumber}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    {exp.expenseDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {CATEGORY_LABELS[exp.category] || exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-sm text-neutral-800 dark:text-neutral-200">
                    {exp.description}
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                    {exp.paidTo}
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] font-semibold text-neutral-500 font-mono">
                      {exp.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {formatKes(exp.amountKes)}
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 text-xs">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Voucher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-600" />
                <span>Record Operational Expense Voucher</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Expense Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                >
                  {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                    <option key={cat} value={cat}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description / Purpose
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Purchase of 200 amber glass tablet containers and child-resistant caps"
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amountKes}
                    onChange={(e) => setAmountKes(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Payee / Vendor
                  </label>
                  <input
                    type="text"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    placeholder="e.g. Kenya Power / Locum Pharm"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 uppercase"
                  >
                    <option value="mpesa">M-Pesa</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_eft">Bank EFT</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
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
