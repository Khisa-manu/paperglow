import React, { useState } from 'react';
import { Member, ContributionRecord, LoanRecord, WelfareClaim, GroupProfile } from '../../types/chamaManager';
import {
  X,
  User,
  Award,
  CreditCard,
  Banknote,
  HeartHandshake,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';

interface MemberDossierModalProps {
  member: Member | null;
  onClose: () => void;
  group: GroupProfile;
  contributions: ContributionRecord[];
  loans: LoanRecord[];
  welfareClaims: WelfareClaim[];
  onOpenDocumentsForMember: (memberId: string) => void;
}

export const MemberDossierModal: React.FC<MemberDossierModalProps> = ({
  member,
  onClose,
  group,
  contributions,
  loans,
  welfareClaims,
  onOpenDocumentsForMember,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'contributions' | 'loans' | 'welfare'>('summary');

  if (!member) return null;

  const memberContributions = contributions.filter((c) => c.memberId === member.id);
  const memberLoans = loans.filter((l) => l.memberId === member.id);
  const memberWelfare = welfareClaims.filter((w) => w.memberId === member.id);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#11141a] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        <div className="flex items-start justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-red-600 text-lg border border-neutral-200 dark:border-neutral-700">
              {member.membershipNumber.replace('UB-', '')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  {member.fullName}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  {member.role}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Membership #{member.membershipNumber} · National ID: {member.idNumber} · Joined {member.dateJoined}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-2 font-bold border-b-2 cursor-pointer ${
              activeTab === 'summary'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Profile Dossier
          </button>
          <button
            onClick={() => setActiveTab('contributions')}
            className={`px-3 py-2 font-bold border-b-2 cursor-pointer ${
              activeTab === 'contributions'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Savings Ledgers ({memberContributions.length})
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3 py-2 font-bold border-b-2 cursor-pointer ${
              activeTab === 'loans'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Credit History ({memberLoans.length})
          </button>
          <button
            onClick={() => setActiveTab('welfare')}
            className={`px-3 py-2 font-bold border-b-2 cursor-pointer ${
              activeTab === 'welfare'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Welfare ({memberWelfare.length})
          </button>
        </div>

        {/* TAB 1: Summary Profile */}
        {activeTab === 'summary' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Core Savings</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums text-sm">
                  KES {member.totalContributionsKes.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Loan Balance</span>
                <span className={`font-bold tabular-nums text-sm ${member.currentLoanBalanceKes > 0 ? 'text-red-600' : 'text-neutral-400'}`}>
                  KES {member.currentLoanBalanceKes.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Welfare Pooled</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums text-sm">
                  KES {member.welfareContributionsKes.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block uppercase font-medium">Chama Shares</span>
                <span className="font-bold text-emerald-600 tabular-nums text-sm">
                  {member.sharesUnits} Units
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block">Contact &amp; Living Details</span>
              <div className="grid grid-cols-2 gap-2 text-neutral-600 dark:text-neutral-400">
                <div>Phone: <strong>{member.phone}</strong></div>
                <div>Email: <strong>{member.email}</strong></div>
                <div>Residential: <strong>{member.residentialArea}</strong></div>
                <div>Occupation: <strong>{member.occupation}</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block">Next of Kin (Beneficiary)</span>
              <div className="grid grid-cols-3 gap-2 text-neutral-600 dark:text-neutral-400">
                <div>Name: <strong>{member.nextOfKinName}</strong></div>
                <div>Relation: <strong>{member.nextOfKinRelationship}</strong></div>
                <div>Phone: <strong>{member.nextOfKinPhone}</strong></div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  onClose();
                  onOpenDocumentsForMember(member.id);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Open Certificate &amp; Digital ID Studio</span>
              </button>

              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Contributions */}
        {activeTab === 'contributions' && (
          <div className="space-y-3 text-xs">
            {memberContributions.length === 0 ? (
              <p className="text-neutral-400">No payment receipts found.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold text-[10px]">
                    <th className="pb-2">Month</th>
                    <th className="pb-2">Core</th>
                    <th className="pb-2">Welfare</th>
                    <th className="pb-2">Total Paid</th>
                    <th className="pb-2">Ref</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {memberContributions.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 font-medium">{c.month}</td>
                      <td className="py-2">KES {c.amountKes.toLocaleString()}</td>
                      <td className="py-2">KES {c.welfareKes.toLocaleString()}</td>
                      <td className="py-2 font-bold text-emerald-600">KES {c.totalPaidKes.toLocaleString()}</td>
                      <td className="py-2 font-mono text-neutral-400">{c.transactionReference}</td>
                      <td className="py-2 text-neutral-500">{c.paymentDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: Loans */}
        {activeTab === 'loans' && (
          <div className="space-y-3 text-xs">
            {memberLoans.length === 0 ? (
              <p className="text-neutral-400">No credit facilities taken.</p>
            ) : (
              memberLoans.map((l) => (
                <div key={l.id} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{l.loanType}</span>
                    <span className="text-red-600">Balance: KES {l.balanceKes.toLocaleString()}</span>
                  </div>
                  <div className="text-neutral-500">
                    Principal: KES {l.principalAmountKes.toLocaleString()} · Repaid: KES {l.amountRepaidKes.toLocaleString()} · Status: {l.status}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: Welfare */}
        {activeTab === 'welfare' && (
          <div className="space-y-3 text-xs">
            {memberWelfare.length === 0 ? (
              <p className="text-neutral-400">No benevolent claims requested.</p>
            ) : (
              memberWelfare.map((w) => (
                <div key={w.id} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{w.claimType} Claim</span>
                    <span className="text-emerald-600">KES {w.amountApprovedKes.toLocaleString()}</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">{w.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
