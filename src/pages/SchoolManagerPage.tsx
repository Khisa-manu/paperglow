import React, { useState, useEffect } from 'react';
import {
  SchoolModule,
  Student,
  TeacherStaff,
  SchoolClass,
  Subject,
  AttendanceRecord,
  StaffAttendanceRecord,
  FeeStructureItem,
  FeeInvoice,
  FeePayment,
  ExamRecord,
  StudentExamResult,
  TimetableSlot,
  HomeworkAssignment,
  SchoolAnnouncement,
  SchoolEvent,
  SchoolNotification,
  SchoolSettings,
} from '../types/schoolManager';

import {
  DEFAULT_SCHOOL_SETTINGS,
  DEFAULT_CLASSES,
  DEFAULT_SUBJECTS,
  DEFAULT_TEACHERS,
  DEFAULT_STUDENTS,
  DEFAULT_ATTENDANCE,
  DEFAULT_STAFF_ATTENDANCE,
  DEFAULT_FEE_STRUCTURE,
  DEFAULT_FEE_INVOICES,
  DEFAULT_FEE_PAYMENTS,
  DEFAULT_EXAMS,
  DEFAULT_STUDENT_RESULTS,
  DEFAULT_TIMETABLE,
  DEFAULT_ASSIGNMENTS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_EVENTS,
  DEFAULT_NOTIFICATIONS,
} from '../data/defaultSchoolManagerData';

import { SchoolManagerHeader } from '../components/schoolManager/SchoolManagerHeader';
import { SchoolManagerSidebar } from '../components/schoolManager/SchoolManagerSidebar';
import { DashboardModule } from '../components/schoolManager/DashboardModule';
import { StudentsModule } from '../components/schoolManager/StudentsModule';
import { TeachersModule } from '../components/schoolManager/TeachersModule';
import { ClassesModule } from '../components/schoolManager/ClassesModule';
import { AttendanceModule } from '../components/schoolManager/AttendanceModule';
import { FeesModule } from '../components/schoolManager/FeesModule';
import { ExamsModule } from '../components/schoolManager/ExamsModule';
import { TimetableModule } from '../components/schoolManager/TimetableModule';
import { HomeworkModule } from '../components/schoolManager/HomeworkModule';
import { CommunicationModule } from '../components/schoolManager/CommunicationModule';
import { EventsModule } from '../components/schoolManager/EventsModule';
import { ReportsModule } from '../components/schoolManager/ReportsModule';
import { NotificationsModule } from '../components/schoolManager/NotificationsModule';
import { SettingsModule } from '../components/schoolManager/SettingsModule';
import { AddStudentModal } from '../components/schoolManager/AddStudentModal';
import { RecordPaymentModal } from '../components/schoolManager/RecordPaymentModal';
import { CheckCircle2 } from 'lucide-react';

interface SchoolManagerPageProps {
  onBackToPaperglow: () => void;
}

