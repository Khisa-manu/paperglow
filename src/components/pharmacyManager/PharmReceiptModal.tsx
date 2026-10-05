import React from 'react';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SaleTransaction, PharmacySettings } from '../../types/pharmacyManager';

interface PharmReceiptModalProps {
  sale: SaleTransaction | null;
  settings: PharmacySettings;
  isOpen: boolean;
  onClose: () => void;
}

export const PharmReceiptModal: React.FC<PharmReceiptModalProps> = ({
  sale,
  settings,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatKes = (num: number) => `KES ${num.toLocaleString('en-KE')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
              Official Pharmacy Dispensary Receipt
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 text-neutral-800 dark:text-neutral-200 font-sans text-xs bg-white dark:bg-neutral-900">
          {/* Pharmacy Header */}
          <div className="text-center pb-4 border-b border-dashed border-neutral-300 dark:border-neutral-700 space-y-1">
            <div className="flex items-center justify-center space-x-1 text-red-600 font-bold text-base font-['Poppins']">
              <span>{settings.pharmacyName}</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{settings.physicalAddress}</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              Tel: {settings.phone} | Email: {settings.email}
            </p>
            <div className="pt-1 flex items-center justify-center space-x-3 text-[10px] text-neutral-500 font-mono">
              <span>PPB Lic: {settings.ppbPremisesLicense}</span>
              <span>KRA PIN: {settings.kraPin}</span>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="py-3 border-b border-dashed border-neutral-300 dark:border-neutral-700 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-neutral-500">RECEIPT NO:</span>
              <span className="font-bold">{sale.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">DATE & TIME:</span>
              <span>{sale.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">PATIENT/CUSTOMER:</span>
              <span className="font-semibold">{sale.customerName}</span>
            </div>
            {sale.customerPhone && (
              <div className="flex justify-between">
                <span className="text-neutral-500">CONTACT:</span>
                <span>{sale.customerPhone}</span>
              </div>
            )}
            {sale.doctorPrescriber && (
              <div className="flex justify-between">
                <span className="text-neutral-500">PRESCRIBER:</span>
                <span>{sale.doctorPrescriber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">DISPENSED BY:</span>
              <span>{sale.dispensedBy}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-3 border-b border-dashed border-neutral-300 dark:border-neutral-700">
            <div className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-2 grid grid-cols-12 gap-1 font-mono">
              <div className="col-span-6">ITEM / BATCH</div>
              <div className="col-span-2 text-center">QTY</div>
              <div className="col-span-2 text-right">PRICE</div>
              <div className="col-span-2 text-right">TOTAL</div>
            </div>

            <div className="space-y-2">
              {sale.items.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <div className="grid grid-cols-12 gap-1 items-baseline">
                    <div className="col-span-6">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{item.productName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">Batch: {item.batchNumber}</div>
                      {item.dosageInstructions && (
                        <div className="text-[10px] italic text-red-600 dark:text-red-400 mt-0.5">
                          Sig: {item.dosageInstructions}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 text-center font-mono">{item.quantity}</div>
                    <div className="col-span-2 text-right font-mono">{item.unitPriceKes.toLocaleString()}</div>
                    <div className="col-span-2 text-right font-mono font-semibold">
                      {item.totalPriceKes.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="py-3 border-b border-dashed border-neutral-300 dark:border-neutral-700 space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span>{formatKes(sale.subtotalKes)}</span>
            </div>
            {sale.discountKes > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount</span>
                <span>-{formatKes(sale.discountKes)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-neutral-50 pt-1 border-t border-neutral-200 dark:border-neutral-800">
              <span>TOTAL DUE</span>
              <span className="text-red-600 dark:text-red-400">{formatKes(sale.totalAmountKes)}</span>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="py-3 border-b border-dashed border-neutral-300 dark:border-neutral-700 space-y-1 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-neutral-500">Payment Channel:</span>
              <span className="font-semibold uppercase tracking-wide">
                {sale.paymentMethod === 'mpesa'
                  ? 'M-PESA SAFARICOM'
                  : sale.paymentMethod === 'cash'
                  ? 'CASH'
                  : sale.paymentMethod === 'card'
                  ? 'VISA/MASTERCARD'
                  : 'INSURANCE CLAIM'}
              </span>
            </div>
            {sale.mpesaRef && (
              <div className="flex justify-between font-mono text-neutral-600 dark:text-neutral-400">
                <span>M-Pesa Trans ID:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{sale.mpesaRef}</span>
              </div>
            )}
            <div className="flex justify-between font-mono">
              <span className="text-neutral-500">Payment Status:</span>
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {sale.paymentStatus}
              </span>
            </div>
          </div>

          {/* Legal / Pharmacy Regulatory Footer */}
          <div className="pt-4 text-center space-y-2">
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Certified Dispensary • Good Pharmacy Practice (GPP)</span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-relaxed italic">
              {settings.receiptFooterText}
            </p>
            <div className="text-[9px] text-neutral-400 font-mono pt-1">
              Generated via Paperglow Pharmacy Manager • www.paperglow.co.ke
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md cursor-pointer transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
