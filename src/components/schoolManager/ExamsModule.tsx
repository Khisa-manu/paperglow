import React, { useState } from 'react';
import {
  ExamRecord,
  StudentExamResult,
  SchoolSettings,
  SchoolClass,
} from '../../types/schoolManager';
import {
  FileSpreadsheet,
  Award,
  Search,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { StudentReportCardModal } from './StudentReportCardModal';

interface ExamsModuleProps {
  exams: ExamRecord[];
  results: StudentExamResult[];
  classes: SchoolClass[];
  settings: SchoolSettings;
  onTogglePublishExam: (examId: string) => void;
}

export const ExamsModule: React.FC<ExamsModuleProps> = ({
  exams,
  results,
  classes,
  settings,
  onTogglePublishExam,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || 'ex-1');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingResult, setViewingResult] = useState<StudentExamResult | null>(null);

  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  const filteredResults = results.filter((r) => {
    const matchesExam = r.examId === selectedExamId;
    const matchesClass = selectedClassId === 'all' || r.className.includes(selectedClassId);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      r.studentName.toLowerCase().includes(q) || r.admissionNumber.toLowerCase().includes(q);
    return matchesExam && matchesClass && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Examinations, Marking &amp; Report Cards
          </h1>
          <p className="text-xs text-neutral-500">
            Continuous assessment tests, Joint Mocks, KNEC grading scales and student performance ledgers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentExam && (
            <button
              onClick={() => onTogglePublishExam(currentExam.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors ${
                currentExam.isPublished
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{currentExam.isPublished ? 'Published to Parents' : 'Publish Results'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Exam Series Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {exams.map((ex) => (
          <div
            key={ex.id}
            onClick={() => setSelectedExamId(ex.id)}
            className={`p-4 rounded-xl border transition-colors cursor-pointer space-y-2 ${
              selectedExamId === ex.id
                ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20 shadow-xs'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {ex.examType}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  ex.isPublished ? 'text-emerald-600' : 'text-neutral-400'
                }`}
              >
                {ex.isPublished ? '● Published' : '○ Draft'}
              </span>
            </div>

            <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
              {ex.name}
            </h3>

            <div className="text-[11px] text-neutral-500 flex items-center justify-between font-mono">
              <span>{ex.term} • {ex.academicYear}</span>
              <span>{ex.startDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grading Scale Tier Reference Ribbon */}
      <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-neutral-100">
          <span className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-red-600" />
            <span>National KNEC &amp; School Grading Scale (12 Points Max)</span>
          </span>
          <span className="text-[11px] text-neutral-500 font-normal">Mean Grade Standard</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 text-center text-[11px]">
          {settings.gradingScale.map((g) => (
            <div
              key={g.grade}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800"
            >
              <div className="font-black text-red-700 dark:text-red-400 font-mono text-xs">
                {g.grade}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono">
                {g.minMark}-{g.maxMark}%
              </div>
              <div className="text-[9px] text-neutral-400 font-bold">{g.points} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Ledger & Filter */}
      <div className="space-y-4">
        <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name or adm #..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="all">All Participating Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Adm #</th>
                <th className="py-3 px-4">Student Candidate</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Subjects Tested</th>
                <th className="py-3 px-4 text-right">Total Marks</th>
                <th className="py-3 px-4 text-center">Mean (%)</th>
                <th className="py-3 px-4 text-center">Mean Grade</th>
                <th className="py-3 px-4 text-right">Official Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    No examination records found for this series.
                  </td>
                </tr>
              ) : (
                filteredResults.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-mono font-bold flex items-center justify-center text-[11px]">
                        #{res.streamRank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {res.admissionNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                      {res.studentName}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                      {res.className}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {res.subjects.length} Subjects
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {res.totalMarks}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-neutral-700 dark:text-neutral-300">
                      {res.meanMarks}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded font-black font-mono text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900">
                        {res.meanGrade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setViewingResult(res)}
                        className="px-3 py-1 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold text-[11px] cursor-pointer hover:opacity-90 inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Report Card</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Report Card Modal */}
      <StudentReportCardModal
        isOpen={!!viewingResult}
        onClose={() => setViewingResult(null)}
        result={viewingResult}
        settings={settings}
      />
    </div>
  );
};
