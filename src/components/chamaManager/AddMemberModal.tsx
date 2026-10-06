import React, { useState } from 'react';
import { Member, MemberRole, MemberStatus, GroupProfile } from '../../types/chamaManager';
import { X, UserPlus } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupProfile;
  onAddMember: (memberData: Omit<Member, 'id' | 'totalContributionsKes' | 'currentLoanBalanceKes' | 'welfareContributionsKes' | 'sharesUnits'>) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  group,
  onAddMember,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [idNumber, setIdNumber] = useState('');
  const [residentialArea, setResidentialArea] = useState('Nairobi');
  const [occupation, setOccupation] = useState('');
  const [nextOfKinName, setNextOfKinName] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('+254 7');
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState('Spouse');
  const [role, setRole] = useState<MemberRole>('Member');
  const [status, setStatus] = useState<MemberStatus>('active');
  const [dateJoined, setDateJoined] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !idNumber.trim()) return;

    const membershipNumber = `UB-${Math.floor(100 + Math.random() * 900)}`;

    onAddMember({
      membershipNumber,
      fullName,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone,
      idNumber,
      residentialArea,
      occupation,
      nextOfKinName,
      nextOfKinPhone,
      nextOfKinRelationship,
      role,
      status,
      dateJoined,
      notes,
    });

    onClose();
    setFullName('');
    setIdNumber('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#11141a] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Register New Chama Shareholder
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Full Names (as per National ID)
              </label>
              <input
                type="text"
                placeholder="e.g. Christine Wangari Ndegwa"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Kenyan National ID Number
              </label>
              <input
                type="text"
                placeholder="e.g. 29481920"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Primary Phone Number (M-Pesa)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="christine.ndegwa@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Residential Estate / County
              </label>
              <input
                type="text"
                value={residentialArea}
                onChange={(e) => setResidentialArea(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Profession / Enterprise
              </label>
              <input
                type="text"
                placeholder="e.g. Financial Analyst"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
              Next of Kin / Beneficiary Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-500 mb-1">Next of Kin Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Ndegwa"
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a]"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Brother"
                  value={nextOfKinRelationship}
                  onChange={(e) => setNextOfKinRelationship(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a]"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a] font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Chama Governance Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-semibold"
              >
                <option value="Member">Ordinary Member</option>
                <option value="Committee Member">Committee Member</option>
                <option value="Welfare Coordinator">Welfare Coordinator</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Secretary">Secretary</option>
                <option value="Vice-Chairperson">Vice-Chairperson</option>
                <option value="Chairperson">Chairperson</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Membership Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MemberStatus)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                <option value="active">Active (Vetted)</option>
                <option value="probation">Probationary</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Date Joined
              </label>
              <input
                type="date"
                value={dateJoined}
                onChange={(e) => setDateJoined(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Admit &amp; Issue Membership
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