export const SchoolManagerPage: React.FC<SchoolManagerPageProps> = ({
  onBackToPaperglow,
}) => {
  const [currentModule, setCurrentModule] = useState<SchoolModule>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetStudent, setPaymentTargetStudent] = useState<Student | null>(null);

  // Toast Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // State with LocalStorage fallbacks
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('paperglow_school_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_SETTINGS;
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('paperglow_school_classes');
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('paperglow_school_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [teachers, setTeachers] = useState<TeacherStaff[]>(() => {
    const saved = localStorage.getItem('paperglow_school_teachers');
    return saved ? JSON.parse(saved) : DEFAULT_TEACHERS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('paperglow_school_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_school_attendance');
    return saved ? JSON.parse(saved) : DEFAULT_ATTENDANCE;
  });

  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_school_staff_attendance');
    return saved ? JSON.parse(saved) : DEFAULT_STAFF_ATTENDANCE;
  });

  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>(() => {
    const saved = localStorage.getItem('paperglow_school_feestructures');
    return saved ? JSON.parse(saved) : DEFAULT_FEE_STRUCTURE;
  });

  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => {
    const saved = localStorage.getItem('paperglow_school_invoices');
    return saved ? JSON.parse(saved) : DEFAULT_FEE_INVOICES;
  });

  const [payments, setPayments] = useState<FeePayment[]>(() => {
    const saved = localStorage.getItem('paperglow_school_payments');
    return saved ? JSON.parse(saved) : DEFAULT_FEE_PAYMENTS;
  });

  const [exams, setExams] = useState<ExamRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_school_exams');
    return saved ? JSON.parse(saved) : DEFAULT_EXAMS;
  });

  const [results, setResults] = useState<StudentExamResult[]>(() => {
    const saved = localStorage.getItem('paperglow_school_results');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_RESULTS;
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('paperglow_school_timetable');
    return saved ? JSON.parse(saved) : DEFAULT_TIMETABLE;
  });

  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(() => {
    const saved = localStorage.getItem('paperglow_school_assignments');
    return saved ? JSON.parse(saved) : DEFAULT_ASSIGNMENTS;
  });

  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() => {
    const saved = localStorage.getItem('paperglow_school_announcements');
    return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem('paperglow_school_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [notifications, setNotifications] = useState<SchoolNotification[]>(() => {
    const saved = localStorage.getItem('paperglow_school_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('paperglow_school_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_staff_attendance', JSON.stringify(staffAttendance));
  }, [staffAttendance]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('paperglow_school_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Dark Mode Toggle
  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handlers
  const handleAddStudent = (
    newStudentData: Omit<Student, 'id' | 'feeBalanceKes'>
  ) => {
    const newId = `std-${Date.now().toString().slice(-4)}`;
    const termFee = newStudentData.boardingStatus === 'Boarder' ? 67000 : 39000;

    const newStudent: Student = {
      ...newStudentData,
      id: newId,
      feeBalanceKes: termFee,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Create fee invoice automatically
    const newInvoice: FeeInvoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-2026-T1-${newStudent.admissionNumber.slice(-4)}`,
      studentId: newId,
      studentName: newStudent.fullName,
      admissionNumber: newStudent.admissionNumber,
      className: newStudent.className,
      term: 'Term 1',
      academicYear: '2026',
      amountDueKes: termFee,
      amountPaidKes: 0,
      balanceKes: termFee,
      dueDate: '2026-02-15',
      status: 'pending',
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Update class student count
    setClasses((prev) =>
      prev.map((c) =>
        c.id === newStudent.classId ? { ...c, studentCount: c.studentCount + 1 } : c
      )
    );

    showToast(`Student ${newStudent.fullName} (${newStudent.admissionNumber}) admitted successfully.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (target) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === target.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c
        )
      );
      showToast(`Student record removed.`);
    }
  };

  const handleAddTeacher = (teacherData: Omit<TeacherStaff, 'id'>) => {
    const newId = `tch-${Date.now().toString().slice(-4)}`;
    const newTeacher: TeacherStaff = {
      ...teacherData,
      id: newId,
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    showToast(`Staff member ${newTeacher.fullName} registered.`);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    showToast(`Staff member removed.`);
  };

  const handleAddClass = (classData: Omit<SchoolClass, 'id'>) => {
    const newId = `cls-${Date.now().toString().slice(-4)}`;
    const newCls: SchoolClass = { ...classData, id: newId };
    setClasses((prev) => [...prev, newCls]);
    showToast(`Class stream "${newCls.name}" created.`);
  };

  const handleAddSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newId = `sub-${Date.now().toString().slice(-4)}`;
    const newSub: Subject = { ...subjectData, id: newId };
    setSubjects((prev) => [...prev, newSub]);
    showToast(`Subject ${newSub.name} (${newSub.code}) added.`);
  };

  const handleRecordPayment = (
    paymentData: Omit<FeePayment, 'id' | 'receiptNumber'>
  ) => {
    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: FeePayment = {
      ...paymentData,
      id: `pay-${Date.now().toString().slice(-4)}`,
      receiptNumber: receiptNum,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update student balance
    setStudents((prev) =>
      prev.map((s) =>
        s.id === newPayment.studentId
          ? {
              ...s,
              feeBalanceKes: Math.max(0, s.feeBalanceKes - newPayment.amountKes),
            }
          : s
      )
    );

    // Update invoice
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.studentId === newPayment.studentId) {
          const newPaid = inv.amountPaidKes + newPayment.amountKes;
          const newBal = Math.max(0, inv.amountDueKes - newPaid);
          const newStatus = newBal === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'pending';
          return {
            ...inv,
            amountPaidKes: newPaid,
            balanceKes: newBal,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    showToast(`Payment of KES ${newPayment.amountKes.toLocaleString()} recorded. Receipt #${receiptNum} generated.`);
  };

  const handleTogglePublishExam = (examId: string) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, isPublished: !e.isPublished } : e))
    );
    showToast('Exam publication status updated.');
  };

  const handleAddAssignment = (
    assignmentData: Omit<HomeworkAssignment, 'id' | 'submissionsCount'>
  ) => {
    const newAssignment: HomeworkAssignment = {
      ...assignmentData,
      id: `hw-${Date.now().toString().slice(-4)}`,
      submissionsCount: 0,
    };
    setAssignments((prev) => [newAssignment, ...prev]);
    showToast(`Homework task "${newAssignment.title}" published.`);
  };

  const handleUpdateAssignmentStatus = (
    id: string,
    status: HomeworkAssignment['status']
  ) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Assignment status marked as ${status}.`);
  };

  const handleAddAnnouncement = (annData: Omit<SchoolAnnouncement, 'id'>) => {
    const newAnn: SchoolAnnouncement = {
      ...annData,
      id: `ann-${Date.now().toString().slice(-4)}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(`Notice "${newAnn.title}" published${newAnn.smsSent ? ' and SMS broadcast sent' : ''}.`);
  };

  const handleSendSmsBroadcast = (annId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === annId ? { ...a, smsSent: true } : a))
    );
    showToast(`SMS broadcast dispatched to all registered parent phones.`);
  };

  const handleAddEvent = (evData: Omit<SchoolEvent, 'id'>) => {
    const newEv: SchoolEvent = {
      ...evData,
      id: `ev-${Date.now().toString().slice(-4)}`,
    };
    setEvents((prev) => [newEv, ...prev]);
    showToast(`Calendar event "${newEv.title}" scheduled.`);
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const handleSendSmsReminderToDebtors = () => {
    const debtors = students.filter((s) => s.feeBalanceKes > 0);
    showToast(`Fee reminder SMS broadcast queued for ${debtors.length} parent phone numbers via Paybill 400200.`);
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('paperglow_school_settings');
    localStorage.removeItem('paperglow_school_classes');
    localStorage.removeItem('paperglow_school_subjects');
    localStorage.removeItem('paperglow_school_teachers');
    localStorage.removeItem('paperglow_school_students');
    localStorage.removeItem('paperglow_school_attendance');
    localStorage.removeItem('paperglow_school_staff_attendance');
    localStorage.removeItem('paperglow_school_invoices');
    localStorage.removeItem('paperglow_school_payments');
    localStorage.removeItem('paperglow_school_assignments');
    localStorage.removeItem('paperglow_school_announcements');
    localStorage.removeItem('paperglow_school_events');
    localStorage.removeItem('paperglow_school_notifications');

    setSettings(DEFAULT_SCHOOL_SETTINGS);
    setClasses(DEFAULT_CLASSES);
    setSubjects(DEFAULT_SUBJECTS);
    setTeachers(DEFAULT_TEACHERS);
    setStudents(DEFAULT_STUDENTS);
    setAttendance(DEFAULT_ATTENDANCE);
    setStaffAttendance(DEFAULT_STAFF_ATTENDANCE);
    setInvoices(DEFAULT_FEE_INVOICES);
    setPayments(DEFAULT_FEE_PAYMENTS);
    setExams(DEFAULT_EXAMS);
    setResults(DEFAULT_STUDENT_RESULTS);
    setTimetable(DEFAULT_TIMETABLE);
    setAssignments(DEFAULT_ASSIGNMENTS);
    setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    setEvents(DEFAULT_EVENTS);
    setNotifications(DEFAULT_NOTIFICATIONS);

    showToast('Reset to Nairobi Hillview Academy authentic demo state.');
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-[#0c0e12] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <SchoolManagerHeader
        settings={settings}
        notifications={notifications}
        onOpenAdmitStudent={() => setIsAdmitModalOpen(true)}
        onNavigateModule={(mod) => setCurrentModule(mod)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onBackToPaperglow={onBackToPaperglow}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Body Layout: Sidebar + Main Workspace */}
      <div className="flex-1 flex w-full">
        <SchoolManagerSidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          counts={{
            students: students.length,
            teachers: teachers.length,
            feeArrearsCount: invoices.filter((i) => i.balanceKes > 0).length,
            unreadNotifications: notifications.filter((n) => !n.isRead).length,
            activeAssignments: assignments.filter((a) => a.status === 'active').length,
          }}
        />

        {/* Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {currentModule === 'dashboard' && (
            <DashboardModule
              students={students}
              teachers={teachers}
              classes={classes}
              attendance={attendance}
              invoices={invoices}
              payments={payments}
              exams={exams}
              events={events}
              announcements={announcements}
              notifications={notifications}
              onNavigateModule={(mod) => setCurrentModule(mod)}
              onOpenAdmitStudent={() => setIsAdmitModalOpen(true)}
              onOpenRecordPayment={() => {
                setPaymentTargetStudent(null);
                setIsPaymentModalOpen(true);
              }}
            />
          )}

          {currentModule === 'students' && (
            <StudentsModule
              students={students}
              classes={classes}
              onOpenAdmitStudent={() => setIsAdmitModalOpen(true)}
              onSelectStudentForPayment={(student) => {
                setPaymentTargetStudent(student);
                setIsPaymentModalOpen(true);
              }}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {currentModule === 'teachers' && (
            <TeachersModule
              teachers={teachers}
              classes={classes}
              onAddTeacher={handleAddTeacher}
              onDeleteTeacher={handleDeleteTeacher}
            />
          )}

          {currentModule === 'classes' && (
            <ClassesModule
              classes={classes}
              subjects={subjects}
              teachers={teachers}
              onAddClass={handleAddClass}
              onAddSubject={handleAddSubject}
            />
          )}

          {currentModule === 'attendance' && (
            <AttendanceModule
              students={students}
              classes={classes}
              attendance={attendance}
              staffAttendance={staffAttendance}
              onUpdateAttendance={(recs) => setAttendance(recs)}
              onUpdateStaffAttendance={(recs) => setStaffAttendance(recs)}
            />
          )}

          {currentModule === 'fees' && (
            <FeesModule
              invoices={invoices}
              payments={payments}
              feeStructures={feeStructures}
              students={students}
              settings={settings}
              onOpenRecordPayment={(st) => {
                setPaymentTargetStudent(st || null);
                setIsPaymentModalOpen(true);
              }}
            />
          )}

          {currentModule === 'exams' && (
            <ExamsModule
              exams={exams}
              results={results}
              classes={classes}
              settings={settings}
              onTogglePublishExam={handleTogglePublishExam}
            />
          )}

          {currentModule === 'timetable' && (
            <TimetableModule
              slots={timetable}
              classes={classes}
              teachers={teachers}
            />
          )}

          {currentModule === 'assignments' && (
            <HomeworkModule
              assignments={assignments}
              classes={classes}
              subjects={subjects}
              onAddAssignment={handleAddAssignment}
              onUpdateStatus={handleUpdateAssignmentStatus}
            />
          )}

          {currentModule === 'communication' && (
            <CommunicationModule
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onSendSmsBroadcast={handleSendSmsBroadcast}
            />
          )}

          {currentModule === 'events' && (
            <EventsModule
              events={events}
              onAddEvent={handleAddEvent}
            />
          )}

          {currentModule === 'reports' && (
            <ReportsModule
              students={students}
              teachers={teachers}
              classes={classes}
              invoices={invoices}
              payments={payments}
              results={results}
              settings={settings}
            />
          )}

          {currentModule === 'notifications' && (
            <NotificationsModule
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationRead}
              onNavigateModule={(mod) => setCurrentModule(mod)}
              onSendSmsReminderToDebtors={handleSendSmsReminderToDebtors}
            />
          )}

          {currentModule === 'settings' && (
            <SettingsModule
              settings={settings}
              onUpdateSettings={(updated) => setSettings(updated)}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Modal: Admit Student */}
      <AddStudentModal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        classes={classes}
        onAddStudent={handleAddStudent}
      />

      {/* Modal: Record Fee Payment */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        students={students}
        initialStudent={paymentTargetStudent}
        onRecordPayment={handleRecordPayment}
      />
    </div>
  );
};
