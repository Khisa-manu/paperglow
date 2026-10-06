import React, { useState } from 'react';
import {
  FeeInvoice,
  FeePayment,
  FeeStructureItem,
  Student,
  SchoolSettings,
} from '../../types/schoolManager';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Download,
  Building2,
  X,
} from 'lucide-react';

interface FeesModuleProps {
  invoices: FeeInvoice[];
  payments: FeePayment[];
  feeStructures: FeeStructureItem[];
  students: Student[];
  settings: SchoolSettings;
  onOpenRecordPayment: (student?: Student) => void;
}

export const FeesModule: React.FC<FeesModuleProps> = ({
  invoices,
  payments,
  feeStructures,
  students,
  settings,
  onOpenRecordPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'structure'>('invoices');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);

  // Totals
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.amountDueKes, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.amountKes, 0);
  const totalArrears = invoices.reduce((acc, i) => acc + i.balanceKes, 0);
  const collectionPercent =
    totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.studentName.toLowerCase().includes(q) ||
      inv.admissionNumber.toLowerCase().includes(q) ||
      inv.invoiceNumber.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter((pay) => {
    const q = searchQuery.toLowerCase();
    return (
      pay.studentName.toLowerCase().includes(q) ||
      pay.admissionNumber.toLowerCase().includes(q) ||
      pay.receiptNumber.toLowerCase().includes(q) ||
      pay.transactionReference.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            School Fees, Bursary &amp; Payment Accounts
          </h1>
          <p className="text-xs text-neutral-500">
            Financial ledger, fee structures, M-Pesa Paybill reconciliations and student arrears
          </p>
        </div>

        <button
          onClick={() => onOpenRecordPayment()}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Fee Payment</span>
        </button>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase">Total Term Invoiced</span>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            KES {totalInvoiced.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500">Across active student rolls</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 uppercase">Fees Collected</span>
          <div className="text-xl font-bold font-mono text-emerald-600">
            KES {totalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500">M-Pesa &amp; KCB Bank Cleared</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase">Outstanding Arrears</span>
          <div className="text-xl font-bold font-mono text-amber-500">
            KES {totalArrears.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500">
            {invoices.filter((i) => i.balanceKes > 0).length} accounts with balances
          </span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase">Collection Efficiency</span>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {collectionPercent}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">BOM Target: 85% by Mid-term</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'invoices'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Student Fee Accounts ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'payments'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Payment Receipts Log ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('structure')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'structure'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Fee Structure Schedules</span>
        </button>
      </div>

      {/* Tab 1: Invoices & Balances */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or invoice #..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Fully Paid</option>
                <option value="partial">Partially Paid</option>
                <option value="overdue">Overdue Arrears</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-right">Billed (KES)</th>
                  <th className="py-3 px-4 text-right">Paid (KES)</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {inv.studentName}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {inv.admissionNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
                      {inv.className}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      KES {inv.amountDueKes.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      KES {inv.amountPaidKes.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {inv.balanceKes > 0 ? (
                        <span className="font-bold text-red-600 dark:text-red-400">
                          KES {inv.balanceKes.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">KES 0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : inv.status === 'partial'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {inv.balanceKes > 0 && (
                        <button
                          onClick={() => {
                            const target = students.find((s) => s.id === inv.studentId);
                            onOpenRecordPayment(target);
                          }}
                          className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-bold text-[11px] cursor-pointer"
                        >
                          Receive Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Payment Receipts Log */}
      {activeTab === 'payments' && (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Channel &amp; Ref</th>
                <th className="py-3 px-4 text-right">Amount (KES)</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {filteredPayments.map((pay) => (
                <tr
                  key={pay.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {pay.receiptNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {pay.studentName}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {pay.admissionNumber}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold uppercase text-[10px] text-neutral-600 dark:text-neutral-400">
                      {pay.paymentMethod.replace('_', ' ')}
                    </div>
                    <div className="font-mono text-neutral-500 font-semibold">
                      {pay.transactionReference}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    KES {pay.amountKes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-500">{pay.paymentDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedReceipt(pay)}
                      className="px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer flex items-center space-x-1 ml-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Fee Structure Schedules */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feeStructures.map((f) => (
            <div
              key={f.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    {f.classLevel}
                  </h3>
                  <span className="text-[11px] text-neutral-500">{f.term} Fee Schedule</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                  Approved BOM 2026
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-800/40">
                  <span className="text-neutral-500">Tuition &amp; Laboratory Fee</span>
                  <span className="font-mono font-semibold">
                    KES {f.tuitionFeeKes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-800/40">
                  <span className="text-neutral-500">Boarding &amp; Catering Fee</span>
                  <span className="font-mono font-semibold">
                    KES {f.boardingFeeKes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-800/40">
                  <span className="text-neutral-500">Activity &amp; Sports Levy</span>
                  <span className="font-mono font-semibold">
                    KES {f.activityFeeKes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-800/40">
                  <span className="text-neutral-500">Examinations &amp; Testing</span>
                  <span className="font-mono font-semibold">
                    KES {f.examFeeKes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50 dark:border-neutral-800/40">
                  <span className="text-neutral-500">Development Levy</span>
                  <span className="font-mono font-semibold">
                    KES {f.developmentLevyKes.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between text-xs font-bold">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase">Day Scholar Total</div>
                  <div className="font-mono text-neutral-900 dark:text-neutral-100 text-sm">
                    KES {f.totalDayScholarKes.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-neutral-400 uppercase">Boarder Total</div>
                  <div className="font-mono text-red-600 dark:text-red-400 text-sm">
                    KES {f.totalBoarderKes.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Receipt Header */}
            <div className="border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-4 text-center space-y-1">
              <div className="font-extrabold text-base text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                {settings.schoolName}
              </div>
              <div className="text-[11px] text-neutral-500">
                {settings.physicalAddress} • {settings.poBox}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                MOE Reg: {settings.registrationNumber} • Paybill: {settings.mpesaPaybill}
              </div>
              <div className="inline-block mt-1 px-3 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold uppercase text-[10px]">
                Official School Fee Receipt
              </div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-2 py-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Receipt Number:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedReceipt.receiptNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date Paid:</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">
                  {selectedReceipt.paymentDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Student Name:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedReceipt.studentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Admission Number:</span>
                <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  {selectedReceipt.admissionNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Channel:</span>
                <span className="uppercase font-semibold text-neutral-800 dark:text-neutral-200">
                  {selectedReceipt.paymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction Ref Code:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedReceipt.transactionReference}
                </span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold">Amount Paid</span>
                <div className="text-xl font-bold font-mono text-emerald-600">
                  KES {selectedReceipt.amountKes.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 font-bold uppercase">Issued By</span>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {selectedReceipt.recordedBy}
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-neutral-400 italic pt-1">
              "Thank you for investing in quality character and academic excellence."
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
