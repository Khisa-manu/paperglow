import React, { useState, useMemo } from 'react';
import { Student, SchoolClass } from '../../types/schoolManager';
import {
  Search,
  Filter,
  UserPlus,
  Users,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  DollarSign,
  ChevronRight,
  Eye,
  Trash2,
} from 'lucide-react';

interface StudentsModuleProps {
  students: Student[];
  classes: SchoolClass[];
  onOpenAdmitStudent: () => void;
  onSelectStudentForPayment: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({
  students,
  classes,
  onOpenAdmitStudent,
  onSelectStudentForPayment,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedBoarding, setSelectedBoarding] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState<string>('all');
  const [activeStudentDetail, setActiveStudentDetail] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.fullName.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q) ||
        s.nemisUpi.toLowerCase().includes(q) ||
        s.guardianName.toLowerCase().includes(q) ||
        s.guardianPhone.includes(q);

      const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
      const matchesBoarding = selectedBoarding === 'all' || s.boardingStatus === selectedBoarding;
      const matchesGender = selectedGender === 'all' || s.gender === selectedGender;
      const matchesFee =
        selectedFeeFilter === 'all' ||
        (selectedFeeFilter === 'cleared' && s.feeBalanceKes === 0) ||
        (selectedFeeFilter === 'arrears' && s.feeBalanceKes > 0);

      return matchesSearch && matchesClass && matchesBoarding && matchesGender && matchesFee;
    });
  }, [students, searchQuery, selectedClass, selectedBoarding, selectedGender, selectedFeeFilter]);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Students Master Roll &amp; Directory
          </h1>
          <p className="text-xs text-neutral-500">
            {students.length} active registered pupils across {classes.length} classroom streams
          </p>
        </div>

        <button
          onClick={onOpenAdmitStudent}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, admission #, NEMIS UPI..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Filter: Class */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="all">All Classes &amp; Streams</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter: Boarding */}
          <div>
            <select
              value={selectedBoarding}
              onChange={(e) => setSelectedBoarding(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="all">All Resident Types</option>
              <option value="Boarder">Boarders Only</option>
              <option value="Day Scholar">Day Scholars Only</option>
            </select>
          </div>

          {/* Filter: Fee Status */}
          <div>
            <select
              value={selectedFeeFilter}
              onChange={(e) => setSelectedFeeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="all">All Fee Balances</option>
              <option value="cleared">Fees Cleared (KES 0)</option>
              <option value="arrears">Outstanding Arrears</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Adm # &amp; UPI</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class &amp; Stream</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-right">Fee Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {s.admissionNumber}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">{s.nemisUpi}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {s.fullName}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {s.gender} • DOB: {s.dateOfBirth}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {s.className}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.boardingStatus === 'Boarder'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {s.boardingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-neutral-900 dark:text-neutral-100 text-[11px] font-medium">
                        {s.guardianName} ({s.guardianRelationship})
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {s.guardianPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {s.feeBalanceKes > 0 ? (
                        <span className="font-bold text-red-600 dark:text-red-400">
                          KES {s.feeBalanceKes.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">Cleared</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 capitalize">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setActiveStudentDetail(s)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          title="View Student Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {s.feeBalanceKes > 0 && (
                          <button
                            onClick={() => onSelectStudentForPayment(s)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                            title="Record Payment"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteStudent(s.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          title="Archive / Remove Student"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: View Student Full Profile */}
      {activeStudentDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setActiveStudentDetail(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-bold font-['Poppins'] flex items-center justify-center text-lg">
                  {activeStudentDetail.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                    {activeStudentDetail.fullName}
                  </h2>
                  <div className="text-xs text-neutral-500 font-mono">
                    Adm: {activeStudentDetail.admissionNumber} • NEMIS: {activeStudentDetail.nemisUpi}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentDetail(null)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Class &amp; Stream</div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {activeStudentDetail.className}
                </div>
                <div className="text-[11px] text-neutral-500">{activeStudentDetail.stream}</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Residency &amp; Gender</div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {activeStudentDetail.boardingStatus} • {activeStudentDetail.gender}
                </div>
                <div className="text-[11px] text-neutral-500">DOB: {activeStudentDetail.dateOfBirth}</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Fee Account Status</div>
                <div className="font-mono font-bold mt-0.5 text-sm">
                  {activeStudentDetail.feeBalanceKes > 0 ? (
                    <span className="text-red-600">KES {activeStudentDetail.feeBalanceKes.toLocaleString()} due</span>
                  ) : (
                    <span className="text-emerald-600">Zero Balance (Cleared)</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">KCPE Entrance Mark</div>
                <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 text-sm">
                  {activeStudentDetail.kcpeMarks ? `${activeStudentDetail.kcpeMarks} / 500` : 'CBC Form Entrance'}
                </div>
              </div>
            </div>

            {/* Guardian Info */}
            <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-wider">
                Primary Guardian Contact
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                  {activeStudentDetail.guardianName} ({activeStudentDetail.guardianRelationship})
                </span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100 font-bold">
                  {activeStudentDetail.guardianPhone}
                </span>
              </div>
              <div className="text-[11px] text-neutral-500">
                Email: {activeStudentDetail.guardianEmail || 'N/A'} • Address: {activeStudentDetail.residentialAddress}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  const s = activeStudentDetail;
                  setActiveStudentDetail(null);
                  onSelectStudentForPayment(s);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Record Payment / View Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
