import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Plus,
  Phone,
  Mail,
  DollarSign,
  CheckCircle2,
  X,
  Scale,
  Award,
} from 'lucide-react';
import {
  LegalStaff,
  StaffRole,
} from '../../types/legalPractice';

interface TeamModuleProps {
  staff: LegalStaff[];
  onAddStaff: (newStaff: Omit<LegalStaff, 'id' | 'activeMattersCount'>) => void;
}

export const TeamModule: React.FC<TeamModuleProps> = ({ staff, onAddStaff }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('Associate Advocate');
  const [lskNumber, setLskNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [hourlyRateKes, setHourlyRateKes] = useState('16000');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const rate = parseFloat(hourlyRateKes) || 15000;
    const isAdvocate =
      role === 'Managing Partner' ||
      role === 'Senior Partner' ||
      role === 'Senior Associate Advocate' ||
      role === 'Associate Advocate';

    onAddStaff({
      name,
      role,
      lskNumber: isAdvocate ? lskNumber : undefined,
      email,
      phone,
      hourlyRateKes: rate,
      permissions: {
        canSignPleadings: isAdvocate,
        canIssueInvoices: role === 'Managing Partner' || role === 'Senior Partner',
        canViewFinancials: role === 'Managing Partner' || role === 'Senior Partner',
        canDeleteDocuments: role === 'Managing Partner',
        canManageTeam: role === 'Managing Partner',
      },
    });

    setIsAddOpen(false);
    setName('');
    setEmail('');
    setLskNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Roll of Advocates, Clerks &amp; Role Permissions
          </h2>
          <p className="text-xs text-neutral-500">
            Law Society of Kenya (LSK) admission numbers, practicing certificate verification, hourly fee earner rates, and judicial signing access controls.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Practice Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    {member.name}
                  </h3>
                  <span className="text-xs text-red-600 dark:text-red-400 font-semibold block">
                    {member.role}
                  </span>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {member.activeMattersCount} Matters
                </span>
              </div>

              {member.lskNumber && (
                <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-300 flex items-center justify-between">
                  <span>LSK Roll No:</span>
                  <strong className="text-neutral-900 dark:text-white">{member.lskNumber}</strong>
                </div>
              )}

              <div className="space-y-1 text-xs text-neutral-500">
                <div className="flex items-center space-x-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>

            {/* Permissions & Rate footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Hourly Scale Rate:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  KES {member.hourlyRateKes.toLocaleString()}/hr
                </span>
              </div>

              <div className="space-y-1 pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                <div className="flex items-center justify-between">
                  <span>Sign Court Pleadings:</span>
                  <span className={member.permissions.canSignPleadings ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                    {member.permissions.canSignPleadings ? 'Authorized' : 'Restricted'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Issue Client Fee Notes:</span>
                  <span className={member.permissions.canIssueInvoices ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                    {member.permissions.canIssueInvoices ? 'Authorized' : 'Restricted'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Add Practice Advocate or Staff
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name &amp; Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grace C. Mutua, Advocate"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Role / Position
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="Senior Partner">Senior Partner</option>
                    <option value="Senior Associate Advocate">Senior Associate</option>
                    <option value="Associate Advocate">Associate Advocate</option>
                    <option value="Pupil / Legal Assistant">Pupil / Legal Assistant</option>
                    <option value="Litigation Clerk">Litigation Clerk</option>
                    <option value="Finance & Admin">Finance &amp; Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    LSK Roll of Advocates No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. P.105/14902/21"
                    value={lskNumber}
                    onChange={(e) => setLskNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@kowadvocates.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Telephone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Hourly Billing Scale Rate (KES) *
                </label>
                <input
                  type="number"
                  required
                  value={hourlyRateKes}
                  onChange={(e) => setHourlyRateKes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Save Practice Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
