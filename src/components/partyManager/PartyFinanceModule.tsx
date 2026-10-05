import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  X,
  ShieldCheck,
} from 'lucide-react';
import { PartyFinanceTransaction, PartyBranch } from '../../types/partyManager';

interface PartyFinanceModuleProps {
  transactions: PartyFinanceTransaction[];
  branches: PartyBranch[];
  onAddTransaction: (txn: PartyFinanceTransaction) => void;
}

export const PartyFinanceModule: React.FC<PartyFinanceModuleProps> = ({
  transactions,
  branches,
  onAddTransaction,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // New Transaction Form State
  const [form, setForm] = useState<{
    direction: 'income' | 'expense';
    type: PartyFinanceTransaction['type'];
    amount: number;
    partyOrMemberName: string;
    branchId: string;
    paymentChannel: PartyFinanceTransaction['paymentChannel'];
    description: string;
  }>({
    direction: 'income',
    type: 'membership_dues',
    amount: 2400,
    partyOrMemberName: 'Member Dues Batch (M-Pesa)',
    branchId: branches[0]?.id || 'branch-nbi',
    paymentChannel: 'mpesa_paybill',
    description: 'Annual membership subscription payment',
  });

  const handleCreateTxn = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSeq = 100 + transactions.length + 1;
    const referenceNo = `TXN-2025-${nextSeq}`;
    const newTxn: PartyFinanceTransaction = {
      id: `fin-${Date.now()}`,
      referenceNo,
      type: form.type,
      direction: form.direction,
      amount: Number(form.amount),
      date: new Date().toISOString().split('T')[0],
      partyOrMemberName: form.partyOrMemberName,
      branchId: form.branchId,
      paymentChannel: form.paymentChannel,
      status: 'verified',
      description: form.description,
    };
    onAddTransaction(newTxn);
    setIsRecordModalOpen(false);
  };

  const totalIncome = transactions
    .filter((t) => t.direction === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.direction === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const duesIncome = transactions
    .filter((t) => t.type === 'membership_dues')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTxns = transactions.filter((t) => {
    const matchSearch =
      t.partyOrMemberName.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceNo.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchDirection = directionFilter === 'all' || t.direction === directionFilter;

    return matchSearch && matchType && matchDirection;
  });

  const handleExportStatement = () => {
    alert(
      'Exporting Certified Financial Statement FY 2024/2025 formatted for Office of Registrar of Political Parties & Auditor General submission.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Treasury & Financial Operations Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Compliant with Section 31 of Political Parties Act 2011 (Audited Party Accounts & Fund Oversight)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportStatement}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Statutory Statement</span>
          </button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Ledger Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Verified Inflows</span>
          <div className="mt-1 text-2xl font-bold text-emerald-600">
            KES {totalIncome.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Dues, donations & nominations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Disbursements</span>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            KES {totalExpense.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Regional grants & operations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Net Operating Fund Balance</span>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            KES {netBalance.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">Audited General Reserves</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">M-Pesa Subscriptions</span>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            KES {duesIncome.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">Paybill: 522522</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reference, recipient, memo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-red-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:border-red-500 focus:outline-hidden"
            >
              <option value="all">All Cash Flows (In & Out)</option>
              <option value="income">Inflows Only (Income)</option>
              <option value="expense">Outflows Only (Disbursements)</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:border-red-500 focus:outline-hidden"
            >
              <option value="all">All Category Codes</option>
              <option value="membership_dues">Membership Subscriptions</option>
              <option value="contribution">Non-Anonymous Donations</option>
              <option value="nomination_fee">Nomination & Vetting Fees</option>
              <option value="branch_grant">Regional Branch Grants</option>
              <option value="office_expense">Secretariat Lease & Utilities</option>
              <option value="event_logistics">Conference & Venue Logistics</option>
              <option value="legal_compliance">ORPP Statutory Filing Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref Number / Date</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Party / Member / Payee</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3 text-right">Amount (KES)</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredTxns.map((txn) => {
                const isIncome = txn.direction === 'income';

                return (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{txn.referenceNo}</div>
                      <div className="text-[11px] text-slate-400">{txn.date}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="capitalize font-semibold text-slate-700">
                        {txn.type.replace('_', ' ')}
                      </span>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{txn.description}</div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-800">
                      {txn.partyOrMemberName}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 capitalize">
                      {txn.paymentChannel.replace('_', ' ')}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold text-xs ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+ ' : '- '}
                      KES {txn.amount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Ledger Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Record Treasury Transaction
              </h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTxn} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Direction</label>
                  <select
                    value={form.direction}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        direction: e.target.value as 'income' | 'expense',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden font-bold"
                  >
                    <option value="income">Inflow (Deposit / Income)</option>
                    <option value="expense">Outflow (Disbursement / Expense)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (KES)</label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Accounting Type</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as PartyFinanceTransaction['type'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="membership_dues">Membership Dues</option>
                    <option value="contribution">Non-Anonymous Contribution</option>
                    <option value="nomination_fee">Nomination Fee</option>
                    <option value="branch_grant">Regional Branch Grant</option>
                    <option value="office_expense">Office Rent & Utilities</option>
                    <option value="event_logistics">Assembly Logistics</option>
                    <option value="legal_compliance">ORPP Compliance / Audit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={form.paymentChannel}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentChannel: e.target.value as PartyFinanceTransaction['paymentChannel'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="mpesa_paybill">M-Pesa Paybill #522522</option>
                    <option value="bank_transfer">Direct Bank Transfer</option>
                    <option value="cheque">Party Cheque</option>
                    <option value="direct_deposit">Direct Cash Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payee / Contributor / Member Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenya Commercial Bank / Member Batch"
                  value={form.partyOrMemberName}
                  onChange={(e) => setForm({ ...form, partyOrMemberName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Allocation</label>
                <select
                  value={form.branchId}
                  onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ledger Memo / Voucher Remarks</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                >
                  Verify & Commit Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
