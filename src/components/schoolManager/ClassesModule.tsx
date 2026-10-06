import React, { useState } from 'react';
import { SchoolClass, Subject, TeacherStaff } from '../../types/schoolManager';
import {
  Layers,
  BookOpen,
  Plus,
  Users,
  DoorOpen,
  UserCheck,
  Check,
  X,
} from 'lucide-react';

interface ClassesModuleProps {
  classes: SchoolClass[];
  subjects: Subject[];
  teachers: TeacherStaff[];
  onAddClass: (newClass: Omit<SchoolClass, 'id'>) => void;
  onAddSubject: (newSubject: Omit<Subject, 'id'>) => void;
}

export const ClassesModule: React.FC<ClassesModuleProps> = ({
  classes,
  subjects,
  teachers,
  onAddClass,
  onAddSubject,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // Class Form State
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Form 2');
  const [stream, setStream] = useState('East');
  const [capacity, setCapacity] = useState(45);
  const [classTeacherId, setClassTeacherId] = useState(teachers[0]?.id || '');
  const [roomNumber, setRoomNumber] = useState('Block C, Rm 301');

  // Subject Form State
  const [subCode, setSubCode] = useState('FRE113');
  const [subName, setSubName] = useState('French Foreign Language');
  const [subDept, setSubDept] = useState('Languages (English & Kiswahili)');
  const [subCategory, setSubCategory] = useState<Subject['category']>('Elective & Applied');
  const [subPeriods, setSubPeriods] = useState(4);
  const [subHod, setSubHod] = useState('Mrs. Faith Wambui');

  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    const teacher = teachers.find((t) => t.id === classTeacherId) || teachers[0];

    onAddClass({
      name: className.trim(),
      gradeLevel,
      stream,
      capacity: Number(capacity),
      studentCount: 0,
      classTeacherId: teacher.id,
      classTeacherName: teacher.fullName,
      roomNumber,
      subjectsCount: 8,
    });

    setIsAddClassModalOpen(false);
    setClassName('');
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;

    onAddSubject({
      code: subCode.trim(),
      name: subName.trim(),
      department: subDept,
      category: subCategory,
      periodsPerWeek: Number(subPeriods),
      hodTeacherName: subHod,
    });

    setIsAddSubjectModalOpen(false);
    setSubName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Classes, Streams &amp; Academic Subjects
          </h1>
          <p className="text-xs text-neutral-500">
            Manage classroom streams, room allocations, curricula and subject period distributions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'classes' ? (
            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Stream</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddSubjectModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'classes'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Classroom Streams ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'subjects'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum Subjects ({subjects.length})</span>
        </button>
      </div>

      {/* Tab 1: Classes & Streams Grid */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const fillRatio = Math.round((cls.studentCount / cls.capacity) * 100);
            return (
              <div
                key={cls.id}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                      {cls.gradeLevel}
                    </span>
                    <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] mt-1">
                      {cls.name}
                    </h2>
                    <div className="text-xs text-neutral-500">{cls.stream}</div>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    <DoorOpen className="w-4 h-4" />
                  </div>
                </div>

                {/* Capacity Fill */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Student Capacity</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {cls.studentCount} / {cls.capacity} ({fillRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        fillRatio >= 90 ? 'bg-amber-500' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(fillRatio, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-xs space-y-1.5 border border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Class Teacher:</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[140px]">
                      {cls.classTeacherName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Classroom:</span>
                    <span className="font-mono text-neutral-700 dark:text-neutral-300">
                      {cls.roomNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Subjects Taught:</span>
                    <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      {cls.subjectsCount} Subjects
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Curriculum Subjects Catalog */}
      {activeTab === 'subjects' && (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Academic Department</th>
                <th className="py-3 px-4">Curriculum Category</th>
                <th className="py-3 px-4 text-center">Periods / Wk</th>
                <th className="py-3 px-4">Head of Subject (HOD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {subjects.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {sub.code}
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                    {sub.name}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                    {sub.department}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.category === 'Compulsory'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {sub.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {sub.periodsPerWeek}
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                    {sub.hodTeacherName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create Class Stream */}
      {isAddClassModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsAddClassModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Create New Classroom Stream
              </h2>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleClassSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Form 2 Gamma"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="Form 2"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Stream Name
                  </label>
                  <input
                    type="text"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    placeholder="Gamma"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Class Teacher Assignment
                </label>
                <select
                  value={classTeacherId}
                  onChange={(e) => setClassTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Create Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Subject */}
      {isAddSubjectModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsAddSubjectModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Add Subject to Curriculum
              </h2>
              <button
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    placeholder="FRE113"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Periods / Week
                  </label>
                  <input
                    type="number"
                    value={subPeriods}
                    onChange={(e) => setSubPeriods(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Aviation Technology"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Department
                </label>
                <select
                  value={subDept}
                  onChange={(e) => setSubDept(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="Languages (English & Kiswahili)">Languages</option>
                  <option value="Mathematics & Computing">Mathematics &amp; Computing</option>
                  <option value="Sciences (Bio, Chem, Phys)">Sciences</option>
                  <option value="Humanities & Social Sciences">Humanities</option>
                  <option value="Technical & Applied Sciences">Technical &amp; Applied</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Head of Subject (HOD)
                </label>
                <input
                  type="text"
                  value={subHod}
                  onChange={(e) => setSubHod(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
