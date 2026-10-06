import React, { useState } from 'react';
import { Student, FeePayment, FeePaymentMethod } from '../../types/schoolManager';
import { X, CreditCard, Check, DollarSign } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialStudent?: Student | null;
  onRecordPayment: (payment: Omit<FeePayment, 'id' | 'receiptNumber'>) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudent,
  onRecordPayment,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );
  const [amountKes, setAmountKes] = useState<number>(
    initialStudent?.feeBalanceKes && initialStudent.feeBalanceKes > 0
      ? initialStudent.feeBalanceKes
      : 25000
  );
  const [paymentMethod, setPaymentMethod] = useState<FeePaymentMethod>('mpesa_paybill');
  const [transactionRef, setTransactionRef] = useState(
    `QK${Math.floor(100 + Math.random() * 900)}KM${Math.floor(100 + Math.random() * 900)}T`
  );
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Term 1 tuition & boarding fee payment');

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || amountKes <= 0) return;

    onRecordPayment({
      invoiceId: `inv-gen-${currentStudent.id}`,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      admissionNumber: currentStudent.admissionNumber,
      amountKes: Number(amountKes),
      paymentMethod,
      transactionReference: transactionRef.trim().toUpperCase(),
      paymentDate,
      recordedBy: 'Mr. Samuel K. Njoroge (Bursar)',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Record School Fee Payment
              </h2>
              <p className="text-[11px] text-neutral-500">
                Issue official cash/electronic receipt in KES
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
              Student Account *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.admissionNumber}) - Bal: KES {s.feeBalanceKes.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
              Payment Amount (KES) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">
                KES
              </span>
              <input
                type="number"
                required
                min={100}
                value={amountKes}
                onChange={(e) => setAmountKes(Number(e.target.value))}
                className="w-full pl-12 pr-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono font-bold text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Payment Channel *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="mpesa_paybill">M-Pesa (Paybill 400200)</option>
                <option value="kcb_bank">KCB Bank Deposit / RTGS</option>
                <option value="equity_bank">Equity Bank Deposit</option>
                <option value="cash">Direct Cash at Bursar</option>
                <option value="cheque">Banker's Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
              Transaction Code / Cheque # *
            </label>
            <input
              type="text"
              required
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. QK8899MM12T"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono font-bold uppercase focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
              Receipt Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Term 1 clearance, boarding top-up"
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Generate Official Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
