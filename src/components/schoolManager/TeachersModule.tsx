import React, { useState, useMemo } from 'react';
import { TeacherStaff, SchoolClass } from '../../types/schoolManager';
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Award,
  BookOpen,
  Briefcase,
  X,
  Check,
} from 'lucide-react';

interface TeachersModuleProps {
  teachers: TeacherStaff[];
  classes: SchoolClass[];
  onAddTeacher: (teacher: Omit<TeacherStaff, 'id'>) => void;
  onDeleteTeacher: (teacherId: string) => void;
}

export const TeachersModule: React.FC<TeachersModuleProps> = ({
  teachers,
  classes,
  onAddTeacher,
  onDeleteTeacher,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [tscNumber, setTscNumber] = useState('TSC/680192');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<TeacherStaff['role']>('Teacher');
  const [department, setDepartment] = useState<TeacherStaff['department']>('Sciences (Bio, Chem, Phys)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [subjectsTaught, setSubjectsTaught] = useState('Chemistry, Biology');
  const [qualification, setQualification] = useState('B.Ed Science (KU)');
  const [employmentStatus, setEmploymentStatus] = useState<TeacherStaff['employmentStatus']>('Permanent & Pensionable (TSC)');

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.fullName.toLowerCase().includes(q) ||
        t.tscNumber.toLowerCase().includes(q) ||
        t.subjectsTaught.some((s) => s.toLowerCase().includes(q));

      const matchesDept = selectedDept === 'all' || t.department === selectedDept;
      const matchesRole = selectedRole === 'all' || t.role === selectedRole;

      return matchesSearch && matchesDept && matchesRole;
    });
  }, [teachers, searchQuery, selectedDept, selectedRole]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onAddTeacher({
      tscNumber: tscNumber.trim(),
      fullName: fullName.trim(),
      role,
      department,
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@hillviewacademy.ac.ke`,
      phone: phone.trim(),
      subjectsTaught: subjectsTaught.split(',').map((s) => s.trim()).filter(Boolean),
      assignedClasses: ['Form 4 East', 'Form 3 Alpha'],
      qualification: qualification.trim(),
      employmentStatus,
      dateJoined: new Date().toISOString().split('T')[0],
      isClassTeacher: false,
    });

    setIsAddModalOpen(false);
    setFullName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Faculty &amp; Teaching Staff Roster
          </h1>
          <p className="text-xs text-neutral-500">
            {teachers.length} certified educators, department heads &amp; administrative leaders
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, TSC #, subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="Mathematics & Computing">Mathematics &amp; Computing</option>
              <option value="Languages (English & Kiswahili)">Languages (English &amp; Kiswahili)</option>
              <option value="Sciences (Bio, Chem, Phys)">Sciences (Bio, Chem, Phys)</option>
              <option value="Humanities & Social Sciences">Humanities &amp; Social Sciences</option>
              <option value="Technical & Applied Sciences">Technical &amp; Applied Sciences</option>
              <option value="Administration & Finance">Administration &amp; Finance</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="all">All Staff Roles</option>
              <option value="Principal">Principal</option>
              <option value="Deputy Principal">Deputy Principal</option>
              <option value="Head of Department (HOD)">Head of Department (HOD)</option>
              <option value="Senior Teacher">Senior Teacher</option>
              <option value="Teacher">Teacher</option>
              <option value="School Bursar">School Bursar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                    {t.role}
                  </span>
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] mt-1">
                    {t.fullName}
                  </h2>
                  <div className="font-mono text-[11px] text-neutral-500">{t.tscNumber}</div>
                </div>

                <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-bold text-xs">
                  {t.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs space-y-1.5 border border-neutral-100 dark:border-neutral-800/80">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">
                  {t.department}
                </div>
                {t.subjectsTaught.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {t.subjectsTaught.map((sub, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.2 rounded text-[10px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
                {t.isClassTeacher && (
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Class Teacher: {t.classTeacherOf}
                  </div>
                )}
              </div>

              <div className="text-xs text-neutral-500 space-y-1">
                <div className="flex items-center space-x-2 text-[11px]">
                  <Award className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{t.qualification}</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="font-mono">{t.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">{t.employmentStatus}</span>
              <button
                onClick={() => onDeleteTeacher(t.id)}
                className="text-neutral-400 hover:text-red-600 cursor-pointer text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Teacher */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Register Faculty / Staff Member
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Full Name &amp; Title *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mr. John Kamande Wambugu"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    TSC Number / Staff ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={tscNumber}
                    onChange={(e) => setTscNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Role &amp; Responsibility
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="Head of Department (HOD)">HOD</option>
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Deputy Principal">Deputy Principal</option>
                    <option value="Principal">Principal</option>
                    <option value="School Bursar">School Bursar</option>
                    <option value="Librarian / Lab Tech">Librarian / Lab Tech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Academic Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="Sciences (Bio, Chem, Phys)">Sciences (Bio, Chem, Phys)</option>
                  <option value="Mathematics & Computing">Mathematics &amp; Computing</option>
                  <option value="Languages (English & Kiswahili)">Languages (English &amp; Kiswahili)</option>
                  <option value="Humanities & Social Sciences">Humanities &amp; Social Sciences</option>
                  <option value="Technical & Applied Sciences">Technical &amp; Applied Sciences</option>
                  <option value="Administration & Finance">Administration &amp; Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Subjects Taught (comma separated)
                </label>
                <input
                  type="text"
                  value={subjectsTaught}
                  onChange={(e) => setSubjectsTaught(e.target.value)}
                  placeholder="e.g. Physics, Mathematics Core"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 722 000 000"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Academic Qualifications
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="B.Ed, M.Sc, etc."
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-xs"
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
