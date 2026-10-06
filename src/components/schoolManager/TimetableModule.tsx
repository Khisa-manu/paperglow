import React, { useState } from 'react';
import { TimetableSlot, SchoolClass, TeacherStaff, DayOfWeek } from '../../types/schoolManager';
import { Clock, Filter, Layers, GraduationCap, Calendar, Download } from 'lucide-react';

interface TimetableModuleProps {
  slots: TimetableSlot[];
  classes: SchoolClass[];
  teachers: TeacherStaff[];
}

export const TimetableModule: React.FC<TimetableModuleProps> = ({
  slots,
  classes,
  teachers,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const periods = [
    { num: 1, time: '08:00 - 08:45 AM', label: 'Period 1' },
    { num: 2, time: '08:45 - 09:30 AM', label: 'Period 2' },
    { num: 3, time: '09:30 - 10:15 AM', label: 'Period 3' },
    { num: 'break', time: '10:15 - 10:45 AM', label: 'Short Break / Tea' },
    { num: 4, time: '10:45 - 11:30 AM', label: 'Period 4' },
    { num: 5, time: '11:30 - 12:15 PM', label: 'Period 5' },
    { num: 'lunch', time: '12:15 - 01:15 PM', label: 'Lunch Break & Assembly' },
    { num: 6, time: '01:15 - 02:00 PM', label: 'Period 6' },
    { num: 7, time: '02:00 - 02:45 PM', label: 'Period 7' },
    { num: 8, time: '02:45 - 03:30 PM', label: 'Period 8' },
  ];

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const filteredSlots = slots.filter((s) => {
    if (viewMode === 'class') {
      return s.classId === selectedClassId;
    } else {
      return selectedTeacherId === 'all' || s.teacherId === selectedTeacherId;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Timetable &amp; Lesson Schedules
          </h1>
          <p className="text-xs text-neutral-500">
            Weekly 8-period academic schedule, laboratory practical rotations, and teacher allocations
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('class')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'class'
                ? 'bg-white dark:bg-[#14171d] text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Class Schedule
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'teacher'
                ? 'bg-white dark:bg-[#14171d] text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Teacher Load
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-wrap items-center justify-between gap-3">
        {viewMode === 'class' ? (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-500 font-medium">Select Stream:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-bold focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.roomNumber})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-500 font-medium">Select Faculty:</span>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-bold focus:outline-none"
            >
              <option value="all">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.department})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-xs text-neutral-500 font-medium">
          Monday – Friday • 8:00 AM – 4:00 PM • Games at 3:30 PM
        </div>
      </div>

      {/* Timetable Grid / Matrix */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
              <th className="py-3 px-3 w-32 border-r border-neutral-200 dark:border-neutral-800">
                Time / Period
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="py-3 px-3 min-w-[140px] text-center border-r border-neutral-200 dark:border-neutral-800 last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
            {periods.map((p, idx) => {
              if (p.num === 'break' || p.num === 'lunch') {
                return (
                  <tr
                    key={idx}
                    className="bg-neutral-100/70 dark:bg-neutral-900/40 text-neutral-500 font-bold"
                  >
                    <td className="py-2 px-3 border-r border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">
                      {p.time}
                    </td>
                    <td
                      colSpan={5}
                      className="py-2 px-3 text-center uppercase tracking-wider text-[10px] text-neutral-400"
                    >
                      {p.label}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20">
                  <td className="py-2.5 px-3 border-r border-neutral-200 dark:border-neutral-800 font-mono">
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {p.label}
                    </div>
                    <div className="text-[10px] text-neutral-400">{p.time}</div>
                  </td>

                  {days.map((day) => {
                    const match = filteredSlots.find(
                      (s) => s.dayOfWeek === day && s.periodNumber === p.num
                    );

                    return (
                      <td
                        key={day}
                        className="py-2.5 px-2.5 text-center border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 align-top"
                      >
                        {match ? (
                          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 space-y-0.5 text-left">
                            <div className="font-bold text-xs text-red-700 dark:text-red-300">
                              {match.subjectName}
                            </div>
                            <div className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium truncate">
                              {match.teacherName}
                            </div>
                            <div className="text-[9px] text-neutral-400 font-mono">
                              {match.roomNumber}
                            </div>
                          </div>
                        ) : (
                          <div className="text-neutral-300 dark:text-neutral-700 text-[10px] py-2">
                            — Study / Revise —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
