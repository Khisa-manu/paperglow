import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Clock,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  Edit2,
  Sparkles,
} from 'lucide-react';
import {
  StaffMember,
  ServiceItem,
  BookingAppointment,
} from '../../types/booking';

interface StaffModuleProps {
  staff: StaffMember[];
  services: ServiceItem[];
  appointments: BookingAppointment[];
  onAddStaff: (newStaff: Omit<StaffMember, 'id' | 'totalAppointmentsCount' | 'rating'>) => void;
  onUpdateStaffStatus: (staffId: string, status: StaffMember['status']) => void;
  onUpdateStaffSchedule: (staffId: string, hours: StaffMember['workingHours']) => void;
}

export const StaffModule: React.FC<StaffModuleProps> = ({
  staff,
  services,
  appointments,
  onAddStaff,
  onUpdateStaffStatus,
  onUpdateStaffSchedule,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Staff Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [providedServiceIds, setProvidedServiceIds] = useState<string[]>([]);

  const selectedStaff = staff.find((s) => s.id === selectedStaffId) || staff[0];
  const staffAppointments = selectedStaff
    ? appointments.filter((a) => a.staffId === selectedStaff.id)
    : [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    const defaultHours = [
      { dayOfWeek: 1, dayName: 'Monday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, dayName: 'Tuesday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 3, dayName: 'Wednesday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 4, dayName: 'Thursday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 5, dayName: 'Friday', isOpen: true, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 6, dayName: 'Saturday', isOpen: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 0, dayName: 'Sunday', isOpen: false, startTime: '10:00', endTime: '16:00' },
    ];

    onAddStaff({
      name,
      title,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@paperglowstudio.co.ke`,
      phone: phone || '+254 700 000 000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      providedServiceIds: providedServiceIds.length > 0 ? providedServiceIds : services.map((s) => s.id),
      workingHours: defaultHours,
      daysOff: [],
      status: 'available',
    });

    setName('');
    setTitle('');
    setEmail('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  const toggleWorkingDay = (dayIndex: number) => {
    if (!selectedStaff) return;
    const updated = selectedStaff.workingHours.map((wh) =>
      wh.dayOfWeek === dayIndex ? { ...wh, isOpen: !wh.isOpen } : wh
    );
    onUpdateStaffSchedule(selectedStaff.id, updated);
  };

  const updateWorkingTime = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    if (!selectedStaff) return;
    const updated = selectedStaff.workingHours.map((wh) =>
      wh.dayOfWeek === dayIndex ? { ...wh, [field]: value } : wh
    );
    onUpdateStaffSchedule(selectedStaff.id, updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Staff Specialists &amp; Shift Rosters
          </h2>
          <p className="text-xs text-neutral-500">
            Manage provider profiles, skill qualifications, working hours, and live availability statuses.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Specialist Staff</span>
        </button>
      </div>

      {/* Main Split Grid: Staff Cards & Selected Staff Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Staff Cards Roster */}
        <div className="space-y-3">
          {staff.map((st) => {
            const isSelected = selectedStaff?.id === st.id;
            return (
              <div
                key={st.id}
                onClick={() => setSelectedStaffId(st.id)}
                className={`p-4 rounded-xl border bg-white dark:bg-[#12151b] transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-red-500 dark:border-red-600 ring-1 ring-red-500/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        {st.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500">{st.title}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      st.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : st.status === 'busy'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {st.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
                  <span className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">{st.rating}</span>
                  </span>
                  <span>{st.totalAppointmentsCount} completed</span>
                  <span>{st.providedServiceIds.length} services</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (2 spans): Selected Staff Profile & Working Hours Schedule */}
        {selectedStaff && (
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={selectedStaff.avatar}
                    alt={selectedStaff.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-red-500/20"
                  />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
                      {selectedStaff.name}
                    </h3>
                    <p className="text-xs text-neutral-500">{selectedStaff.title}</p>
                    <div className="text-xs text-neutral-400 flex items-center space-x-3 mt-1">
                      <span>{selectedStaff.phone}</span>
                      <span>•</span>
                      <span>{selectedStaff.email}</span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-500">Live Status:</span>
                  <select
                    value={selectedStaff.status}
                    onChange={(e) =>
                      onUpdateStaffStatus(selectedStaff.id, e.target.value as StaffMember['status'])
                    }
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                  >
                    <option value="available">Available (Accepting bookings)</option>
                    <option value="busy">Busy (In Session)</option>
                    <option value="on_break">On Break</option>
                    <option value="day_off">Day Off</option>
                  </select>
                </div>
              </div>

              {/* Provided Services Tags */}
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Qualified Services ({selectedStaff.providedServiceIds.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.providedServiceIds.map((srvId) => {
                    const srv = services.find((s) => s.id === srvId);
                    if (!srv) return null;
                    return (
                      <span
                        key={srv.id}
                        className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700/60 flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3 text-red-600" />
                        <span>{srv.name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Working Hours Schedule Editor */}
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white font-['Poppins'] uppercase tracking-wider">
                    Weekly Working Hours &amp; Shift Roster
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Controls available time slots visible on the client online booking portal.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {selectedStaff.workingHours.map((wh) => (
                  <div
                    key={wh.dayOfWeek}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      wh.isOpen
                        ? 'bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800'
                        : 'bg-neutral-100/50 dark:bg-neutral-900/60 border-neutral-100 dark:border-neutral-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 w-32">
                      <input
                        type="checkbox"
                        checked={wh.isOpen}
                        onChange={() => toggleWorkingDay(wh.dayOfWeek)}
                        className="rounded border-neutral-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {wh.dayName}
                      </span>
                    </div>

                    {wh.isOpen ? (
                      <div className="flex items-center space-x-2 font-mono text-xs">
                        <input
                          type="time"
                          value={wh.startTime}
                          onChange={(e) => updateWorkingTime(wh.dayOfWeek, 'startTime', e.target.value)}
                          className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                        <span className="text-neutral-400">to</span>
                        <input
                          type="time"
                          value={wh.endTime}
                          onChange={(e) => updateWorkingTime(wh.dayOfWeek, 'endTime', e.target.value)}
                          className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                        />
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic text-[11px]">Day Off / Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Appointment Ledger */}
            <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white font-['Poppins'] uppercase tracking-wider">
                Assigned Bookings ({staffAppointments.length})
              </h4>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {staffAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-white">
                        {apt.customerName} · {apt.serviceName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {apt.date} at {apt.startTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">
                        KES {apt.priceKes.toLocaleString()}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Register New Specialist
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Mutua"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Professional Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Aesthetic Therapist"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 000 000"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samuel@paperglowstudio.co.ke"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  Save Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
