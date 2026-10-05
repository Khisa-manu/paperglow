import React from 'react';
import { SalesDocument, BusinessSettings } from '../../types/businessManager';
import { Printer, Download, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrintDocumentModalProps {
  document: SalesDocument | null;
  settings: BusinessSettings;
  onClose: () => void;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  document,
  settings,
  onClose,
}) => {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  const isReceipt = document.documentType === 'receipt';
  const isQuotation = document.documentType === 'quotation';
  const isInvoice = document.documentType === 'invoice';

  const typeTitle = isReceipt ? 'OFFICIAL TAX RECEIPT' : isQuotation ? 'COMMERCIAL QUOTATION' : 'COMMERCIAL TAX INVOICE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 dark:border-neutral-800">
        {/* Modal Controls Bar (hidden during print) */}
        <div className="print:hidden p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/60 rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-sm">
              Print Preview
            </span>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {document.documentNumber} · {document.customerName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document A4 Sheet Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-neutral-100 dark:bg-neutral-950 flex justify-center">
          <div className="w-full max-w-[794px] bg-white text-neutral-900 p-8 sm:p-12 shadow-sm rounded-sm text-xs font-sans print:shadow-none print:p-0 print:m-0">
            {/* Header: Company Profile & Document Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-neutral-900 pb-6 gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 bg-red-600 text-white flex items-center justify-center font-bold text-xs rounded-xs">
                    PG
                  </div>
                  <h1 className="text-xl font-black tracking-tight text-neutral-950 uppercase">
                    {settings.legalTradingName}
                  </h1>
                </div>
                <p className="text-neutral-600 italic text-[11px] mb-2">{settings.tagline}</p>
                <div className="text-[11px] text-neutral-600 space-y-0.5">
                  <p>{settings.physicalAddress}, {settings.city}, Kenya</p>
                  <p>Tel: {settings.phone} · Email: {settings.email}</p>
                  <p className="font-semibold text-neutral-900">KRA PIN: {settings.kraPin}</p>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-base sm:text-lg font-black tracking-tight text-red-600 uppercase">
                  {typeTitle}
                </div>
                <div className="text-sm font-mono font-bold text-neutral-950 mt-1">
                  {document.documentNumber}
                </div>
                <div className="mt-2 text-[11px] space-y-0.5 text-neutral-600">
                  <p>Issue Date: <span className="font-semibold text-neutral-900">{document.issueDate}</span></p>
                  <p>Due Date: <span className="font-semibold text-neutral-900">{document.dueDate}</span></p>
                  <p>Status: <span className="font-bold uppercase text-red-600">{document.status}</span></p>
                </div>
              </div>
            </div>

            {/* Bill To & Payment Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-sm bg-neutral-50 border border-neutral-200">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Issued To (Client)
                </div>
                <div className="font-bold text-sm text-neutral-900">{document.customerName}</div>
                <div className="text-[11px] text-neutral-600 mt-1 space-y-0.5">
                  <p>{document.customerAddress}</p>
                  <p>Contact: {document.customerPhone} · {document.customerEmail}</p>
                  {document.customerKraPin && (
                    <p className="font-medium text-neutral-900">Client KRA PIN: {document.customerKraPin}</p>
                  )}
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Payment Terms &amp; Settlement
                </div>
                <p className="text-[11px] text-neutral-700">{document.paymentTerms}</p>
                {document.paidAt && (
                  <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                    Confirmed Paid on: {document.paidAt} ({document.paymentMethod})
                  </p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-neutral-300 rounded-xs overflow-hidden mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price ({settings.currency})</th>
                    <th className="py-2.5 px-3 text-right">Disc %</th>
                    <th className="py-2.5 px-3 text-right">Total ({settings.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-[11px]">
                  {document.items.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 1 ? 'bg-neutral-50/50' : 'bg-white'}>
                      <td className="py-2.5 px-3 font-mono text-neutral-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-neutral-900">{item.description}</td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">{item.unitPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">{item.discountPercent}%</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                        {item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div>
                <div className="p-3 rounded-sm bg-neutral-50 border border-neutral-200 text-[11px] space-y-1">
                  <div className="font-bold text-neutral-900">Payment Instructions:</div>
                  <div className="space-y-0.5 text-neutral-600">
                    <p>• <span className="font-semibold text-neutral-800">Safaricom M-Pesa Paybill:</span> {settings.mpesaDetails.paybillNumber} | Acc: {settings.mpesaDetails.accountNumber}</p>
                    <p>• <span className="font-semibold text-neutral-800">M-Pesa Buy Goods Till:</span> {settings.mpesaDetails.tillNumber}</p>
                    <p>• <span className="font-semibold text-neutral-800">Bank EFT:</span> {settings.bankDetails.bankName}, Acc: {settings.bankDetails.accountNumber}</p>
                    <p>• <span className="font-semibold text-neutral-800">Branch:</span> {settings.bankDetails.branch}</p>
                  </div>
                </div>
                {document.notes && (
                  <p className="mt-2 text-[10px] text-neutral-500 italic">
                    Note: {document.notes}
                  </p>
                )}
              </div>

              {/* Calculations Box */}
              <div className="border border-neutral-300 rounded-sm p-4 bg-neutral-50 text-[11px] space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-900">
                    {settings.currency} {document.subtotal.toLocaleString()}
                  </span>
                </div>
                {document.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono tabular-nums font-semibold">
                      - {settings.currency} {document.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                {settings.enableVat && (
                  <div className="flex justify-between text-neutral-600">
                    <span>KRA 16% VAT:</span>
                    <span className="font-mono tabular-nums font-semibold text-neutral-900">
                      {settings.currency} {Math.round(document.taxAmount).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-neutral-900 pt-2 flex justify-between text-sm font-bold text-neutral-950">
                  <span>Grand Total:</span>
                  <span className="font-mono tabular-nums text-red-600">
                    {settings.currency} {document.grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600 border-t border-neutral-200 pt-1">
                  <span>Amount Paid:</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-600">
                    {settings.currency} {document.amountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-neutral-900">
                  <span>Balance Due:</span>
                  <span className="font-mono tabular-nums text-red-600">
                    {settings.currency} {(document.grandTotal - document.amountPaid).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Signature & Official Footer */}
            <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-[10px] text-neutral-500">
              <div>
                <p>This is a system generated commercial document from Paperglow Business Manager.</p>
                <p>Verify all receipts against KRA E-TIMS or M-Pesa confirmation statements.</p>
              </div>
              <div className="text-center sm:text-right">
                <div className="w-44 border-b border-neutral-400 mb-1"></div>
                <p className="font-semibold text-neutral-800">Authorized Signature &amp; Stamp</p>
                <p>{settings.legalTradingName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
