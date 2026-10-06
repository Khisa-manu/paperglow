import React, { useState } from 'react';
import { HomeworkAssignment, SchoolClass, Subject } from '../../types/schoolManager';
import { BookOpen, Plus, Calendar, CheckCircle2, Clock, Check, X } from 'lucide-react';

interface HomeworkModuleProps {
  assignments: HomeworkAssignment[];
  classes: SchoolClass[];
  subjects: Subject[];
  onAddAssignment: (assignment: Omit<HomeworkAssignment, 'id' | 'submissionsCount'>) => void;
  onUpdateStatus: (id: string, status: HomeworkAssignment['status']) => void;
}

export const HomeworkModule: React.FC<HomeworkModuleProps> = ({
  assignments,
  classes,
  subjects,
  onAddAssignment,
  onUpdateStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState(subjects[0]?.code || 'MAT101');
  const [classId, setClassId] = useState(classes[0]?.id || 'cls-1');
  const [teacherName, setTeacherName] = useState('Mr. David Kiprotich');
  const [dueDate, setDueDate] = useState('2026-03-01');
  const [totalMarks, setTotalMarks] = useState(30);
  const [description, setDescription] = useState('');

  const filtered = assignments.filter((a) => {
    const matchesClass = filterClass === 'all' || a.classId === filterClass;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesClass && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedSub = subjects.find((s) => s.code === subjectCode) || subjects[0];
    const selectedCls = classes.find((c) => c.id === classId) || classes[0];

    onAddAssignment({
      title: title.trim(),
      subjectCode: selectedSub.code,
      subjectName: selectedSub.name,
      classId: selectedCls.id,
      className: selectedCls.name,
      teacherName: teacherName.trim(),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      totalMarks: Number(totalMarks),
      description: description.trim(),
      totalStudents: selectedCls.studentCount || 40,
      status: 'active',
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Homework, Projects &amp; Continuous Assignments
          </h1>
          <p className="text-xs text-neutral-500">
            Track student submissions, exercises, laboratory practical reports and grading deadlines
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Filter Class:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Assignment Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Due Soon)</option>
            <option value="graded">Graded &amp; Marked</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((hw) => {
          const submissionPercent = Math.round((hw.submissionsCount / hw.totalStudents) * 100);
          return (
            <div
              key={hw.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                      {hw.subjectName}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">{hw.className}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      hw.status === 'active'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : hw.status === 'graded'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800'
                    }`}
                  >
                    {hw.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                  {hw.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {hw.description}
                </p>

                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 text-xs space-y-1.5 border border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-500">Teacher: {hw.teacherName}</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      Total Marks: {hw.totalMarks} pts
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Submissions Received</span>
                      <span className="font-mono font-bold">
                        {hw.submissionsCount} / {hw.totalStudents} ({submissionPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${Math.min(submissionPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-neutral-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>Due: {hw.dueDate}</span>
                </div>

                <div className="flex items-center space-x-1">
                  {hw.status === 'active' && (
                    <button
                      onClick={() => onUpdateStatus(hw.id, 'graded')}
                      className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 cursor-pointer"
                    >
                      Mark as Graded
                    </button>
                  )}
                  {hw.status === 'graded' && (
                    <button
                      onClick={() => onUpdateStatus(hw.id, 'closed')}
                      className="px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 font-bold text-[11px] cursor-pointer"
                    >
                      Archive Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Homework */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Assign Homework / Practical Exercise
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. KLB Biology Form 4: Genetics Monohybrid Crosses"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Subject
                  </label>
                  <select
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Target Class
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Total Marks (pts)
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Detailed Instructions &amp; Questions
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline questions, text book page references or submission format..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Post Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
