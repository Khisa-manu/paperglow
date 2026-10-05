import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Calendar,
  Building,
  DollarSign,
  X,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import {
  PropertyExpense,
  Property,
  ExpenseCategory,
  PaymentMethod,
} from '../../types/propertyManager';

interface PMExpensesModuleProps {
  expenses: PropertyExpense[];
  properties: Property[];
  onAddExpense: (expense: Omit<PropertyExpense, 'id' | 'voucherNumber'>) => void;
}

export const PMExpensesModule: React.FC<PMExpensesModuleProps> = ({
  expenses,
  properties,
  onAddExpense,
}) => {
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExpenseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState<{
    propertyId: string;
    category: ExpenseCategory;
    description: string;
    amountKes: number;
    expenseDate: string;
    paidTo: string;
    paymentMethod: PaymentMethod;
  }>({
    propertyId: properties[0]?.id || '',
    category: 'utilities',
    description: '',
    amountKes: 25000,
    expenseDate: new Date().toISOString().split('T')[0],
    paidTo: 'Kenya Power & Lighting Co',
    paymentMethod: 'mpesa',
  });

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredExpenses = expenses.filter((e) => {
    const propMatch = propertyFilter === 'all' || e.propertyId === propertyFilter;
    const catMatch = categoryFilter === 'all' || e.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const searchMatch =
      !searchQuery ||
      e.voucherNumber.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.paidTo.toLowerCase().includes(q);

    return propMatch && catMatch && searchMatch;
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amountKes, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId || !form.description || form.amountKes <= 0) return;

    onAddExpense({
      propertyId: form.propertyId,
      category: form.category,
      description: form.description,
      amountKes: Number(form.amountKes),
      expenseDate: form.expenseDate,
      paidTo: form.paidTo,
      paymentMethod: form.paymentMethod,
    });

    setIsAddExpenseModalOpen(false);
    setForm((prev) => ({ ...prev, description: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Property Operating Expenses
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Log security guards, caretaker payroll, KPLC common area power tokens, Nairobi Water, and county land rates.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Expense Voucher</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense description, payee, voucher..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Property Filter */}
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">All Categories</option>
            <option value="utilities">Utilities (KPLC / Water)</option>
            <option value="security_guards">Security &amp; Guards</option>
            <option value="caretaker_wages">Caretaker Wages</option>
            <option value="repairs_maintenance">Repairs &amp; Maintenance</option>
            <option value="taxes_county_rates">County Land Rates &amp; Tax</option>
            <option value="waste_management">Garbage &amp; Waste</option>
            <option value="supplies">Cleaning &amp; Supplies</option>
          </select>
        </div>
      </div>

      {/* Aggregate Banner */}
      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
        <span className="text-neutral-500 font-medium">
          Showing {filteredExpenses.length} expense vouchers
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Total Filtered Outflow:</span>
          <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 tabular-nums">
            {formatKes(totalExpenseAmount)}
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expense Description</th>
                <th className="py-3 px-4">Vendor / Payee</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4 text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No operating expenses logged under this view.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const prop = properties.find((p) => p.id === exp.propertyId);
                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {exp.voucherNumber}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">
                        {exp.expenseDate}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 font-medium truncate max-w-[140px]">
                        {prop?.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                          {exp.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[240px]">
                        {exp.description}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 truncate max-w-[150px]">
                        {exp.paidTo}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[10px] text-neutral-500">
                        {exp.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums text-right">
                        {formatKes(exp.amountKes)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Expense */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Log Property Expense Voucher
              </h3>
              <button
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Property *
                  </label>
                  <select
                    value={form.propertyId}
                    onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Expense Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="utilities">Utilities (KPLC / Water)</option>
                    <option value="security_guards">Security Guards</option>
                    <option value="caretaker_wages">Caretaker Wages</option>
                    <option value="repairs_maintenance">Repairs &amp; Upkeep</option>
                    <option value="taxes_county_rates">County Land Rates</option>
                    <option value="waste_management">Garbage Collection</option>
                    <option value="supplies">Cleaning &amp; Supplies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description of Expenditure *
                </label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. October KPLC power tokens for lift motors"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Amount (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.amountKes}
                    onChange={(e) => setForm({ ...form, amountKes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={form.expenseDate}
                    onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Paid To / Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.paidTo}
                    onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
                    placeholder="e.g. G4S Security Kenya"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="mpesa">Safaricom M-Pesa</option>
                    <option value="bank_eft">Bank RTGS / EFT</option>
                    <option value="cash">Petty Cash</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
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
