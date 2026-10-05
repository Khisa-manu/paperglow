import React, { useState } from 'react';
import {
  PaymentTransaction,
  PaymentMethod,
  PaymentStatus,
  SalesDocument,
  BusinessSettings,
} from '../../types/businessManager';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Smartphone,
  Building,
  DollarSign,
  AlertCircle,
  Clock,
  RotateCw,
  X,
  ShieldCheck,
} from 'lucide-react';

interface PaymentsModuleProps {
  payments: PaymentTransaction[];
  documents: SalesDocument[];
  settings: BusinessSettings;
  currencySymbol: string;
  onRecordPayment: (txn: PaymentTransaction) => void;
  onSettleInvoice: (docId: string, amount: number, method: PaymentMethod, refCode: string) => void;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  documents,
  settings,
  currencySymbol,
  onRecordPayment,
  onSettleInvoice,
}) => {
  const [search, setSearch] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isStkSimulatorOpen, setIsStkSimulatorOpen] = useState(false);

  // Manual payment form fields
  const [targetDocId, setTargetDocId] = useState('');
  const [payerName, setPayerName] = useState('');
  const [amount, setAmount] = useState<number>(10000);
  const [method, setMethod] = useState<PaymentMethod>('mpesa_paybill');
  const [refCode, setRefCode] = useState('');
  const [notes, setNotes] = useState('');

  // STK Push Simulator fields
  const [stkPhone, setStkPhone] = useState('0712345678');
  const [stkDocId, setStkDocId] = useState('');
  const [stkAmount, setStkAmount] = useState<number>(48500);
  const [stkState, setStkState] = useState<'idle' | 'sending' | 'prompted' | 'confirmed'>('idle');

  const unpaidDocs = documents.filter((d) => d.status === 'unpaid' || d.status === 'overdue');

  const handleOpenRecord = () => {
    setTargetDocId(unpaidDocs[0]?.id || '');
    setPayerName(unpaidDocs[0]?.customerName || 'Walk-in Client');
    setAmount(unpaidDocs[0]?.grandTotal || 5000);
    setMethod('mpesa_paybill');
    setRefCode(`QF${Math.floor(100000 + Math.random() * 900000)}M9`);
    setNotes('Payment confirmed via statement.');
    setIsRecordModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = documents.find((d) => d.id === targetDocId);

    const newTxn: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      transactionReference: `TXN-2026-${Math.floor(100 + Math.random() * 900)}`,
      documentId: targetDocId || undefined,
      documentNumber: doc?.documentNumber || 'GENERAL-SALE',
      customerName: payerName,
      amount: Number(amount),
      method,
      status: 'completed',
      transactionDate: '2026-03-31 11:45',
      mpesaCode: refCode,
      notes,
    };

    onRecordPayment(newTxn);
    if (targetDocId) {
      onSettleInvoice(targetDocId, Number(amount), method, refCode);
    }
    setIsRecordModalOpen(false);
  };

  const handleTriggerStkPush = () => {
    setStkState('sending');
    setTimeout(() => {
      setStkState('prompted');
      setTimeout(() => {
        setStkState('confirmed');
        const generatedMpesaRef = `QA${Math.floor(10 + Math.random() * 89)}KJ${Math.floor(100 + Math.random() * 899)}M7`;
        const doc = documents.find((d) => d.id === stkDocId);

        const newTxn: PaymentTransaction = {
          id: `pay-${Date.now()}`,
          transactionReference: `TXN-MPESA-${Math.floor(1000 + Math.random() * 9000)}`,
          documentId: stkDocId || undefined,
          documentNumber: doc?.documentNumber || 'STK-SETTLE',
          customerName: doc?.customerName || 'M-Pesa Subscriber',
          amount: Number(stkAmount),
          method: 'mpesa_paybill',
          status: 'completed',
          transactionDate: 'Just now (Daraja Callback)',
          mpesaCode: generatedMpesaRef,
          phoneNumber: stkPhone,
          notes: `Simulated Daraja STK Push settlement to Paybill ${settings.mpesaDetails.paybillNumber}`,
        };

        onRecordPayment(newTxn);
        if (stkDocId) {
          onSettleInvoice(stkDocId, Number(stkAmount), 'mpesa_paybill', generatedMpesaRef);
        }
      }, 2500);
    }, 1500);
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.transactionReference.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      (p.documentNumber && p.documentNumber.toLowerCase().includes(q)) ||
      (p.mpesaCode && p.mpesaCode.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Architecture Ready for Daraja & Card Gateway */}
      <div className="p-4 rounded-lg bg-neutral-900 text-white border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>Safaricom M-Pesa Daraja &amp; Bank Gateway Architecture</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-xs bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                API Ready
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Production hook endpoints ready for Daraja STK Push (LIPA NA M-PESA ONLINE), C2B confirmation callbacks, and direct RTGS bank feeds.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setStkState('idle');
            setStkDocId(unpaidDocs[0]?.id || '');
            setStkAmount(unpaidDocs[0]?.grandTotal || 48500);
            setIsStkSimulatorOpen(true);
          }}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Smartphone className="w-4 h-4" />
          <span>Simulate M-Pesa STK Push</span>
        </button>
      </div>

      {/* Financial Settlement KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Total Settled Cashflow</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {currencySymbol} {totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Across {payments.length} verified transactions</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase">M-Pesa Paybill / Till Received</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            {currencySymbol}{' '}
            {payments
              .filter((p) => p.method === 'mpesa_paybill' || p.method === 'mpesa_till')
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Safaricom Business Settlement</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Unsettled Invoices Pending</div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-1 tabular-nums">
            {unpaidDocs.length} Documents
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Requires customer follow-up</div>
        </div>
      </div>

      {/* Action and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ref #, customer, or M-Pesa code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <button
          onClick={handleOpenRecord}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* Payment Ledger Table */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Document #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">M-Pesa / Bank Code</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Amount ({currencySymbol})</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {p.transactionReference}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                    {p.documentNumber || 'Direct Payment'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                    {p.customerName}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-mono text-neutral-500">
                    {p.method.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {p.mpesaCode || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-500 text-[11px]">
                    {p.transactionDate}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Record Incoming Settlement</h3>
              <button onClick={() => setIsRecordModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Apply to Invoice (Optional)</label>
                <select
                  value={targetDocId}
                  onChange={(e) => {
                    setTargetDocId(e.target.value);
                    const doc = documents.find((d) => d.id === e.target.value);
                    if (doc) {
                      setPayerName(doc.customerName);
                      setAmount(doc.grandTotal);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                >
                  <option value="">General Payment / Over-the-counter</option>
                  {unpaidDocs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.documentNumber} · {d.customerName} ({currencySymbol} {d.grandTotal.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Customer / Payer Name</label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="mpesa_paybill">M-Pesa Paybill</option>
                    <option value="mpesa_till">M-Pesa Buy Goods Till</option>
                    <option value="bank_transfer">Bank Transfer (EFT / RTGS)</option>
                    <option value="cash">Cash Settlement</option>
                    <option value="credit_card">Card Payment</option>
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
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">M-Pesa Code / Bank Reference</label>
                <input
                  type="text"
                  required
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="e.g. QF92KJ81M9 or FT260840192"
                  className="w-full px-2.5 py-1.5 font-mono rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Internal Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reconciliation note..."
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                >
                  Confirm &amp; Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safaricom M-Pesa Daraja STK Push Simulation Modal */}
      {isStkSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-xs bg-emerald-600 flex items-center justify-center text-white font-bold text-[10px]">
                  M
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Daraja STK Push Simulation
                </h3>
              </div>
              <button onClick={() => setIsStkSimulatorOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {stkState === 'idle' && (
              <div className="space-y-3">
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                  Simulate initiating an instant PIN prompt on the customer's Safaricom line via Daraja API:
                </p>

                <div>
                  <label className="block text-[11px] font-semibold mb-1">Select Invoice to Settle</label>
                  <select
                    value={stkDocId}
                    onChange={(e) => {
                      setStkDocId(e.target.value);
                      const d = documents.find((doc) => doc.id === e.target.value);
                      if (d) setStkAmount(d.grandTotal);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    {unpaidDocs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.documentNumber} · {d.customerName} ({currencySymbol} {d.grandTotal.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">M-Pesa Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={stkPhone}
                      onChange={(e) => setStkPhone(e.target.value)}
                      placeholder="0712345678"
                      className="w-full px-2.5 py-1.5 font-mono rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Amount ({currencySymbol})</label>
                    <input
                      type="number"
                      required
                      value={stkAmount}
                      onChange={(e) => setStkAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 font-mono rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-800 text-[11px] font-mono space-y-1 text-neutral-600 dark:text-neutral-400">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">API Payload Preview:</div>
                  <div>BusinessShortCode: {settings.mpesaDetails.paybillNumber}</div>
                  <div>TransactionType: "CustomerPayBillOnline"</div>
                  <div>PartyB: {settings.mpesaDetails.paybillNumber}</div>
                  <div>PhoneNumber: 254{stkPhone.replace(/^0/, '')}</div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerStkPush}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send STK Push Prompt</span>
                </button>
              </div>
            )}

            {stkState === 'sending' && (
              <div className="py-8 text-center space-y-3">
                <RotateCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Contacting Safaricom Daraja Gateway...
                </div>
                <p className="text-xs text-neutral-500">
                  Transmitting encrypted Lipa Na M-Pesa STK request to {stkPhone}.
                </p>
              </div>
            )}

            {stkState === 'prompted' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Customer Phone Prompt Active!
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Awaiting M-Pesa PIN entry on {stkPhone} for KES {stkAmount.toLocaleString()}...
                </p>
              </div>
            )}

            {stkState === 'confirmed' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-bold text-base text-emerald-600">
                  Payment Succeeded &amp; Invoice Cleared!
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Confirmed callback received from Safaricom. The invoice status has been updated to Paid and added to the financial ledger.
                </p>
                <button
                  type="button"
                  onClick={() => setIsStkSimulatorOpen(false)}
                  className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold rounded-md text-xs shadow-xs"
                >
                  Close Simulator
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
