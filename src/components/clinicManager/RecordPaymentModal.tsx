import React, { useState } from 'react';
import { Invoice, PaymentMethod } from '../../types/clinicManager';
import { CreditCard, X } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onRecordPayment: (invoiceId: string, amountPaidKes: number, paymentMethod: PaymentMethod, reference: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onRecordPayment,
}) => {
  const [amountPaidKes, setAmountPaidKes] = useState(invoice ? invoice.balanceKes : 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');
  const [reference, setReference] = useState('MPESA-QA' + Math.floor(100000 + Math.random() * 900000));

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountPaidKes <= 0) return;

    onRecordPayment(invoice.id, amountPaidKes, paymentMethod, reference.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#11141a] rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl text-xs"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Receive Outpatient Payment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-500">Invoice:</span>
            <span className="font-mono font-bold">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Patient:</span>
            <span className="font-bold">{invoice.patientName}</span>
          </div>
          <div className="flex justify-between text-amber-600 font-bold border-t border-neutral-200 dark:border-neutral-800 pt-1">
            <span>Outstanding Balance:</span>
            <span className="font-mono">KES {invoice.balanceKes.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-medium"
            >
              <option value="M-Pesa">M-Pesa</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="SHA / NHIF">SHA / Social Health Authority</option>
              <option value="Private Insurance">Private Insurance</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Amount to Receive (KES) *
            </label>
            <input
              type="number"
              value={amountPaidKes}
              onChange={(e) => setAmountPaidKes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Payment Reference / M-Pesa Code *
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold text-red-600"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
          >
            Record &amp; Issue Receipt
          </button>
        </div>
      </form>
    </div>
  );
};
