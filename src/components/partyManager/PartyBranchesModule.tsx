import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  MapPin,
  Users,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  ShieldCheck,
  Building,
  UserCheck,
  X,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { PartyBranch, PartyMember } from '../../types/partyManager';

interface PartyBranchesModuleProps {
  branches: PartyBranch[];
  members: PartyMember[];
  onAddBranch: (branch: PartyBranch) => void;
  onUpdateBranch: (branch: PartyBranch) => void;
}

export const PartyBranchesModule: React.FC<PartyBranchesModuleProps> = ({
  branches,
  members,
  onAddBranch,
  onUpdateBranch,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<PartyBranch | null>(null);

  // New Branch Form
  const [branchForm, setBranchForm] = useState<{
    code: string;
    name: string;
    region: string;
    county: string;
    officeAddress: string;
    coordinatorName: string;
    coordinatorPhone: string;
    coordinatorEmail: string;
    memberCount: number;
    status: 'active' | 'provisional' | 'restructuring';
    budgetAllocation: number;
  }>({
    code: `BR-KEN-${branches.length + 1}`,
    name: '',
    region: 'Eastern',
    county: 'Machakos',
    officeAddress: '',
    coordinatorName: '',
    coordinatorPhone: '+254 ',
    coordinatorEmail: '',
    memberCount: 500,
    status: 'provisional',
    budgetAllocation: 800000,
  });

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBranch: PartyBranch = {
      id: `branch-${Date.now()}`,
      code: branchForm.code,
      name: branchForm.name,
      region: branchForm.region,
      county: branchForm.county,
      officeAddress: branchForm.officeAddress,
      coordinatorName: branchForm.coordinatorName,
      coordinatorPhone: branchForm.coordinatorPhone,
      coordinatorEmail: branchForm.coordinatorEmail,
      memberCount: Number(branchForm.memberCount),
      status: branchForm.status,
      establishedDate: new Date().toISOString().split('T')[0],
      budgetAllocation: Number(branchForm.budgetAllocation),
      spentBudget: 0,
    };
    onAddBranch(newBranch);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    onUpdateBranch(editingBranch);
    setEditingBranch(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-red-600" />
            Regional Chapters & County Secretariats
          </h2>
          <p className="text-xs text-slate-500">
            Fulfills Section 7(2)(a) requirement of maintaining physical offices in more than half of the 47 counties
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Establish New Chapter</span>
        </button>
      </div>

      {/* Chapter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map((branch) => {
          const budgetPercentage =
            branch.budgetAllocation > 0
              ? Math.min(100, Math.round((branch.spentBudget / branch.budgetAllocation) * 100))
              : 0;

          // count sampled demo members registered under this branch
          const sampledCount = members.filter((m) => m.branchId === branch.id).length;

          return (
            <div
              key={branch.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Top Title & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {branch.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{branch.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                      <span>{branch.county} County • {branch.region}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                      branch.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : branch.status === 'provisional'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {branch.status}
                  </span>
                </div>

                {/* Coordinator & Contact */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Coordinator: {branch.coordinatorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{branch.coordinatorPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px] truncate">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{branch.coordinatorEmail}</span>
                  </div>
                </div>

                {/* Office Location */}
                <div className="text-xs text-slate-600 flex items-start gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{branch.officeAddress}</span>
                </div>

                {/* Metrics: Membership Roll & Budget */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Certified Register:</span>
                    <span className="font-bold text-slate-900">
                      {branch.memberCount.toLocaleString()} Members
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Subvention Utilized:</span>
                      <span className="font-semibold text-slate-700">
                        KES {branch.spentBudget.toLocaleString()} / {branch.budgetAllocation.toLocaleString()} ({budgetPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-red-600 h-1.5 rounded-full"
                        style={{ width: `${budgetPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Est. {branch.establishedDate}
                </span>
                <button
                  onClick={() => setEditingBranch(branch)}
                  className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 rounded-md font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Configure Hub</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Chapter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Establish New Regional Chapter
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={branchForm.code}
                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={branchForm.status}
                    onChange={(e) =>
                      setBranchForm({
                        ...branchForm,
                        status: e.target.value as 'active' | 'provisional' | 'restructuring',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="active">Active Certified</option>
                    <option value="provisional">Provisional (Under Verification)</option>
                    <option value="restructuring">Restructuring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eastern Region Secretariat"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">County</label>
                  <input
                    type="text"
                    required
                    value={branchForm.county}
                    onChange={(e) => setBranchForm({ ...branchForm, county: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Geographic Region</label>
                  <input
                    type="text"
                    required
                    value={branchForm.region}
                    onChange={(e) => setBranchForm({ ...branchForm, region: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Office Address</label>
                <input
                  type="text"
                  required
                  placeholder="Building name, Floor, Street, Town"
                  value={branchForm.officeAddress}
                  onChange={(e) => setBranchForm({ ...branchForm, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Name</label>
                  <input
                    type="text"
                    required
                    value={branchForm.coordinatorName}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, coordinatorName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    required
                    value={branchForm.coordinatorPhone}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, coordinatorPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={branchForm.coordinatorEmail}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, coordinatorEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registered Members</label>
                  <input
                    type="number"
                    required
                    value={branchForm.memberCount}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, memberCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual Budget (KES)</label>
                  <input
                    type="number"
                    required
                    value={branchForm.budgetAllocation}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, budgetAllocation: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Confirm & Instate Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Update Branch Secretariat: {editingBranch.name}
              </h3>
              <button
                onClick={() => setEditingBranch(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coordinator Name</label>
                <input
                  type="text"
                  required
                  value={editingBranch.coordinatorName}
                  onChange={(e) =>
                    setEditingBranch({ ...editingBranch, coordinatorName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Phone</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.coordinatorPhone}
                    onChange={(e) =>
                      setEditingBranch({ ...editingBranch, coordinatorPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Email</label>
                  <input
                    type="email"
                    required
                    value={editingBranch.coordinatorEmail}
                    onChange={(e) =>
                      setEditingBranch({ ...editingBranch, coordinatorEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Office Address</label>
                <input
                  type="text"
                  required
                  value={editingBranch.officeAddress}
                  onChange={(e) =>
                    setEditingBranch({ ...editingBranch, officeAddress: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Annual Budget (KES)</label>
                  <input
                    type="number"
                    required
                    value={editingBranch.budgetAllocation}
                    onChange={(e) =>
                      setEditingBranch({
                        ...editingBranch,
                        budgetAllocation: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingBranch.status}
                    onChange={(e) =>
                      setEditingBranch({
                        ...editingBranch,
                        status: e.target.value as 'active' | 'provisional' | 'restructuring',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="active">Active Certified</option>
                    <option value="provisional">Provisional</option>
                    <option value="restructuring">Restructuring</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
