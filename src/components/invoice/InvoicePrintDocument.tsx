import React from 'react';
import { InvoiceDocument } from '../../types/invoice';
import { calculateDocumentTotals, calculateItemTotal } from '../../data/invoiceGeneratorData';
import { Printer, Download, X, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface InvoicePrintDocumentProps {
  document: InvoiceDocument;
  onClose?: () => void;
  onEdit?: () => void;
  showControls?: boolean;
}

export const InvoicePrintDocument: React.FC<InvoicePrintDocumentProps> = ({
  document: doc,
  onClose,
  onEdit,
  showControls = true,
}) => {
  const totals = calculateDocumentTotals(doc);
  const isInvoice = doc.documentType === 'invoice';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Floating Action Bar (Hidden when printed) */}
      {showControls && (
        <div className="no-print p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center space-x-1.5 cursor-pointer text-neutral-700 dark:text-neutral-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
              </button>
            )}
            <span className="text-xs text-neutral-400">|</span>
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">
              {doc.documentNumber}
            </span>
            <span className="text-[11px] text-neutral-500 uppercase font-bold">
              ({doc.documentType})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Edit Details
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Printable A4 Container */}
      <div className="print-area max-w-4xl mx-auto bg-white text-neutral-900 p-8 sm:p-12 rounded-xl border border-neutral-200 shadow-md font-sans text-xs">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-neutral-300 pb-8">
          {/* Company Brand Lockup */}
          <div className="space-y-2 max-w-md">
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-xs bg-red-600"></span>
              <span className="text-2xl font-black font-['Poppins'] tracking-tight text-neutral-950">
                Paperglow
              </span>
            </div>
            <div className="text-[11px] text-neutral-700 font-semibold">
              {doc.company.name}
            </div>
            <div className="text-[11px] text-neutral-500 space-y-0.5 leading-relaxed">
              <div>{doc.company.address}, {doc.company.city}, {doc.company.country}</div>
              <div>Email: {doc.company.email} · Phone: {doc.company.phone}</div>
              <div className="font-mono text-neutral-800 font-bold">
                KRA PIN: {doc.company.taxId}
              </div>
            </div>
          </div>

          {/* Document Title & Reference Metadata */}
          <div className="text-left sm:text-right space-y-1">
            <div className="text-2xl font-black font-['Poppins'] tracking-tight text-red-600 uppercase">
              {isInvoice ? 'Tax Invoice' : 'Commercial Quotation'}
            </div>
            <div className="font-mono text-sm font-bold text-neutral-900">
              {doc.documentNumber}
            </div>
            <div className="pt-2 text-[11px] text-neutral-600 space-y-1 font-mono">
              <div>
                <span className="text-neutral-400 font-sans">Issue Date:</span>{' '}
                <span className="font-bold text-neutral-800">{doc.issueDate}</span>
              </div>
              <div>
                <span className="text-neutral-400 font-sans">
                  {isInvoice ? 'Due Date:' : 'Valid Until:'}
                </span>{' '}
                <span className="font-bold text-neutral-800">{doc.dueDate}</span>
              </div>
              <div>
                <span className="text-neutral-400 font-sans">Currency:</span>{' '}
                <span className="font-bold text-red-600">{doc.currency}</span>
              </div>
              <div className="pt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                    doc.status === 'paid' || doc.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : doc.status === 'overdue'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  Status: {doc.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-neutral-200">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {isInvoice ? 'Billed To Customer:' : 'Quotation Prepared For:'}
            </div>
            <div className="text-sm font-bold text-neutral-950 font-['Poppins']">
              {doc.customer.name}
            </div>
            {doc.customer.contactPerson && (
              <div className="text-[11px] text-neutral-700 font-medium">
                Attn: {doc.customer.contactPerson}
              </div>
            )}
            <div className="text-[11px] text-neutral-500 leading-relaxed">
              {doc.customer.address}
              {doc.customer.city && `, ${doc.customer.city}`}
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">
              Email: {doc.customer.email} · Phone: {doc.customer.phone}
            </div>
            {doc.customer.taxId && (
              <div className="text-[11px] font-mono text-neutral-800 font-semibold pt-0.5">
                Client KRA PIN: {doc.customer.taxId}
              </div>
            )}
          </div>

          <div className="space-y-1 sm:text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Settlement Channel
            </div>
            <div className="text-xs font-semibold text-neutral-800">
              Safaricom M-Pesa &amp; Electronic Bank Transfer
            </div>
            <div className="text-[11px] text-neutral-500 font-mono leading-relaxed pt-1">
              M-Pesa Paybill: <strong>{doc.company.mpesaPaybill || '247247'}</strong><br />
              Account: <strong>{doc.company.mpesaAccount || '0712345678'}</strong><br />
              Bank: <strong>{doc.company.bankName}</strong><br />
              Account No: <strong>{doc.company.bankAccountNumber}</strong>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-300 text-neutral-600 uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-2 w-8 text-neutral-400">#</th>
                <th className="py-2.5 px-2">Description / Specification</th>
                <th className="py-2.5 px-2 text-right">Qty</th>
                <th className="py-2.5 px-2 text-right">Unit Price ({doc.currency})</th>
                <th className="py-2.5 px-2 text-right">Disc %</th>
                <th className="py-2.5 px-2 text-right">VAT %</th>
                <th className="py-2.5 px-2 text-right">Amount ({doc.currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {doc.items.map((item, index) => {
                const itemCalc = calculateItemTotal(item);
                return (
                  <tr key={item.id || index} className="text-neutral-800">
                    <td className="py-3 px-2 text-neutral-400 font-mono">{index + 1}</td>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-neutral-950">{item.description}</div>
                      {item.category && (
                        <div className="text-[10px] text-neutral-400">{item.category}</div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-medium">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-neutral-500">
                      {item.discountPercent > 0 ? `${item.discountPercent}%` : '—'}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-neutral-500">
                      {item.taxPercent}%
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-neutral-950 tabular-nums">
                      {itemCalc.total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 border-t border-neutral-300 pt-6">
          {/* Notes and Terms */}
          <div className="sm:col-span-7 space-y-4">
            {doc.notes && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Customer Notes &amp; Scope Remarks
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed italic bg-neutral-50 p-3 rounded border border-neutral-200">
                  "{doc.notes}"
                </p>
              </div>
            )}

            {doc.paymentTerms && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Payment Terms &amp; Settlement Instructions
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded border border-neutral-200">
                  {doc.paymentTerms}
                </p>
              </div>
            )}

            {/* Official Stamp & Signatory Box */}
            <div className="pt-4 flex items-center space-x-8">
              <div className="border-t border-neutral-400 pt-1.5 w-44">
                <div className="text-[10px] uppercase font-bold text-neutral-500">Authorized Signature</div>
                <div className="text-[11px] font-bold text-neutral-800">Paperglow Accounts</div>
              </div>
              <div className="border border-dashed border-neutral-300 rounded p-2 text-center w-28 text-[9px] text-neutral-400">
                Official Company Stamp
              </div>
            </div>
          </div>

          {/* Financial Calculation Summary Box */}
          <div className="sm:col-span-5 space-y-2">
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono tabular-nums">{doc.currency} {totals.subtotal.toLocaleString()}</span>
              </div>

              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discounts Applied:</span>
                  <span className="font-mono tabular-nums">- {doc.currency} {totals.totalDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Net Taxable Base:</span>
                <span className="font-mono tabular-nums">{doc.currency} {totals.taxableAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Kenya Standard VAT (16%):</span>
                <span className="font-mono tabular-nums">{doc.currency} {totals.totalTax.toLocaleString()}</span>
              </div>

              {totals.shippingFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery / Logistics:</span>
                  <span className="font-mono tabular-nums">{doc.currency} {totals.shippingFee.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-2 border-t-2 border-neutral-300 flex justify-between items-baseline font-bold">
                <span className="text-neutral-950 font-['Poppins']">Grand Total:</span>
                <span className="text-base font-mono text-red-600 tabular-nums">
                  {doc.currency} {totals.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 text-center">
              Generated by Paperglow Platform · Nairobi, Kenya
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
