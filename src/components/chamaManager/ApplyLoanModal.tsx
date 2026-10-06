import React, { useState } from 'react';
import { LoanRecord, Member, GroupProfile } from '../../types/chamaManager';
import { X, Banknote, AlertCircle } from 'lucide-react';

interface ApplyLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  group: GroupProfile;
  onApplyLoan: (loan: Omit<LoanRecord, 'id' | 'amountRepaidKes' | 'balanceKes' | 'repayments'>) => void;
}

export const ApplyLoanModal: React.FC<ApplyLoanModalProps> = ({
  isOpen,
  onClose,
  members,
  group,
  onApplyLoan,
}) => {
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [loanType, setLoanType] = useState<LoanRecord['loanType']>('Development Loan');
  const [principalAmountKes, setPrincipalAmountKes] = useState(200000);
  const [durationMonths, setDurationMonths] = useState(6);
  const [purpose, setPurpose] = useState('');
  const [guarantor1Id, setGuarantor1Id] = useState(members[1]?.id || '');
  const [guarantor2Id, setGuarantor2Id] = useState(members[2]?.id || '');
  const [guarantor1Amount, setGuarantor1Amount] = useState(100000);
  const [guarantor2Amount, setGuarantor2Amount] = useState(100000);

  if (!isOpen) return null;

  const applicant = members.find((m) => m.id === memberId) || members[0];
  const maxBorrowLimit = (applicant?.totalContributionsKes || 0) * group.loanMaxMultiplier;

  const interestRatePercent = group.loanInterestRatePercent;
  const interestAmountKes = Math.round(principalAmountKes * (interestRatePercent / 100));
  const totalRepayableKes = principalAmountKes + interestAmountKes;
  const monthlyInstallmentKes = Math.round(totalRepayableKes / (durationMonths || 1));

  const g1 = members.find((m) => m.id === guarantor1Id);
  const g2 = members.find((m) => m.id === guarantor2Id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicant || !purpose.trim()) return;

    onApplyLoan({
      memberId: applicant.id,
      memberName: applicant.fullName,
      membershipNumber: applicant.membershipNumber,
      loanType,
      principalAmountKes,
      interestRatePercent,
      interestAmountKes,
      totalRepayableKes,
      durationMonths,
      monthlyInstallmentKes,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending_approval',
      guarantors: [
        { memberId: guarantor1Id, memberName: g1?.fullName || 'Guarantor 1', amountPledgedKes: guarantor1Amount },
        { memberId: guarantor2Id, memberName: g2?.fullName || 'Guarantor 2', amountPledgedKes: guarantor2Amount },
      ],
      purpose,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#11141a] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <Banknote className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Apply for Chama Loan Facility
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Applicant Member
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.membershipNumber} — {m.fullName} (Savings: KES {m.totalContributionsKes.toLocaleString()})
                </option>
              ))}
            </select>
            <div className="mt-1 text-[11px] text-neutral-500">
              Max credit allowance ({group.loanMaxMultiplier}x savings): <strong className="text-emerald-600">KES {maxBorrowLimit.toLocaleString()}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Loan Purpose Category
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as LoanRecord['loanType'])}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                <option value="Development Loan">Development Loan</option>
                <option value="Emergency Loan">Emergency Loan</option>
                <option value="School Fees Loan">School Fees Loan</option>
                <option value="Business Booster">Business Booster</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Loan Tenor (Months)
              </label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(parseInt(e.target.value) || 6)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={9}>9 Months</option>
                <option value={12}>12 Months (Max)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Requested Principal Amount (KES)
            </label>
            <input
              type="number"
              value={principalAmountKes}
              onChange={(e) => setPrincipalAmountKes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold text-sm"
              required
            />
          </div>

          {/* Repayment Calculation Preview Box */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Interest ({interestRatePercent}%)</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200">KES {interestAmountKes.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Total Repayable</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">KES {totalRepayableKes.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Monthly Installment</span>
              <span className="font-bold text-red-600">KES {monthlyInstallmentKes.toLocaleString()}/mo</span>
            </div>
          </div>

          {/* Guarantors */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
              Required Member Guarantors (2 Minimum)
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-500 text-[11px] mb-1">Guarantor 1</label>
                <select
                  value={guarantor1Id}
                  onChange={(e) => setGuarantor1Id(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a]"
                >
                  {members.filter((m) => m.id !== memberId).map((m) => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-500 text-[11px] mb-1">Pledged Amount (KES)</label>
                <input
                  type="number"
                  value={guarantor1Amount}
                  onChange={(e) => setGuarantor1Amount(parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-500 text-[11px] mb-1">Guarantor 2</label>
                <select
                  value={guarantor2Id}
                  onChange={(e) => setGuarantor2Id(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a]"
                >
                  {members.filter((m) => m.id !== memberId && m.id !== guarantor1Id).map((m) => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-500 text-[11px] mb-1">Pledged Amount (KES)</label>
                <input
                  type="number"
                  value={guarantor2Amount}
                  onChange={(e) => setGuarantor2Amount(parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Purpose &amp; Economic Justification
            </label>
            <textarea
              rows={2}
              placeholder="Detailed description of capital use..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              required
            />
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
              Submit Loan Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
