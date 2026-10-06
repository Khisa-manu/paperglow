import React from 'react';
import { StudentExamResult, SchoolSettings } from '../../types/schoolManager';
import { X, Printer, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

interface StudentReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: StudentExamResult | null;
  settings: SchoolSettings;
}

export const StudentReportCardModal: React.FC<StudentReportCardModalProps> = ({
  isOpen,
  onClose,
  result,
  settings,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white text-neutral-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-xs border border-neutral-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official School Report Header */}
        <div className="text-center space-y-1.5 border-b-2 border-red-700 pb-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-['Poppins'] tracking-tight uppercase text-neutral-900">
            {settings.schoolName}
          </h1>
          <p className="text-xs text-neutral-600 font-medium">
            {settings.physicalAddress} • {settings.poBox}
          </p>
          <p className="text-[11px] text-neutral-500 font-mono">
            MOE Reg: {settings.registrationNumber} • NEMIS: {settings.nemisCode} • KNEC Center: {settings.knecCenterCode}
          </p>
          <div className="inline-block mt-1 px-4 py-1 rounded bg-red-50 text-red-700 font-bold uppercase tracking-wider text-[11px] border border-red-200">
            Official Academic Progress Report Form — {settings.currentTerm} {settings.academicYear}
          </div>
        </div>

        {/* Student Identification Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Student Name</span>
            <span className="font-bold text-xs">{result.studentName}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Admission Number</span>
            <span className="font-mono font-bold text-xs">{result.admissionNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Class &amp; Stream</span>
            <span className="font-bold text-xs">{result.className}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Stream Position</span>
            <span className="font-bold text-xs text-red-600">
              Rank {result.streamRank} of {result.totalStudents}
            </span>
          </div>
        </div>

        {/* Marks Table */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold">
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 text-center">Score (%)</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3 text-center">Points</th>
                <th className="py-2.5 px-3">Subject Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-medium">
              {result.subjects.map((sub, i) => (
                <tr key={i} className="hover:bg-neutral-50/80">
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">
                    {sub.subjectName}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                    {sub.marks}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-bold text-red-700 font-mono">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-neutral-600">
                    {sub.points}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-600 text-[11px]">
                    {sub.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-red-50 border-t-2 border-red-600 font-bold text-neutral-900">
                <td className="py-3 px-3">Total Score / Summary</td>
                <td className="py-3 px-3 text-center font-mono text-sm">
                  {result.totalMarks}
                </td>
                <td className="py-3 px-3 text-center font-mono text-base text-red-700">
                  {result.meanGrade}
                </td>
                <td className="py-3 px-3 text-center font-mono text-sm">
                  Mean: {result.meanMarks}%
                </td>
                <td className="py-3 px-3 text-xs text-red-800">
                  Class Rank: {result.streamRank} of {result.totalStudents}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Remarks Section */}
        <div className="space-y-3 pt-1">
          <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500">
              Class Teacher's Remarks
            </span>
            <p className="text-xs text-neutral-800 italic">
              "{result.classTeacherRemarks}"
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                Principal's Official Recommendation &amp; Seal
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {settings.principalName}
              </span>
            </div>
            <p className="text-xs text-neutral-800 italic">
              "{result.principalRemarks}"
            </p>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 print:hidden">
          <span className="text-[11px] text-neutral-400 font-mono">
            Next Term Opening Date: {settings.termStartDate}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Report Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
