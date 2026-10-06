import React, { useState } from 'react';
import { WelfareClaim, Member, GroupProfile } from '../../types/chamaManager';
import { X, HeartHandshake } from 'lucide-react';

interface RequestWelfareModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  group: GroupProfile;
  onRequestWelfare: (claim: Omit<WelfareClaim, 'id' | 'status' | 'amountApprovedKes'>) => void;
}

export const RequestWelfareModal: React.FC<RequestWelfareModalProps> = ({
  isOpen,
  onClose,
  members,
  group,
  onRequestWelfare,
}) => {
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [claimType, setClaimType] = useState<WelfareClaim['claimType']>('Hospitalization');
  const [amountRequestedKes, setAmountRequestedKes] = useState(group.welfareHospitalCoverKes);
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');

  if (!isOpen) return null;

  const applicant = members.find((m) => m.id === memberId) || members[0];

  const handleTypeChange = (type: WelfareClaim['claimType']) => {
    setClaimType(type);
    if (type === 'Bereavement') setAmountRequestedKes(group.welfareBereavementCoverKes);
    else if (type === 'Hospitalization') setAmountRequestedKes(group.welfareHospitalCoverKes);
    else setAmountRequestedKes(30000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicant || !description.trim()) return;

    onRequestWelfare({
      memberId: applicant.id,
      memberName: applicant.fullName,
      membershipNumber: applicant.membershipNumber,
      claimType,
      description,
      amountRequestedKes,
      requestDate: new Date().toISOString().split('T')[0],
      recipientName: recipientName || applicant.fullName,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#11141a] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Request Welfare Benevolent Cover
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Beneficiary Member
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.membershipNumber} — {m.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Assistance Nature / Incident
            </label>
            <select
              value={claimType}
              onChange={(e) => handleTypeChange(e.target.value as WelfareClaim['claimType'])}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            >
              <option value="Hospitalization">Hospital Inpatient Care (Max KES {group.welfareHospitalCoverKes.toLocaleString()})</option>
              <option value="Bereavement">Bereavement Condolence (Max KES {group.welfareBereavementCoverKes.toLocaleString()})</option>
              <option value="Maternity / Paternity">Maternity / Paternity Gift (KES 30,000)</option>
              <option value="Disaster Relief">Emergency Disaster Relief</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Amount (KES)
            </label>
            <input
              type="number"
              value={amountRequestedKes}
              onChange={(e) => setAmountRequestedKes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Payee / Recipient Account Name
            </label>
            <input
              type="text"
              placeholder={applicant.fullName}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Description &amp; Incident Verification
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Hospital admission at Nairobi Women's Hospital from 2nd Oct..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
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
              Submit Welfare Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
