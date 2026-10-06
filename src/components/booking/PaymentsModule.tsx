import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import {
  BookingPaymentRecord,
  BookingAppointment,
  PaymentMethod,
} from '../../types/booking';

interface PaymentsModuleProps {
  payments: BookingPaymentRecord[];
  appointments: BookingAppointment[];
  onRecordPayment: (payment: Omit<BookingPaymentRecord, 'id' | 'paidAt'>) => void;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  appointments,
  onRecordPayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form State
  const [selectedBookingId, setSelectedBookingId] = useState(appointments[0]?.id || '');
  const [amountKes, setAmountKes] = useState('2500');
  const [method, setMethod] = useState<PaymentMethod>('mpesa');
  const [phoneForMpesa, setPhoneForMpesa] = useState('+254 712 345 678');
  const [referenceCode, setReferenceCode] = useState('QKH' + Math.floor(1000 + Math.random() * 9000) + 'P');
  const [notes, setNotes] = useState('M-Pesa Buy Goods Till payment');
  const [isSimulatingSTK, setIsSimulatingSTK] = useState(false);
  const [stkSuccessMessage, setStkSuccessMessage] = useState<string | null>(null);

  const totalCollectedKes = payments.reduce((sum, p) => sum + p.amountKes, 0);
  const mpesaCollectedKes = payments
    .filter((p) => p.method === 'mpesa')
    .reduce((sum, p) => sum + p.amountKes, 0);

  const pendingBalancesKes = appointments
    .filter((a) => a.status !== 'cancelled' && a.paymentStatus !== 'paid')
    .reduce((sum, a) => sum + (a.priceKes - (a.paymentStatus === 'deposit_paid' ? a.depositAmountKes : 0)), 0);

  const filteredPayments = payments.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.bookingId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.referenceCode.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q)
    );
  });

  const handleOpenRecordForApt = (apt: BookingAppointment) => {
    setSelectedBookingId(apt.id);
    const balance = apt.priceKes - (apt.paymentStatus === 'deposit_paid' ? apt.depositAmountKes : 0);
    setAmountKes(balance > 0 ? balance.toString() : apt.priceKes.toString());
    setPhoneForMpesa(apt.customerPhone);
    setReferenceCode('QKH' + Math.floor(1000 + Math.random() * 9000) + 'X');
    setIsRecordModalOpen(true);
  };

  const handleTriggerSTKSimulation = () => {
    setIsSimulatingSTK(true);
    setTimeout(() => {
      setIsSimulatingSTK(false);
      const generatedCode = 'QKH' + Math.floor(1000 + Math.random() * 9000) + 'L';
      setReferenceCode(generatedCode);
      setStkSuccessMessage(`STK Push Received and PIN confirmed on ${phoneForMpesa}! M-Pesa Receipt: ${generatedCode}`);
    }, 1800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apt = appointments.find((a) => a.id === selectedBookingId);
    if (!apt) return;

    onRecordPayment({
      bookingId: apt.id,
      customerName: apt.customerName,
      amountKes: parseInt(amountKes) || 0,
      method,
      referenceCode: referenceCode || 'MANUAL_' + Date.now(),
      status: 'completed',
      notes,
    });

    setIsRecordModalOpen(false);
    setStkSuccessMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Deposits, Settlements &amp; M-Pesa Ledger (KES)
          </h2>
          <p className="text-xs text-neutral-500">
            Track deposit commitments, client settlement receipts, and Safaricom Paybill / Till transaction IDs.
          </p>
        </div>

        <button
          onClick={() => {
            setStkSuccessMessage(null);
            setIsRecordModalOpen(true);
          }}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Total Settled Revenue (KES)</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
            KES {totalCollectedKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            {payments.length} verified transactions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Safaricom M-Pesa Volume</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            KES {mpesaCollectedKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Paybill: 889210 · STK Instant Push
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs text-neutral-500 mb-1">Outstanding Balance on Open Bookings</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            KES {pendingBalancesKes.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            To be settled on arrival / completion
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference code or client..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <span className="text-xs text-neutral-500">
            Showing {filteredPayments.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-y border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3 py-2.5">Receipt ID</th>
                <th className="px-3 py-2.5">Booking Ref</th>
                <th className="px-3 py-2.5">Client</th>
                <th className="px-3 py-2.5">Amount (KES)</th>
                <th className="px-3 py-2.5">Channel</th>
                <th className="px-3 py-2.5">Provider Reference</th>
                <th className="px-3 py-2.5">Timestamp</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="px-3 py-3 font-mono font-bold text-neutral-900 dark:text-white">
                    {p.id}
                  </td>
                  <td className="px-3 py-3 font-mono text-neutral-600 dark:text-neutral-300">
                    {p.bookingId}
                  </td>
                  <td className="px-3 py-3 font-bold text-neutral-900 dark:text-white">
                    {p.customerName}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-neutral-900 dark:text-white">
                    KES {p.amountKes.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 capitalize">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.method === 'mpesa'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : p.method === 'card'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {p.method}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-neutral-800 dark:text-neutral-200">
                    {p.referenceCode}
                  </td>
                  <td className="px-3 py-3 text-neutral-500 text-[11px]">
                    {new Date(p.paidAt).toLocaleDateString()} {new Date(p.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-emerald-600 font-bold text-[10px] uppercase">
                      ● {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Record Customer Settlement
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Select Booking *
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} — {a.customerName} ({a.serviceName} · KES {a.priceKes})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Amount (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amountKes}
                    onChange={(e) => setAmountKes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="mpesa">Safaricom M-Pesa</option>
                    <option value="cash">Cash at Counter</option>
                    <option value="card">Card (Visa/Mastercard)</option>
                    <option value="bank_transfer">Bank EFT / NCBA</option>
                  </select>
                </div>
              </div>

              {method === 'mpesa' && (
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      M-Pesa STK Push Simulator
                    </span>
                    <button
                      type="button"
                      disabled={isSimulatingSTK}
                      onClick={handleTriggerSTKSimulation}
                      className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer disabled:opacity-50"
                    >
                      {isSimulatingSTK ? 'Sending Prompt...' : 'Send STK Push'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={phoneForMpesa}
                    onChange={(e) => setPhoneForMpesa(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full px-2.5 py-1 text-xs border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              )}

              {stkSuccessMessage && (
                <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                  {stkSuccessMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Receipt / Transaction Reference *
                </label>
                <input
                  type="text"
                  required
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
