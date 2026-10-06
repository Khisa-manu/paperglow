import React, { useState, useMemo } from 'react';
import {
  Invoice,
  PaymentReceipt,
  Patient,
  MedicalService,
  ClinicProfile,
  PaymentMethod,
} from '../../types/clinicManager';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Printer,
  Download,
  Calendar,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface BillingModuleProps {
  invoices: Invoice[];
  receipts: PaymentReceipt[];
  patients: Patient[];
  services: MedicalService[];
  clinic: ClinicProfile;
  onOpenCreateInvoice: () => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({
  invoices,
  receipts,
  patients,
  services,
  clinic,
  onOpenCreateInvoice,
  onRecordPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'receipts'>('invoices');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);

  const totalInvoicedKes = invoices.reduce((sum, i) => sum + i.totalAmountKes, 0);
  const totalPaidKes = invoices.reduce((sum, i) => sum + i.amountPaidKes, 0);
  const totalOutstandingKes = invoices.reduce((sum, i) => sum + i.balanceKes, 0);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.patientName.toLowerCase().includes(q) ||
        i.patientNumber.toLowerCase().includes(q) ||
        (i.paymentReference && i.paymentReference.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, searchQuery]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        r.receiptNumber.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.patientNumber.toLowerCase().includes(q) ||
        r.transactionReference.toLowerCase().includes(q)
      );
    });
  }, [receipts, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <span>Clinic Billing, Invoices &amp; M-Pesa Collections</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Outpatient fee structures, copay settlements, M-Pesa Till &amp; SHA/Insurance reconciliations in KES
          </p>
        </div>

        <button
          onClick={onOpenCreateInvoice}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* 4 Revenue Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Total Invoiced</span>
          <div className="text-xl font-black font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            KES {totalInvoicedKes.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-400 block mt-0.5">Across {invoices.length} patient bills</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold block">Total Collected</span>
          <div className="text-xl font-black font-['Poppins'] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            KES {totalPaidKes.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-400 block mt-0.5">M-Pesa, Cash &amp; Banked</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-semibold block">Outstanding Receivables</span>
          <div className="text-xl font-black font-['Poppins'] text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            KES {totalOutstandingKes.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-400 block mt-0.5">Pending copays &amp; claims</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 text-white rounded-xl shadow-2xs">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">M-Pesa Paybill</span>
          <div className="text-base font-bold font-mono text-red-400 mt-1">
            {clinic.mpesaPaybill}
          </div>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            Account: {clinic.mpesaAccountNumber}
          </span>
        </div>
      </div>

      {/* Tabs and Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              activeTab === 'receipts'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Receipts ({receipts.length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice #, patient, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
            />
          </div>

          {activeTab === 'invoices' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
            >
              <option value="all">All Invoice Statuses</option>
              <option value="paid">Paid in Full</option>
              <option value="partial">Partially Paid</option>
              <option value="pending">Pending Payment</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Table: Invoices View */}
      {activeTab === 'invoices' && (
        <div className="rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice #</th>
                  <th className="py-3 px-4 font-semibold">Patient Name &amp; No.</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Total (KES)</th>
                  <th className="py-3 px-4 font-semibold">Paid (KES)</th>
                  <th className="py-3 px-4 font-semibold">Balance (KES)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-neutral-400">
                      No invoices found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40">
                      <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                          {inv.patientName}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          {inv.patientNumber} &middot; {inv.patientPhone}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-neutral-500 tabular-nums">
                        {inv.date}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                        KES {inv.totalAmountKes.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        KES {inv.amountPaidKes.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold tabular-nums">
                        {inv.balanceKes > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400">
                            KES {inv.balanceKes.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Nil</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.status === 'paid'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : inv.status === 'partial'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedInvoiceForView(inv)}
                            className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                          >
                            View
                          </button>
                          {inv.balanceKes > 0 && (
                            <button
                              onClick={() => onRecordPayment(inv)}
                              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Receive Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receipts Table */}
      {activeTab === 'receipts' && (
        <div className="rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Receipt #</th>
                  <th className="py-3 px-4 font-semibold">Invoice Ref</th>
                  <th className="py-3 px-4 font-semibold">Patient Name</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Amount Paid (KES)</th>
                  <th className="py-3 px-4 font-semibold">Payment Method</th>
                  <th className="py-3 px-4 font-semibold">Tx Reference</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                {filteredReceipts.map((rcp) => (
                  <tr key={rcp.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40">
                    <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                      {rcp.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500">
                      {rcp.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                      {rcp.patientName}
                    </td>
                    <td className="py-3 px-4 text-neutral-500 tabular-nums">
                      {rcp.date}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      KES {rcp.amountPaidKes.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {rcp.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">
                      {rcp.transactionReference}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => window.print()}
                        className="p-1 rounded text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        title="Print Official Medical Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal Preview */}
      {selectedInvoiceForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-neutral-900 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-neutral-300 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold uppercase font-['Poppins'] text-red-700">
                  {clinic.name}
                </h3>
                <p className="text-[10px] text-neutral-500">
                  {clinic.locationAddress} &middot; KMPDC: {clinic.kmpdcLicense}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoiceForView(null)}
                className="text-neutral-400 hover:text-neutral-900 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold">Billed To:</span>
                <span className="font-bold text-sm block">{selectedInvoiceForView.patientName}</span>
                <span className="text-neutral-500">No: {selectedInvoiceForView.patientNumber}</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-red-600 block">{selectedInvoiceForView.invoiceNumber}</span>
                <span className="text-neutral-500">Date: {selectedInvoiceForView.date}</span>
              </div>
            </div>

            {/* Line items table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-600 border-b">
                  <tr>
                    <th className="py-2 px-3">Service / Medication</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit (KES)</th>
                    <th className="py-2 px-3 text-right">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-neutral-800">
                  {selectedInvoiceForView.items.map((itm) => (
                    <tr key={itm.id}>
                      <td className="py-2 px-3 font-medium">{itm.description}</td>
                      <td className="py-2 px-3 text-center font-mono">{itm.quantity}</td>
                      <td className="py-2 px-3 text-right font-mono">{itm.unitPriceKes.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{itm.amountKes.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 text-xs">
              <div className="w-56 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">KES {selectedInvoiceForView.subtotalKes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Paid:</span>
                  <span className="font-mono">KES {selectedInvoiceForView.amountPaidKes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold border-t pt-1 text-red-700">
                  <span>Balance Due:</span>
                  <span className="font-mono">KES {selectedInvoiceForView.balanceKes.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-xs">
              <span className="text-[10px] text-neutral-500">
                Paybill: <strong>{clinic.mpesaPaybill}</strong> &middot; Account: <strong>{selectedInvoiceForView.patientNumber}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
