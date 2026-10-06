import React, { useState } from 'react';
import { LoanRecord } from '../../types/chamaManager';
import { X, Banknote, CheckCircle2 } from 'lucide-react';

interface RecordRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanRecord | null;
  onRecordRepayment: (loanId: string, amountKes: number, reference: string, method: 'mpesa' | 'bank_transfer' | 'cash') => void;
}

export const RecordRepaymentModal: React.FC<RecordRepaymentModalProps> = ({
  isOpen,
  onClose,
  loan,
  onRecordRepayment,
}) => {
  const [amountKes, setAmountKes] = useState(loan?.monthlyInstallmentKes || 30000);
  const [method, setMethod] = useState<'mpesa' | 'bank_transfer' | 'cash'>('mpesa');
  const [reference, setReference] = useState('QHL' + Math.floor(1000 + Math.random() * 9000) + 'K9');

  if (!isOpen || !loan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountKes <= 0) return;

    onRecordRepayment(loan.id, amountKes, reference, method);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#11141a] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <Banknote className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Record Loan Repayment
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="font-bold text-neutral-900 dark:text-neutral-100">{loan.memberName}</div>
            <div className="text-[11px] text-neutral-500">
              {loan.loanType} · Outstanding Balance: <strong className="text-red-600">KES {loan.balanceKes.toLocaleString()}</strong>
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Repayment Installment Amount (KES)
            </label>
            <input
              type="number"
              value={amountKes}
              onChange={(e) => setAmountKes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Payment Channel
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'mpesa' | 'bank_transfer' | 'cash')}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="bank_transfer">Co-op Bank EFT</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Receipt / M-Pesa Code
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Post Repayment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
