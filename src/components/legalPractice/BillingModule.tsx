import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  X,
  FileText,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  LegalInvoice,
  InvoiceItem,
  LegalMatter,
  LegalClient,
  InvoiceStatus,
  PaymentMethod,
} from '../../types/legalPractice';

interface BillingModuleProps {
  invoices: LegalInvoice[];
  matters: LegalMatter[];
  clients: LegalClient[];
  onCreateInvoice: (invoice: Omit<LegalInvoice, 'id'>) => void;
  onRecordPayment: (invoiceId: string, amountPaidKes: number, method: PaymentMethod, refNumber: string) => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({
  invoices,
  matters,
  clients,
  onCreateInvoice,
  onRecordPayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoicePreview, setSelectedInvoicePreview] = useState<LegalInvoice | null>(null);

  // Payment Recording State
  const [payingInvoice, setPayingInvoice] = useState<LegalInvoice | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('mpesa_paybill');
  const [payRef, setPayRef] = useState<string>('MP-KES-' + Math.floor(100000 + Math.random() * 900000));

  // New Invoice Form State
  const [matterId, setMatterId] = useState(matters[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState('KOW/FEE/2026/' + Math.floor(100 + Math.random() * 900));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [profFeeAmount, setProfFeeAmount] = useState('450000');
  const [profFeeDesc, setProfFeeDesc] = useState('Professional Advocate Remuneration Order scale fees');
  const [disbursementAmount, setDisbursementAmount] = useState('35000');
  const [disbursementDesc, setDisbursementDesc] = useState('Court Registry Filing Fees & Process Server Disbursements');
  const [notes, setNotes] = useState('Payable within 14 days of issue to NCBA Client Trust Account.');

  const totalOutstandingKes = invoices.reduce((sum, inv) => sum + inv.balanceDueKes, 0);
  const totalBilledKes = invoices.reduce((sum, inv) => sum + inv.grandTotalKes, 0);
  const totalPaidKes = invoices.reduce((sum, inv) => sum + inv.amountPaidKes, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = matters.find((m) => m.id === matterId) || matters[0];
    const client = clients.find((c) => c.id === matter.clientId) || clients[0];

    const feeNum = parseFloat(profFeeAmount) || 0;
    const disbNum = parseFloat(disbursementAmount) || 0;
    const subtotal = feeNum + disbNum;
    const vat = Math.round(feeNum * 0.16); // 16% on professional fees
    const grand = subtotal + vat;

    const items: InvoiceItem[] = [
      {
        id: 'it-1',
        description: profFeeDesc,
        itemType: 'Professional Fees',
        units: 1,
        rateKes: feeNum,
        amountKes: feeNum,
      },
      {
        id: 'it-2',
        description: disbursementDesc,
        itemType: 'Disbursement / Court Fees',
        units: 1,
        rateKes: disbNum,
        amountKes: disbNum,
      },
    ];

    onCreateInvoice({
      invoiceNumber,
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      subtotalKes: subtotal,
      vatRatePercent: 16,
      vatAmountKes: vat,
      disbursementsTotalKes: disbNum,
      grandTotalKes: grand,
      amountPaidKes: 0,
      balanceDueKes: grand,
      status: 'issued',
      notes,
    });

    setIsCreateOpen(false);
    setInvoiceNumber('KOW/FEE/2026/' + Math.floor(100 + Math.random() * 900));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    const amt = parseFloat(payAmount) || 0;
    if (amt <= 0) return;

    onRecordPayment(payingInvoice.id, amt, payMethod, payRef);
    setPayingInvoice(null);
    setPayAmount('');
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.matterNumber.toLowerCase().includes(q) ||
        inv.matterTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Fee Notes, Disbursements &amp; Client Trust Ledger
          </h2>
          <p className="text-xs text-neutral-500">
            Professional fees under Advocates Remuneration Order, statutory 16% VAT, court registry disbursements, and M-Pesa / RTGS reconciliations in KES.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue New Fee Note</span>
        </button>
      </div>

      {/* Aggregate Financial Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Total Billed Fee Notes</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            KES {totalBilledKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Includes 16% VAT &amp; Court Disbursements</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Collections Received</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            KES {totalPaidKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600">Settled to Client Trust Account</span>
        </div>

        <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Outstanding Receivables</span>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
            KES {totalOutstandingKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-red-600 font-semibold">Active client recovery balance</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by fee note number, client or matter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Invoice Statuses ({invoices.length})</option>
              <option value="issued">Issued (Unpaid)</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Fully Settled</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-400">
            <thead className="bg-neutral-50 dark:bg-[#171a22] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Fee Note No</th>
                <th className="py-3 px-3">Client &amp; Matter File</th>
                <th className="py-3 px-3">Issued Date</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Grand Total (KES)</th>
                <th className="py-3 px-3">Paid / Balance Due</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-neutral-900 dark:text-white">{inv.clientName}</div>
                    <div className="text-[11px] font-mono text-neutral-400">{inv.matterNumber}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                    {inv.issueDate}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                    {inv.dueDate}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                    KES {inv.grandTotalKes.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                    <div className="text-emerald-600 font-semibold">
                      Paid: KES {inv.amountPaidKes.toLocaleString()}
                    </div>
                    <div className={inv.balanceDueKes > 0 ? 'text-red-600 font-bold' : 'text-neutral-400'}>
                      Due: KES {inv.balanceDueKes.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : inv.status === 'partially_paid'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                          : inv.status === 'overdue'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                      }`}
                    >
                      {inv.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {inv.balanceDueKes > 0 && (
                        <button
                          onClick={() => {
                            setPayingInvoice(inv);
                            setPayAmount(inv.balanceDueKes.toString());
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                        >
                          Record Pay
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoicePreview(inv)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="View Fee Note Preview"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                  Record Fee Note Payment
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  {payingInvoice.invoiceNumber} • {payingInvoice.clientName}
                </span>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex justify-between">
                <span>Remaining Balance Due:</span>
                <strong className="font-mono text-red-600">
                  KES {payingInvoice.balanceDueKes.toLocaleString()}
                </strong>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Amount (KES) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={payingInvoice.balanceDueKes}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  <option value="mpesa_paybill">M-Pesa Paybill (522522)</option>
                  <option value="rtgs_wire">RTGS / Bank Wire (NCBA Trust)</option>
                  <option value="bank_cheque">Banker's Cheque</option>
                  <option value="cash">Cash Office Receipt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Bank / M-Pesa Transaction Reference *
                </label>
                <input
                  type="text"
                  required
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Payment Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Issue Professional Fee Note
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Matter Case File *
                </label>
                <select
                  value={matterId}
                  onChange={(e) => setMatterId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.matterNumber}: {m.title} ({m.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Fee Note Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Professional Fees (KES) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={profFeeAmount}
                  onChange={(e) => setProfFeeAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Disbursements / Registry Expenses (KES)
                </label>
                <input
                  type="number"
                  min="0"
                  value={disbursementAmount}
                  onChange={(e) => setDisbursementAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between text-neutral-500">
                  <span>Professional Fees:</span>
                  <span className="font-mono">KES {(parseFloat(profFeeAmount) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>16% VAT on Fees:</span>
                  <span className="font-mono">KES {Math.round((parseFloat(profFeeAmount) || 0) * 0.16).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Disbursements:</span>
                  <span className="font-mono">KES {(parseFloat(disbursementAmount) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900 dark:text-white pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                  <span>Estimated Total:</span>
                  <span className="font-mono text-red-600">
                    KES {(
                      (parseFloat(profFeeAmount) || 0) +
                      Math.round((parseFloat(profFeeAmount) || 0) * 0.16) +
                      (parseFloat(disbursementAmount) || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Issue Fee Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {selectedInvoicePreview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                  Kamau, Omondi &amp; Wanjiku Advocates LLP
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
                  Fee Note / Invoice: {selectedInvoicePreview.invoiceNumber}
                </h3>
                <p className="text-xs text-neutral-500">
                  Date: {selectedInvoicePreview.issueDate} • Due: {selectedInvoicePreview.dueDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoicePreview(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
              <div>
                Billed To: <strong className="text-neutral-900 dark:text-white">{selectedInvoicePreview.clientName}</strong>
              </div>
              <div className="text-neutral-500">Matter: {selectedInvoicePreview.matterTitle} ({selectedInvoicePreview.matterNumber})</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Fee Note Itemization
              </h4>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {selectedInvoicePreview.items.map((it) => (
                  <div key={it.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">{it.description}</div>
                      <div className="text-[10px] text-neutral-400">{it.itemType}</div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      KES {it.amountKes.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal (Pre-Tax):</span>
                <span>KES {selectedInvoicePreview.subtotalKes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>VAT (16% Statutory):</span>
                <span>KES {selectedInvoicePreview.vatAmountKes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                <span>Grand Total:</span>
                <span>KES {selectedInvoicePreview.grandTotalKes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Total Paid:</span>
                <span>KES {selectedInvoicePreview.amountPaidKes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-600 font-bold">
                <span>Balance Due:</span>
                <span>KES {selectedInvoicePreview.balanceDueKes.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInvoicePreview(null)}
                className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
