import React, { useState, useMemo } from 'react';
import { Patient, ClinicProfile } from '../../types/clinicManager';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  AlertTriangle,
  Heart,
  Calendar,
  CreditCard,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface PatientsModuleProps {
  patients: Patient[];
  clinic: ClinicProfile;
  onOpenRegisterPatient: () => void;
  onSelectPatient: (patientId: string) => void;
  onCheckInPatientToQueue: (patient: Patient) => void;
  onBookAppointmentForPatient: (patient: Patient) => void;
}

export const PatientsModule: React.FC<PatientsModuleProps> = ({
  patients,
  clinic,
  onOpenRegisterPatient,
  onSelectPatient,
  onCheckInPatientToQueue,
  onBookAppointmentForPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.fullName.toLowerCase().includes(q) ||
        p.patientNumber.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.nationalId.includes(q) ||
        p.residentialArea.toLowerCase().includes(q);

      const matchesBlood = bloodGroupFilter === 'all' || p.bloodGroup === bloodGroupFilter;
      const matchesPayment = paymentFilter === 'all' || p.paymentModePreference === paymentFilter;

      return matchesSearch && matchesBlood && matchesPayment;
    });
  }, [patients, searchQuery, bloodGroupFilter, paymentFilter]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Patient Registry &amp; Medical Dossiers</span>
          </h2>
          <p className="text-xs text-neutral-500">
            {patients.length} registered outpatient records &middot; Comprehensive demographics, allergies &amp; billing history
          </p>
        </div>

        <button
          onClick={onOpenRegisterPatient}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, CLN number, phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            <option value="all">All Blood Groups</option>
            <option value="O+">O Positive (O+)</option>
            <option value="A+">A Positive (A+)</option>
            <option value="B+">B Positive (B+)</option>
            <option value="AB+">AB Positive (AB+)</option>
            <option value="O-">O Negative (O-)</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            <option value="all">All Payment Modes</option>
            <option value="Cash / M-Pesa">Cash / M-Pesa</option>
            <option value="SHA / NHIF">SHA / NHIF</option>
            <option value="Private Insurance">Private Insurance</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Patient No.</th>
                <th className="py-3 px-4 font-semibold">Full Name &amp; Age</th>
                <th className="py-3 px-4 font-semibold">Contact &amp; Location</th>
                <th className="py-3 px-4 font-semibold">Blood / Allergies</th>
                <th className="py-3 px-4 font-semibold">Payment / Cover</th>
                <th className="py-3 px-4 font-semibold">Visits &amp; Balance</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No matching patient records found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40">
                    {/* Patient No */}
                    <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                      {p.patientNumber}
                    </td>

                    {/* Name & Age */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectPatient(p.id)}
                        className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-red-600 text-left cursor-pointer"
                      >
                        {p.fullName}
                      </button>
                      <span className="block text-[11px] text-neutral-500">
                        {p.gender} &middot; {p.age} yrs (DOB: {p.dateOfBirth})
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 text-neutral-700 dark:text-neutral-300">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{p.phone}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        {p.residentialArea}
                      </span>
                    </td>

                    {/* Blood & Allergies */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 font-bold text-neutral-900 dark:text-neutral-100">
                        <Heart className="w-3 h-3 text-red-600 fill-red-600" />
                        <span>{p.bloodGroup}</span>
                      </div>
                      {p.allergies.length > 0 && p.allergies[0] !== 'None Reported' ? (
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold block truncate max-w-[150px]">
                          Allergies: {p.allergies.join(', ')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 block">No known allergies</span>
                      )}
                    </td>

                    {/* Payment Mode */}
                    <td className="py-3 px-4">
                      <span className="font-semibold block">{p.paymentModePreference}</span>
                      {p.insuranceProvider && (
                        <span className="text-[10px] text-neutral-500 block truncate max-w-[140px]">
                          {p.insuranceProvider}
                        </span>
                      )}
                    </td>

                    {/* Visits & Balance */}
                    <td className="py-3 px-4">
                      <span className="font-mono">{p.totalVisits} visits</span>
                      {p.outstandingBalanceKes > 0 ? (
                        <span className="block text-[11px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                          Due: KES {p.outstandingBalanceKes.toLocaleString()}
                        </span>
                      ) : (
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          No Balance
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onCheckInPatientToQueue(p)}
                          className="px-2 py-1 rounded border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Check into Reception Queue"
                        >
                          Check In
                        </button>
                        <button
                          onClick={() => onSelectPatient(p.id)}
                          className="p-1 rounded text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          title="View Full Patient Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
