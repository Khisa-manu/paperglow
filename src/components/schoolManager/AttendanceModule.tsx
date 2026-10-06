import React, { useState } from 'react';
import {
  Student,
  SchoolClass,
  AttendanceRecord,
  StaffAttendanceRecord,
  AttendanceStatus,
  StaffAttendanceStatus,
} from '../../types/schoolManager';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Users,
  GraduationCap,
  Calendar,
  Check,
} from 'lucide-react';

interface AttendanceModuleProps {
  students: Student[];
  classes: SchoolClass[];
  attendance: AttendanceRecord[];
  staffAttendance: StaffAttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  onUpdateStaffAttendance: (records: StaffAttendanceRecord[]) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  students,
  classes,
  attendance,
  staffAttendance,
  onUpdateAttendance,
  onUpdateStaffAttendance,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'staff'>('students');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Map students to their attendance for this class and date
  const studentRows = classStudents.map((st) => {
    const existing = attendance.find(
      (a) => a.studentId === st.id && a.date === selectedDate
    );
    return {
      student: st,
      status: (existing?.status || 'present') as AttendanceStatus,
      reason: existing?.reason || '',
    };
  });

  const presentCount = studentRows.filter((r) => r.status === 'present').length;
  const lateCount = studentRows.filter((r) => r.status === 'late').length;
  const absentCount = studentRows.filter((r) => r.status === 'absent').length;
  const excusedCount = studentRows.filter((r) => r.status === 'excused').length;
  const total = studentRows.length;
  const percentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    const updated = [...attendance];
    const index = updated.findIndex(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    if (index >= 0) {
      updated[index] = {
        ...updated[index],
        status: newStatus,
      };
    } else {
      updated.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        date: selectedDate,
        studentId,
        studentName: targetStudent.fullName,
        admissionNumber: targetStudent.admissionNumber,
        classId: targetStudent.classId,
        className: targetStudent.className,
        status: newStatus,
        recordedBy: selectedClass.classTeacherName,
      });
    }

    onUpdateAttendance(updated);
  };

  const handleReasonChange = (studentId: string, newReason: string) => {
    const updated = [...attendance];
    const index = updated.findIndex(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
    if (index >= 0) {
      updated[index] = { ...updated[index], reason: newReason };
      onUpdateAttendance(updated);
    }
  };

  const handleMarkAllPresent = () => {
    const updated = [...attendance];
    classStudents.forEach((st) => {
      const idx = updated.findIndex((a) => a.studentId === st.id && a.date === selectedDate);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], status: 'present', reason: '' };
      } else {
        updated.push({
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          date: selectedDate,
          studentId: st.id,
          studentName: st.fullName,
          admissionNumber: st.admissionNumber,
          classId: st.classId,
          className: st.className,
          status: 'present',
          recordedBy: selectedClass.classTeacherName,
        });
      }
    });
    onUpdateAttendance(updated);
  };

  const handleStaffStatusChange = (staffId: string, newStatus: StaffAttendanceStatus) => {
    const updated = staffAttendance.map((s) =>
      s.staffId === staffId ? { ...s, status: newStatus } : s
    );
    onUpdateStaffAttendance(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Daily Attendance Register &amp; Roll Call
          </h1>
          <p className="text-xs text-neutral-500">
            Ministry of Education &amp; NEMIS compliant daily student presence and staff clock-in audit
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'students'
                ? 'bg-white dark:bg-[#14171d] text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Students Roll Call</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'staff'
                ? 'bg-white dark:bg-[#14171d] text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Staff Attendance</span>
          </button>
        </div>
      </div>

      {activeTab === 'students' ? (
        <>
          {/* Controls Bar */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                  Select Classroom Stream
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-semibold focus:outline-none"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.stream})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                  Register Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                >
                </input>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Class Roll</span>
              <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {total} Students
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">
                Teacher: {selectedClass.classTeacherName}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Present</span>
              <div className="text-xl font-bold font-mono text-emerald-600">
                {presentCount}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">On time in class</span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-[10px] font-bold text-amber-500 uppercase">Late Arrival</span>
              <div className="text-xl font-bold font-mono text-amber-500">
                {lateCount}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">Recorded at gate</span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-[10px] font-bold text-red-500 uppercase">Absent</span>
              <div className="text-xl font-bold font-mono text-red-500">
                {absentCount}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">Unexcused</span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Daily Rate</span>
              <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {percentage}%
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Compliance Target met</span>
            </div>
          </div>

          {/* Roll Call Table */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
                  <th className="py-3 px-4">Adm #</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Residency</th>
                  <th className="py-3 px-4">Attendance Status Marking</th>
                  <th className="py-3 px-4">Lateness / Absence Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {studentRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-400">
                      No students enrolled in this stream yet.
                    </td>
                  </tr>
                ) : (
                  studentRows.map(({ student: st, status, reason }) => (
                    <tr
                      key={st.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {st.admissionNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">
                          {st.fullName}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Parent: {st.guardianName} ({st.guardianPhone})
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-neutral-500">
                          {st.boardingStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900 space-x-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'present')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'late')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              status === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'absent')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              status === 'absent'
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'excused')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              status === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                            }`}
                          >
                            Excused
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={reason}
                          onChange={(e) => handleReasonChange(st.id, e.target.value)}
                          placeholder={
                            status === 'late'
                              ? 'e.g. Heavy traffic along Langata Rd'
                              : status === 'absent'
                              ? 'e.g. Medical doctor appointment'
                              : 'Optional remarks...'
                          }
                          className="w-full px-2.5 py-1 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-red-600"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Staff Attendance Tab */
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Staff Clock-In Registry — {selectedDate}
              </h2>
              <p className="text-xs text-neutral-500">
                Daily duty log for teaching staff, administration and laboratory personnel
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">
              9 Staff Present &amp; On Duty
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Clock-In Time</th>
                <th className="py-3 px-4">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {staffAttendance.map((stf) => (
                <tr
                  key={stf.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                    {stf.staffName}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{stf.role}</td>
                  <td className="py-3 px-4 font-mono text-neutral-500">{stf.checkInTime}</td>
                  <td className="py-3 px-4">
                    <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-900 space-x-1">
                      <button
                        onClick={() => handleStaffStatusChange(stf.staffId, 'present')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          stf.status === 'present'
                            ? 'bg-emerald-600 text-white'
                            : 'text-neutral-500'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStaffStatusChange(stf.staffId, 'late')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          stf.status === 'late' ? 'bg-amber-500 text-white' : 'text-neutral-500'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleStaffStatusChange(stf.staffId, 'on_duty')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          stf.status === 'on_duty' ? 'bg-blue-600 text-white' : 'text-neutral-500'
                        }`}
                      >
                        On Duty
                      </button>
                      <button
                        onClick={() => handleStaffStatusChange(stf.staffId, 'leave')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          stf.status === 'leave' ? 'bg-purple-600 text-white' : 'text-neutral-500'
                        }`}
                      >
                        On Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
