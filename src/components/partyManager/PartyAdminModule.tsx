import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Plus,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Save,
  X,
  UserCheck,
  Building,
} from 'lucide-react';
import {
  PartyAdminUser,
  PartyAuditLog,
  PartyOrganizationSettings,
  PartyBranch,
} from '../../types/partyManager';

interface PartyAdminModuleProps {
  adminUsers: PartyAdminUser[];
  auditLogs: PartyAuditLog[];
  settings: PartyOrganizationSettings;
  branches: PartyBranch[];
  onAddUser: (user: PartyAdminUser) => void;
  onUpdateUser: (user: PartyAdminUser) => void;
  onUpdateSettings: (settings: PartyOrganizationSettings) => void;
}

export const PartyAdminModule: React.FC<PartyAdminModuleProps> = ({
  adminUsers,
  auditLogs,
  settings,
  branches,
  onAddUser,
  onUpdateUser,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit' | 'settings'>('users');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<PartyOrganizationSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Admin User Form
  const [userForm, setUserForm] = useState<{
    name: string;
    email: string;
    phone: string;
    role: PartyAdminUser['role'];
    branchId: string;
  }>({
    name: '',
    email: '',
    phone: '+254 ',
    role: 'branch_coordinator',
    branchId: branches[0]?.id || 'branch-nbi',
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: PartyAdminUser = {
      id: `usr-${Date.now()}`,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      branchId: userForm.branchId,
      status: 'active',
      lastLogin: 'Never',
    };
    onAddUser(newUser);
    setIsAddUserModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Governance, Role-Based Access & Audit Administration
          </h2>
          <p className="text-xs text-slate-500">
            Internal control mechanisms, user credentials, access privileges, and statutory audit logging
          </p>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Officer Account</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Staff & Officer Accounts ({adminUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'roles'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Roles & Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Immutable Audit Log ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          System & Dues Parameters
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration successfully committed to local repository.</span>
        </div>
      )}

      {/* Tab 1: Staff & Admin Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-3">Role Designation</th>
                  <th className="py-3 px-3">Assigned Chapter</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminUsers.map((user) => {
                  const branchName =
                    branches.find((b) => b.id === user.branchId)?.name || 'National Secretariat';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{branchName}</td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {user.phone}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{user.lastLogin}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Roles & Permissions Matrix */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Party Organs Role-Based Access Control (RBAC) Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Defines write, authorization, and audit privileges in strict accordance with the Party Constitution
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700 border border-slate-200">
              <thead className="bg-slate-100 font-semibold text-slate-900">
                <tr>
                  <th className="py-2.5 px-3 text-left">Module / Organ</th>
                  <th className="py-2.5 px-3 text-center">Secretary General</th>
                  <th className="py-2.5 px-3 text-center">Finance Director</th>
                  <th className="py-2.5 px-3 text-center">Branch Coordinator</th>
                  <th className="py-2.5 px-3 text-center">External Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-center">
                <tr>
                  <td className="py-2 px-3 text-left font-medium">Party Constitution & Profile</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Full Control</td>
                  <td className="py-2 px-3 text-slate-400">Read Only</td>
                  <td className="py-2 px-3 text-slate-400">Read Only</td>
                  <td className="py-2 px-3 text-slate-400">Read Only</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left font-medium">Member Registry & Roll</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Full Control</td>
                  <td className="py-2 px-3 text-slate-600">Dues Update</td>
                  <td className="py-2 px-3 text-slate-600">County Roll</td>
                  <td className="py-2 px-3 text-slate-400">Read Only</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left font-medium">Treasury & Payments Ledger</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Co-Signatory</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Full Control</td>
                  <td className="py-2 px-3 text-slate-600">Branch Subvention</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Audit Clearance</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-left font-medium">Statutory ORPP Returns</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Signatory</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Financial Cert</td>
                  <td className="py-2 px-3 text-slate-400">No Access</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">Audit Sign-Off</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Immutable Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              System Operations Audit Trail (Immutable Log)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Integrity Verified • SHA-256
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-mono">{log.timestamp}</span>
                  <span className="font-mono">IP: {log.ipAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.actorName}</span>
                  <span className="text-slate-400 text-[11px]">({log.actorRole})</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700">
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-600">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System Parameters */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Statutory Parameters & Treasury Configuration
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Global settings governing member annual subscriptions, M-Pesa channels, and registrar accounts
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Annual Membership Subscription (KES)
                </label>
                <input
                  type="number"
                  required
                  value={settingsForm.annualDuesAmount}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      annualDuesAmount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Currency</label>
                <input
                  type="text"
                  disabled
                  value="KES (Kenyan Shillings)"
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  M-Pesa Official Paybill Account
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.paybillNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, paybillNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ORPP Registration Ref
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.registrarRefNo}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, registrarRefNo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Parameters</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Officer Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Create Officer Credentials
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Officer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mary Wanjiku Nduta"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="officer@ucakenya.or.ke"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Designation</label>
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role: e.target.value as PartyAdminUser['role'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="branch_coordinator">Regional Coordinator</option>
                    <option value="finance_director">Finance Officer</option>
                    <option value="secretary_general">Executive Secretariat</option>
                    <option value="auditor">Compliance Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Branch</label>
                  <select
                    value={userForm.branchId}
                    onChange={(e) => setUserForm({ ...userForm, branchId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Instate Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
