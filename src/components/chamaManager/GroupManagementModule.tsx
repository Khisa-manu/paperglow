import React, { useState } from 'react';
import { GroupProfile } from '../../types/chamaManager';
import {
  Building,
  CreditCard,
  Scale,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';

interface GroupManagementModuleProps {
  group: GroupProfile;
  onUpdateGroup: (updated: GroupProfile) => void;
}

export const GroupManagementModule: React.FC<GroupManagementModuleProps> = ({
  group,
  onUpdateGroup,
}) => {
  const [formData, setFormData] = useState<GroupProfile>(group);
  const [newObjective, setNewObjective] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGroup(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, newObjective.trim()],
    }));
    setNewObjective('');
  };

  const handleRemoveObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Group Profile, Banking &amp; Financial Bylaws
          </h2>
          <p className="text-xs text-neutral-500">
            Configure official registration details, Co-op Bank/M-Pesa accounts, and Chama constitution rules
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Group profile and financial bylaws successfully updated.</span>
        </div>
      )}

      {/* Grid: 1. Official Identity & Registration */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-bold text-sm font-['Poppins']">
          <Building className="w-4 h-4 text-red-600" />
          <span>1. Official Group Registration &amp; Jurisdiction</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Chama / Group Legal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Motto / Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Social Services / Co-op Reg. No
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              County &amp; Sub-County
            </label>
            <input
              type="text"
              value={`${formData.county} · ${formData.subCounty}`}
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Year Established
            </label>
            <input
              type="number"
              value={formData.yearEstablished}
              onChange={(e) => setFormData({ ...formData, yearEstablished: parseInt(e.target.value) || 2020 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Executive Chairperson
            </label>
            <input
              type="text"
              value={formData.chairpersonName}
              onChange={(e) => setFormData({ ...formData, chairpersonName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      </div>

      {/* Grid: 2. Financial Accounts (Bank & M-Pesa) */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-bold text-sm font-['Poppins']">
          <CreditCard className="w-4 h-4 text-red-600" />
          <span>2. Banking Channel &amp; M-Pesa Paybill Coordinates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Bank Name &amp; Branch
            </label>
            <input
              type="text"
              value={`${formData.bankName} (${formData.bankBranch})`}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Bank Account Title
            </label>
            <input
              type="text"
              value={formData.bankAccountName}
              onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={formData.bankAccountNumber}
              onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              M-Pesa Business Paybill No.
            </label>
            <input
              type="text"
              value={formData.mpesaPaybill}
              onChange={(e) => setFormData({ ...formData, mpesaPaybill: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono font-bold text-red-600"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              M-Pesa Account Reference
            </label>
            <input
              type="text"
              value={formData.mpesaAccountNumber}
              onChange={(e) => setFormData({ ...formData, mpesaAccountNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Signatories Requirement
            </label>
            <input
              type="text"
              readOnly
              value="Any 2 of 3 (Chairperson, Secretary, Treasurer)"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Grid: 3. Financial Bylaws, Rules & Penalties */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-bold text-sm font-['Poppins']">
          <Scale className="w-4 h-4 text-red-600" />
          <span>3. Financial Bylaws, Loan Terms &amp; Welfare Caps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Monthly Savings Target (KES)
            </label>
            <input
              type="number"
              value={formData.monthlyContributionKes}
              onChange={(e) => setFormData({ ...formData, monthlyContributionKes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Monthly Welfare Levy (KES)
            </label>
            <input
              type="number"
              value={formData.monthlyWelfareKes}
              onChange={(e) => setFormData({ ...formData, monthlyWelfareKes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Late Payment Penalty (KES)
            </label>
            <input
              type="number"
              value={formData.latePenaltyKes}
              onChange={(e) => setFormData({ ...formData, latePenaltyKes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold text-red-600"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Loan Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              value={formData.loanInterestRatePercent}
              onChange={(e) => setFormData({ ...formData, loanInterestRatePercent: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold text-amber-600"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Borrowing Multiplier
            </label>
            <input
              type="number"
              value={formData.loanMaxMultiplier}
              onChange={(e) => setFormData({ ...formData, loanMaxMultiplier: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold"
            />
            <span className="text-[10px] text-neutral-400">e.g. 3x savings balance</span>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Max Loan Duration (Months)
            </label>
            <input
              type="number"
              value={formData.loanMaxDurationMonths}
              onChange={(e) => setFormData({ ...formData, loanMaxDurationMonths: parseInt(e.target.value) || 12 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Bereavement Cover (KES)
            </label>
            <input
              type="number"
              value={formData.welfareBereavementCoverKes}
              onChange={(e) => setFormData({ ...formData, welfareBereavementCoverKes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Hospital Inpatient Cover (KES)
            </label>
            <input
              type="number"
              value={formData.welfareHospitalCoverKes}
              onChange={(e) => setFormData({ ...formData, welfareHospitalCoverKes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Grid: 4. Group Objectives & Constitution Pillars */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-bold text-sm font-['Poppins']">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          <span>4. Core Objectives &amp; Investment Pillars</span>
        </div>

        <div className="space-y-2">
          {formData.objectives.map((obj, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
            >
              <div className="flex items-start space-x-2">
                <span className="font-bold text-red-600">{idx + 1}.</span>
                <span className="text-neutral-800 dark:text-neutral-200">{obj}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveObjective(idx)}
                className="text-neutral-400 hover:text-red-600 ml-2"
                title="Remove objective"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              placeholder="Add another constitutional objective..."
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-xs text-neutral-900 dark:text-neutral-100"
            />
            <button
              type="button"
              onClick={handleAddObjective}
              className="px-3 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
