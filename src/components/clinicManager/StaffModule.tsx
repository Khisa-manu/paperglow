import React, { useState } from 'react';
import { StaffMember, StaffRole, ClinicProfile } from '../../types/clinicManager';
import {
  UserCheck,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';

interface StaffModuleProps {
  staff: StaffMember[];
  clinic: ClinicProfile;
  onAddStaff: (member: Omit<StaffMember, 'id' | 'totalConsultationsCompleted'>) => void;
  onToggleStaffDuty: (staffId: string) => void;
}

export const StaffModule: React.FC<StaffModuleProps> = ({
  staff,
  clinic,
  onAddStaff,
  onToggleStaffDuty,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Form State
  const [staffNumber, setStaffNumber] = useState('STF-DOC-00' + (staff.length + 1));
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<StaffRole>('Doctor / Physician');
  const [department, setDepartment] = useState('General Outpatient (OPD)');
  const [qualification, setQualification] = useState('');
  const [kmpdcRegistrationNo, setKmpdcRegistrationNo] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [consultingRoom, setConsultingRoom] = useState('Room 1 (Consultation Wing A)');
  const [shiftHours, setShiftHours] = useState('08:00 AM – 04:00 PM');

  const filteredStaff = staff.filter((s) => {
    return roleFilter === 'all' || s.role === roleFilter;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onAddStaff({
      staffNumber,
      fullName: fullName.trim(),
      role,
      department,
      qualification: qualification.trim(),
      kmpdcRegistrationNo: kmpdcRegistrationNo.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      consultingRoom: consultingRoom.trim() || undefined,
      scheduleDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shiftHours,
      onDuty: true,
      status: 'Available',
    });

    setIsAddModalOpen(false);
    setFullName('');
    setQualification('');
    setKmpdcRegistrationNo('');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-red-600" />
            <span>Doctors, Practitioners &amp; Clinical Staff Roster</span>
          </h2>
          <p className="text-xs text-neutral-500">
            {staff.length} registered personnel &middot; KMPDC licensure compliance, consulting room allocations &amp; shifts
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Role Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          'all',
          'Doctor / Physician',
          'Clinical Officer',
          'Registered Nurse',
          'Lab Technologist',
          'Receptionist',
        ].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
              roleFilter === r
                ? 'bg-red-600 text-white font-semibold shadow-2xs'
                : 'bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {r === 'all' ? 'All Roles' : r}
          </button>
        ))}
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((st) => (
          <div
            key={st.id}
            className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs text-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                    {st.staffNumber}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] mt-1">
                    {st.fullName}
                  </h3>
                  <span className="text-neutral-500 font-semibold text-xs block">
                    {st.role}
                  </span>
                </div>

                <button
                  onClick={() => onToggleStaffDuty(st.id)}
                  className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                    st.onDuty
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {st.onDuty ? '● On Duty' : '○ Off Duty'}
                </button>
              </div>

              <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
                <p><strong>Department:</strong> {st.department}</p>
                <p><strong>Qualification:</strong> {st.qualification}</p>
                {st.kmpdcRegistrationNo && (
                  <p className="flex items-center space-x-1 text-red-700 dark:text-red-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Licence: {st.kmpdcRegistrationNo}</span>
                  </p>
                )}
                {st.consultingRoom && (
                  <p><strong>Room:</strong> {st.consultingRoom}</p>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] space-y-1">
                <div className="flex items-center space-x-1.5 text-neutral-500">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  <span>{st.phone}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-neutral-500">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>Shift: {st.shiftHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-neutral-500">
              <span>Consultations: <strong>{st.totalConsultationsCompleted}</strong></span>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {st.scheduleDays.slice(0, 3).join(', ')}...
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white dark:bg-[#11141a] rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl text-xs max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Register Clinic Practitioner / Staff
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Full Name &amp; Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alex Wanjala, MBChB"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Staff Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <option value="Doctor / Physician">Doctor / Physician</option>
                    <option value="Clinical Officer">Clinical Officer</option>
                    <option value="Registered Nurse">Registered Nurse</option>
                    <option value="Lab Technologist">Lab Technologist</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Clinic Administrator">Clinic Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Academic &amp; Clinical Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. MBChB (UoN), BLS / ACLS"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">KMPDC / Regulatory Registration No.</label>
                <input
                  type="text"
                  placeholder="e.g. A.10928 or CO/5102/2021"
                  value={kmpdcRegistrationNo}
                  onChange={(e) => setKmpdcRegistrationNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Consulting Room</label>
                  <input
                    type="text"
                    value={consultingRoom}
                    onChange={(e) => setConsultingRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Register Staff
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
