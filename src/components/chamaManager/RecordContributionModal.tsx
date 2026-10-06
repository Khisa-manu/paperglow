import React, { useState } from 'react';
import { ContributionRecord, Member, GroupProfile } from '../../types/chamaManager';
import { X, CreditCard, CheckCircle2 } from 'lucide-react';

interface RecordContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  group: GroupProfile;
  onRecordContribution: (record: Omit<ContributionRecord, 'id'>) => void;
}

export const RecordContributionModal: React.FC<RecordContributionModalProps> = ({
  isOpen,
  onClose,
  members,
  group,
  onRecordContribution,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [month, setMonth] = useState('October 2026');
  const [amountKes, setAmountKes] = useState(group.monthlyContributionKes);
  const [welfareKes, setWelfareKes] = useState(group.monthlyWelfareKes);
  const [penaltyKes, setPenaltyKes] = useState(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<ContributionRecord['paymentMethod']>('mpesa');
  const [transactionReference, setTransactionReference] = useState(
    'QHK' + Math.floor(1000 + Math.random() * 9000) + 'M' + Math.floor(10 + Math.random() * 90)
  );

  if (!isOpen) return null;

  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];
  const totalPaidKes = amountKes + welfareKes + penaltyKes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    onRecordContribution({
      memberId: selectedMember.id,
      memberName: selectedMember.fullName,
      membershipNumber: selectedMember.membershipNumber,
      month,
      year: 2026,
      amountKes,
      welfareKes,
      penaltyKes,
      totalPaidKes,
      paymentDate,
      paymentMethod,
      transactionReference,
      recordedBy: 'CPA Peter Otieno (Treasurer)',
      status: 'confirmed',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#11141a] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Record Member Contribution
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Select Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.membershipNumber} — {m.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Contribution Cycle
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                <option value="October 2026">October 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="December 2026">December 2026</option>
                <option value="September 2026">September 2026 (Backlog)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Core Savings (KES)
              </label>
              <input
                type="number"
                value={amountKes}
                onChange={(e) => setAmountKes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Welfare (KES)
              </label>
              <input
                type="number"
                value={welfareKes}
                onChange={(e) => setWelfareKes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Penalty / Fines
              </label>
              <input
                type="number"
                value={penaltyKes}
                onChange={(e) => setPenaltyKes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold text-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as ContributionRecord['paymentMethod'])}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                <option value="mpesa">M-Pesa Paybill</option>
                <option value="bank_transfer">Co-op Bank EFT</option>
                <option value="cash">Cash Handover</option>
                <option value="cheque">Banker Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Receipt Reference
              </label>
              <input
                type="text"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">Total Payment To Reconcile:</span>
            <span className="text-base font-bold text-emerald-600 tabular-nums">
              KES {totalPaidKes.toLocaleString()}
            </span>
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
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Post to Member Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
