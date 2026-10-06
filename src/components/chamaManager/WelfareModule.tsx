import React, { useState } from 'react';
import { WelfareClaim, Member, GroupProfile } from '../../types/chamaManager';
import {
  HeartHandshake,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

interface WelfareModuleProps {
  welfareClaims: WelfareClaim[];
  members: Member[];
  group: GroupProfile;
  onOpenRequestWelfare: () => void;
  onApproveClaim: (claimId: string) => void;
  onDisburseClaim: (claimId: string, reference: string) => void;
}

export const WelfareModule: React.FC<WelfareModuleProps> = ({
  welfareClaims,
  members,
  group,
  onOpenRequestWelfare,
  onApproveClaim,
  onDisburseClaim,
}) => {
  const [selectedClaimForDisburse, setSelectedClaimForDisburse] = useState<WelfareClaim | null>(null);
  const [disburseRef, setDisburseRef] = useState('MPESA-QHK' + Math.floor(1000 + Math.random() * 9000));

  const totalWelfarePooled = members.reduce((sum, m) => sum + m.welfareContributionsKes, 0);
  const totalWelfareDisbursed = welfareClaims
    .filter((w) => w.status === 'disbursed')
    .reduce((sum, w) => sum + w.amountApprovedKes, 0);

  const netWelfareReserve = totalWelfarePooled - totalWelfareDisbursed;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-red-600" />
            <span>Welfare &amp; Benevolent Emergency Pool</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Dedicated solidarity fund supporting members during bereavement, medical emergencies &amp; childbirth
          </p>
        </div>

        <button
          onClick={onOpenRequestWelfare}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Assistance</span>
        </button>
      </div>

      {/* Welfare Pool Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Net Available Welfare Reserve
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            KES {netWelfareReserve.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Liquid balance for emergencies
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Bereavement Solidarity Grant
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            KES {group.welfareBereavementCoverKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Primary member, spouse or parent demise
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Inpatient Hospitalization Grant
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            KES {group.welfareHospitalCoverKes.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Hospital admissions exceeding 3 days
          </span>
        </div>
      </div>

      {/* Claims List */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
          Welfare Claims &amp; Benevolent Payouts
        </h3>

        <div className="space-y-3">
          {welfareClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                    {claim.memberName}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {claim.membershipNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                    {claim.claimType}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
                  {claim.description}
                </p>
                <div className="text-[11px] text-neutral-400 flex items-center space-x-3 pt-1">
                  <span>Requested: {claim.requestDate}</span>
                  {claim.paymentReference && (
                    <span>Ref: <strong className="font-mono text-red-600">{claim.paymentReference}</strong></span>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-neutral-400">Claim Amount</div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    KES {claim.amountRequestedKes.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {claim.status === 'pending' && (
                    <button
                      onClick={() => onApproveClaim(claim.id)}
                      className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Approve Claim
                    </button>
                  )}

                  {claim.status === 'approved' && (
                    <button
                      onClick={() => setSelectedClaimForDisburse(claim)}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Disburse KES
                    </button>
                  )}

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      claim.status === 'disbursed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : claim.status === 'approved'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disburse Modal */}
      {selectedClaimForDisburse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Disburse Welfare Payment
            </h3>
            <p className="text-xs text-neutral-500">
              Confirm benevolent payout of KES {selectedClaimForDisburse.amountApprovedKes.toLocaleString()} to {selectedClaimForDisburse.recipientName}
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium">
                M-Pesa / Bank Reference Code
              </label>
              <input
                type="text"
                value={disburseRef}
                onChange={(e) => setDisburseRef(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono font-bold"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedClaimForDisburse(null)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDisburseClaim(selectedClaimForDisburse.id, disburseRef);
                  setSelectedClaimForDisburse(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Confirm Disbursement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
