import React, { useState } from 'react';
import {
  Banknote,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Smartphone,
  CreditCard,
  Building,
  Calendar,
  X,
  Printer,
  ChevronDown,
} from 'lucide-react';
import {
  RentPayment,
  Tenant,
  Property,
  Unit,
  PaymentMethod,
} from '../../types/propertyManager';

interface PMRentManagementModuleProps {
  payments: RentPayment[];
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  onRecordPayment: (payment: Omit<RentPayment, 'id' | 'receiptNumber'>) => void;
  onSendReminder: (tenant: Tenant) => void;
  isRecordModalOpenInitially?: boolean;
  preselectedTenantId?: string;
}

export const PMRentManagementModule: React.FC<PMRentManagementModuleProps> = ({
  payments,
  tenants,
  properties,
  units,
  onRecordPayment,
  onSendReminder,
  isRecordModalOpenInitially = false,
  preselectedTenantId,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(isRecordModalOpenInitially);
  const [activeTab, setActiveTab] = useState<'tracker' | 'ledger' | 'outstanding'>('tracker');
  const [selectedReceipt, setSelectedReceipt] = useState<RentPayment | null>(null);

  // Form State
  const [paymentForm, setPaymentForm] = useState<{
    tenantId: string;
    amountKes: number;
    monthFor: string;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    transactionReference: string;
    notes: string;
  }>({
    tenantId: preselectedTenantId || tenants[0]?.id || '',
    amountKes: 65000,
    monthFor: 'October 2026',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'mpesa',
    transactionReference: '',
    notes: 'Paid via Safaricom Paybill 889210',
  });

  const [isSimulatingStk, setIsSimulatingStk] = useState(false);
  const [stkSuccessMessage, setStkSuccessMessage] = useState<string | null>(null);

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  // Month calculations
  const monthPayments = payments.filter((p) => p.monthFor === selectedMonth);
  const totalCollectedInMonth = monthPayments.reduce((sum, p) => sum + p.amountKes, 0);

  // Status for each occupied unit this month
  const occupiedUnits = units.filter((u) => u.status === 'occupied' && u.currentTenantId);
  const totalExpectedThisMonth = occupiedUnits.reduce((sum, u) => sum + u.monthlyRentKes, 0);
  const collectionPercentage =
    totalExpectedThisMonth > 0
      ? Math.min(100, Math.round((totalCollectedInMonth / totalExpectedThisMonth) * 100))
      : 0;

  // Track each tenant's payment status for selectedMonth
  const tenantPaymentStatusList = occupiedUnits.map((unit) => {
    const tenant = tenants.find((t) => t.id === unit.currentTenantId);
    const prop = properties.find((p) => p.id === unit.propertyId);
    const paidForMonth = payments
      .filter((p) => p.tenantId === tenant?.id && p.monthFor === selectedMonth)
      .reduce((sum, p) => sum + p.amountKes, 0);

    const isPaid = paidForMonth >= unit.monthlyRentKes;
    const isPartial = paidForMonth > 0 && paidForMonth < unit.monthlyRentKes;
    const isOverdue = paidForMonth === 0;

    return {
      unit,
      tenant,
      prop,
      monthlyRent: unit.monthlyRentKes,
      paidAmount: paidForMonth,
      status: isPaid ? 'paid' : isPartial ? 'partial' : 'unpaid',
      remaining: Math.max(0, unit.monthlyRentKes - paidForMonth),
    };
  });

  // Filtered payments ledger
  const filteredPayments = payments.filter((pay) => {
    const matchesMethod = methodFilter === 'all' || pay.paymentMethod === methodFilter;
    const q = searchQuery.toLowerCase();
    const tenant = tenants.find((t) => t.id === pay.tenantId);
    const matchesSearch =
      !searchQuery ||
      pay.receiptNumber.toLowerCase().includes(q) ||
      pay.transactionReference.toLowerCase().includes(q) ||
      (tenant && tenant.name.toLowerCase().includes(q));

    return matchesMethod && matchesSearch;
  });

  // Handle Record Submit
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.tenantId || paymentForm.amountKes <= 0) return;

    const tenant = tenants.find((t) => t.id === paymentForm.tenantId);
    const ref =
      paymentForm.transactionReference.trim() ||
      (paymentForm.paymentMethod === 'mpesa'
        ? `QKA${Math.floor(1000 + Math.random() * 9000)}KM`
        : `EFT-BK-${Date.now().toString().slice(-6)}`);

    onRecordPayment({
      propertyId: tenant?.propertyId || properties[0].id,
      unitId: tenant?.unitId || '',
      tenantId: paymentForm.tenantId,
      amountKes: Number(paymentForm.amountKes),
      monthFor: paymentForm.monthFor,
      paymentDate: paymentForm.paymentDate,
      paymentMethod: paymentForm.paymentMethod,
      transactionReference: ref,
      status: 'confirmed',
      notes: paymentForm.notes,
    });

    setIsRecordModalOpen(false);
  };

  // Simulate Safaricom M-Pesa STK Push
  const handleTriggerStkSimulation = () => {
    const tenant = tenants.find((t) => t.id === paymentForm.tenantId);
    if (!tenant) return;

    setIsSimulatingStk(true);
    setStkSuccessMessage(null);

    setTimeout(() => {
      const generatedRef = `QKB${Math.floor(1000 + Math.random() * 9000)}9P`;
      setPaymentForm((prev) => ({
        ...prev,
        transactionReference: generatedRef,
        notes: `Simulated M-Pesa STK prompt confirmed by ${tenant.phone} for Paybill 889210`,
      }));
      setIsSimulatingStk(false);
      setStkSuccessMessage(`M-Pesa Prompt Accepted on ${tenant.phone}! Receipt Code: ${generatedRef}`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Rent Management &amp; Payment Reconciliation
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Safaricom M-Pesa Paybill, direct bank EFTs, automated receipt issuance, and collection tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            <option value="October 2026">October 2026 (Current)</option>
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
          </select>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Collected ({selectedMonth.split(' ')[0]})</div>
          <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono mt-1 tabular-nums">
            {formatKes(totalCollectedInMonth)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {collectionPercentage}% of expected monthly gross
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Target Monthly Rent</div>
          <div className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono mt-1 tabular-nums">
            {formatKes(totalExpectedThisMonth)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Across {occupiedUnits.length} active leases
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Uncollected / Pending</div>
          <div className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400 font-mono mt-1 tabular-nums">
            {formatKes(Math.max(0, totalExpectedThisMonth - totalCollectedInMonth))}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {tenantPaymentStatusList.filter((x) => x.status === 'unpaid').length} tenants pending payment
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'tracker'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Monthly Tracker ({selectedMonth})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          All Receipts &amp; Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('outstanding')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'outstanding'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Outstanding Balances Ledger
        </button>
      </div>

      {/* Tab 1: Monthly Status Grid */}
      {activeTab === 'tracker' && (
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <tr>
                  <th className="py-3 px-4">Unit #</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Tenant Name</th>
                  <th className="py-3 px-4">Rent Due</th>
                  <th className="py-3 px-4">Paid for {selectedMonth.split(' ')[0]}</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {tenantPaymentStatusList.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {item.unit.unitNumber}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 truncate max-w-[140px]">
                      {item.prop?.name}
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                      {item.tenant?.name || 'Vacant'}
                      <div className="text-[10px] text-neutral-400">{item.tenant?.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                      {formatKes(item.monthlyRent)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold tabular-nums">
                      {item.paidAmount > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {formatKes(item.paidAmount)}
                        </span>
                      ) : (
                        <span className="text-neutral-400">KES 0</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          item.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : item.status === 'partial'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                        }`}
                      >
                        {item.status === 'paid'
                          ? 'Fully Paid'
                          : item.status === 'partial'
                          ? `Partial (KES ${item.remaining} due)`
                          : 'Unpaid / Overdue'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.status !== 'paid' && item.tenant && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onSendReminder(item.tenant!)}
                            className="px-2 py-1 text-[11px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 rounded flex items-center space-x-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Remind</span>
                          </button>
                          <button
                            onClick={() => {
                              setPaymentForm((prev) => ({
                                ...prev,
                                tenantId: item.tenant!.id,
                                amountKes: item.remaining,
                                monthFor: selectedMonth,
                              }));
                              setIsRecordModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-800 cursor-pointer"
                          >
                            Receive
                          </button>
                        </div>
                      )}
                      {item.status === 'paid' && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px] flex items-center justify-end space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: All Receipts & Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search receipts, references..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs self-start sm:self-auto">
              <button
                onClick={() => setMethodFilter('all')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                  methodFilter === 'all' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs' : 'text-neutral-500'
                }`}
              >
                All Channels
              </button>
              <button
                onClick={() => setMethodFilter('mpesa')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                  methodFilter === 'mpesa' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs' : 'text-neutral-500'
                }`}
              >
                M-Pesa
              </button>
              <button
                onClick={() => setMethodFilter('bank_eft')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                  methodFilter === 'bank_eft' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs' : 'text-neutral-500'
                }`}
              >
                Bank Wire / EFT
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Payment Date</th>
                    <th className="py-3 px-4">Tenant Name</th>
                    <th className="py-3 px-4">Property &amp; Unit</th>
                    <th className="py-3 px-4">Billing Month</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                  {filteredPayments.map((pay) => {
                    const tenant = tenants.find((t) => t.id === pay.tenantId);
                    const prop = properties.find((p) => p.id === pay.propertyId);
                    const unit = units.find((u) => u.id === pay.unitId);

                    return (
                      <tr
                        key={pay.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                          {pay.receiptNumber}
                        </td>
                        <td className="py-3 px-4 text-neutral-500">{pay.paymentDate}</td>
                        <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                          {tenant?.name}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          {prop?.name.split(' ')[0]} ({unit?.unitNumber})
                        </td>
                        <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                          {pay.monthFor}
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
                          {pay.paymentMethod === 'mpesa' ? 'M-Pesa Paybill' : 'Bank EFT'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                          {pay.transactionReference}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                          {formatKes(pay.amountKes)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedReceipt(pay)}
                            className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                            title="View / Print Receipt"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Outstanding Balances */}
      {activeTab === 'outstanding' && (
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Outstanding Balances Follow-Up Queue
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tenants with carry-forward balances or overdue arrears across all estate blocks.
            </p>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {tenants
              .filter((t) => t.balanceKes > 0)
              .map((t) => {
                const prop = properties.find((p) => p.id === t.propertyId);
                const unit = units.find((u) => u.id === t.unitId);
                return (
                  <div
                    key={t.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  >
                    <div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {t.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {prop?.name} ({unit?.unitNumber}) · Phone: {t.phone} · Employer: {t.employer}
                      </div>
                      {t.notes && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 italic">
                          "{t.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="font-mono text-base font-bold text-red-600 dark:text-red-400 tabular-nums">
                          {formatKes(t.balanceKes)}
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wide">
                          Overdue Amount
                        </div>
                      </div>

                      <button
                        onClick={() => onSendReminder(t)}
                        className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send SMS Demand</span>
                      </button>

                      <button
                        onClick={() => {
                          setPaymentForm((prev) => ({
                            ...prev,
                            tenantId: t.id,
                            amountKes: t.balanceKes,
                            monthFor: 'October 2026',
                          }));
                          setIsRecordModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Settle
                      </button>
                    </div>
                  </div>
                );
              })}

            {tenants.filter((t) => t.balanceKes > 0).length === 0 && (
              <div className="p-8 text-center text-neutral-400 text-xs">
                Zero outstanding tenant balances! All estate units are up to date.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Record Rent Payment */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
                  Payment Processing
                </span>
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                  Record Rent Payment
                </h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Select Tenant *
                </label>
                <select
                  value={paymentForm.tenantId}
                  onChange={(e) => {
                    const t = tenants.find((x) => x.id === e.target.value);
                    const u = units.find((x) => x.id === t?.unitId);
                    setPaymentForm({
                      ...paymentForm,
                      tenantId: e.target.value,
                      amountKes: t?.balanceKes && t.balanceKes > 0 ? t.balanceKes : u?.monthlyRentKes || 65000,
                    });
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                >
                  {tenants.map((t) => {
                    const u = units.find((x) => x.id === t.unitId);
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} — Unit {u?.unitNumber} ({formatKes(u?.monthlyRentKes || 0)}/mo)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Amount Paid (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amountKes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amountKes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Rent Month *
                  </label>
                  <select
                    value={paymentForm.monthFor}
                    onChange={(e) => setPaymentForm({ ...paymentForm, monthFor: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="October 2026">October 2026</option>
                    <option value="November 2026">November 2026</option>
                    <option value="September 2026">September 2026</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as PaymentMethod })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="mpesa">Safaricom M-Pesa Paybill</option>
                    <option value="bank_eft">Bank RTGS / EFT Transfer</option>
                    <option value="cash">Direct Cash Deposit</option>
                    <option value="cheque">Banker's Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              {/* M-Pesa STK Simulator Action */}
              {paymentForm.paymentMethod === 'mpesa' && (
                <div className="p-3 bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-900 dark:text-red-300 flex items-center space-x-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Safaricom M-Pesa Daraja STK Push</span>
                    </span>
                    <button
                      type="button"
                      disabled={isSimulatingStk}
                      onClick={handleTriggerStkSimulation}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded text-[11px] cursor-pointer"
                    >
                      {isSimulatingStk ? 'Sending Push...' : 'Send STK Prompt'}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    Sends direct USSD prompt to tenant phone for instant Paybill PIN entry.
                  </p>
                  {stkSuccessMessage && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded">
                      {stkSuccessMessage}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Receipt / Transaction Reference *
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.transactionReference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
                  placeholder="e.g. QKA882190K or EFT-EQ-99120"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Accounting Notes
                </label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="e.g. Received full month rent via Paybill"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm &amp; Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Single Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-600" />
                <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                  Paperglow Official Rent Receipt
                </span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-400 font-mono">{selectedReceipt.receiptNumber}</span>
                <span className="text-emerald-600 font-semibold uppercase text-[10px]">
                  Payment Verified
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Tenant:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {tenants.find((t) => t.id === selectedReceipt.tenantId)?.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Property:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {properties.find((p) => p.id === selectedReceipt.propertyId)?.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Rent Period:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedReceipt.monthFor}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction Reference:</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedReceipt.transactionReference}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Channel / Method:</span>
                <span className="uppercase text-[11px]">
                  {selectedReceipt.paymentMethod}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-baseline">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Amount Received:</span>
                <span className="font-mono text-base font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {formatKes(selectedReceipt.amountKes)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
