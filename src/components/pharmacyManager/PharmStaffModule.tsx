import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  Search,
  CheckCircle2,
  X,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import {
  PharmacyStaff,
  SaleTransaction,
} from '../../types/pharmacyManager';

interface PharmStaffModuleProps {
  staffList: PharmacyStaff[];
  sales: SaleTransaction[];
  onAddStaff: (staff: Omit<PharmacyStaff, 'id'>) => void;
  onToggleStaffStatus: (staffId: string) => void;
}

const ROLE_LABELS: Record<PharmacyStaff['role'], string> = {
  superintendent_pharmacist: 'Superintendent Pharmacist (PPB)',
  pharmaceutical_technologist: 'Pharmaceutical Technologist',
  dispenser: 'Dispensary Assistant / Dispenser',
  cashier: 'Pharmacy Cashier & Counter Clerk',
};

export const PharmStaffModule: React.FC<PharmStaffModuleProps> = ({
  staffList,
  sales,
  onAddStaff,
  onToggleStaffStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<PharmacyStaff | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<PharmacyStaff['role']>('pharmaceutical_technologist');
  const [ppbRegNumber, setPpbRegNumber] = useState('PPB/TECH/');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [shiftSchedule, setShiftSchedule] = useState('Full-time Day Shift (08:00 - 17:00)');

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ppbRegNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ROLE_LABELS[s.role].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ppbRegNumber.trim()) return;

    onAddStaff({
      name: name.trim(),
      role,
      ppbRegNumber: ppbRegNumber.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status: 'active',
      shiftSchedule: shiftSchedule.trim(),
    });

    setIsAddModalOpen(false);
    setName('');
    setPpbRegNumber('PPB/TECH/');
    setEmail('');
  };

  const getStaffDispenseCount = (staffName: string) => {
    const firstName = staffName.split(' ')[0].toLowerCase();
    return sales.filter((s) => s.dispensedBy.toLowerCase().includes(firstName)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-600" />
            <span>Pharmacists &amp; Dispensary Staff Roster</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Maintain Pharmacy and Poisons Board (PPB) licensed personnel records, duties, shift rosters, and dispense activity.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Superintendent Pharmacist</div>
          <div className="mt-1 text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {staffList.find((s) => s.role === 'superintendent_pharmacist')?.name || 'Dr. Mercy Wangari'}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> Active License on Premises
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">Total Clinical &amp; Counter Staff</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {staffList.length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            {staffList.filter((s) => s.status === 'active').length} active on shift roster
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500">PPB Verified Credentials</div>
          <div className="mt-1 text-2xl font-bold font-['Poppins'] text-red-600 dark:text-red-400">
            100%
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">All registered with regulatory body</div>
        </div>
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((stf) => {
          const dispenseCount = getStaffDispenseCount(stf.name);
          return (
            <div
              key={stf.id}
              className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{stf.name}</h4>
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400 mt-0.5">
                    {ROLE_LABELS[stf.role]}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                    stf.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800'
                  }`}
                >
                  {stf.status}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">PPB Registration:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{stf.ppbRegNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Shift Schedule:</span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-sans text-[11px]">
                    {stf.shiftSchedule}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono text-[11px]">{stf.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[11px] truncate">{stf.email}</span>
                </div>
              </div>

              {/* Activity & Toggle */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Recent Dispenses</span>
                  <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                    {dispenseCount} prescriptions
                  </span>
                </div>

                <button
                  onClick={() => onToggleStaffStatus(stf.id)}
                  className="px-2.5 py-1 text-xs font-medium rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  {stf.status === 'active' ? 'Set On Leave' : 'Set Active'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#11141a] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                <span>Add Dispensary Staff Member</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name &amp; Credentials
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kelvin Mutua, BPharm"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Dispensary Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as PharmacyStaff['role'])}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    {Object.entries(ROLE_LABELS).map(([r, label]) => (
                      <option key={r} value={r}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    PPB Registration Number
                  </label>
                  <input
                    type="text"
                    value={ppbRegNumber}
                    onChange={(e) => setPpbRegNumber(e.target.value)}
                    placeholder="PPB/TECH/12903"
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pharmacist@paperglowpharmacy.co.ke"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Shift Schedule &amp; Duty Hours
                </label>
                <input
                  type="text"
                  value={shiftSchedule}
                  onChange={(e) => setShiftSchedule(e.target.value)}
                  placeholder="e.g. Morning Shift (08:00 - 16:30)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
