export type SchoolModule =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'attendance'
  | 'fees'
  | 'exams'
  | 'timetable'
  | 'assignments'
  | 'communication'
  | 'events'
  | 'reports'
  | 'notifications'
  | 'settings';

export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'suspended';
export type BoardingStatus = 'Day Scholar' | 'Boarder';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type StaffAttendanceStatus = 'present' | 'absent' | 'late' | 'on_duty' | 'leave';
export type FeePaymentMethod = 'mpesa_paybill' | 'bank_deposit' | 'kcb_bank' | 'equity_bank' | 'cash' | 'cheque';
export type InvoiceStatus = 'paid' | 'partial' | 'pending' | 'overdue';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface Student {
  id: string;
  admissionNumber: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  classId: string;
  className: string;
  stream: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  residentialAddress: string;
  admissionDate: string;
  status: StudentStatus;
  boardingStatus: BoardingStatus;
  nemisUpi: string;
  emergencyContact: string;
  feeBalanceKes: number;
  kcpeMarks?: number;
}

export interface TeacherStaff {
  id: string;
  tscNumber: string;
  fullName: string;
  role: 'Principal' | 'Deputy Principal' | 'Senior Teacher' | 'Head of Department (HOD)' | 'Teacher' | 'School Bursar' | 'Librarian / Lab Tech';
  department: 'Mathematics & Computing' | 'Languages (English & Kiswahili)' | 'Sciences (Bio, Chem, Phys)' | 'Humanities & Social Sciences' | 'Technical & Applied Sciences' | 'Administration & Finance';
  email: string;
  phone: string;
  subjectsTaught: string[];
  assignedClasses: string[];
  qualification: string;
  employmentStatus: 'Permanent & Pensionable (TSC)' | 'BOM Contract' | 'Part-Time Intern';
  dateJoined: string;
  isClassTeacher: boolean;
  classTeacherOf?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: string;
  stream: string;
  capacity: number;
  studentCount: number;
  classTeacherId: string;
  classTeacherName: string;
  roomNumber: string;
  subjectsCount: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  category: 'CBC Core' | 'Compulsory' | 'Elective & Applied';
  periodsPerWeek: number;
  hodTeacherName: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  classId: string;
  className: string;
  status: AttendanceStatus;
  reason?: string;
  recordedBy: string;
}

export interface StaffAttendanceRecord {
  id: string;
  date: string;
  staffId: string;
  staffName: string;
  role: string;
  status: StaffAttendanceStatus;
  checkInTime: string;
}

export interface FeeStructureItem {
  id: string;
  classLevel: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  tuitionFeeKes: number;
  boardingFeeKes: number;
  activityFeeKes: number;
  examFeeKes: number;
  developmentLevyKes: number;
  totalDayScholarKes: number;
  totalBoarderKes: number;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  academicYear: string;
  amountDueKes: number;
  amountPaidKes: number;
  balanceKes: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface FeePayment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  amountKes: number;
  paymentMethod: FeePaymentMethod;
  transactionReference: string;
  paymentDate: string;
  recordedBy: string;
  notes?: string;
}

export interface ExamRecord {
  id: string;
  name: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  academicYear: string;
  examType: 'Opener CAT' | 'Mid-Term Exam' | 'End-Term Examination' | 'Mock Examination';
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

export interface SubjectMarkEntry {
  subjectCode: string;
  subjectName: string;
  marks: number;
  grade: string;
  points: number;
  remarks: string;
}

export interface StudentExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  stream: string;
  subjects: SubjectMarkEntry[];
  totalMarks: number;
  meanMarks: number;
  meanGrade: string;
  overallRank: number;
  streamRank: number;
  totalStudents: number;
  classTeacherRemarks: string;
  principalRemarks: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  totalMarks: number;
  description: string;
  submissionsCount: number;
  totalStudents: number;
  status: 'active' | 'closed' | 'graded';
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  category: 'General' | 'Academic' | 'Fees & Finance' | 'Event' | 'Emergency';
  audience: 'All Parents' | 'Teachers & Staff' | 'Boarding Parents' | 'Form 4 & Grade 9 Candidates';
  publishedDate: string;
  content: string;
  authorName: string;
  isUrgent: boolean;
  smsSent: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  eventType: 'Academic' | 'Sports & Co-Curricular' | 'Parents Meeting' | 'Holiday / Break' | 'Examination' | 'National Contest';
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  organizer: string;
  isPublic: boolean;
}

export interface SchoolNotification {
  id: string;
  type: 'fee_reminder' | 'attendance_alert' | 'exam_countdown' | 'circular';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  linkModule: SchoolModule;
  priority: 'urgent' | 'high' | 'normal';
}

export interface GradingScaleTier {
  grade: string;
  minMark: number;
  maxMark: number;
  points: number;
  remarks: string;
}

export interface SchoolSettings {
  schoolName: string;
  registrationNumber: string;
  nemisCode: string;
  knecCenterCode: string;
  motto: string;
  email: string;
  phone: string;
  physicalAddress: string;
  poBox: string;
  principalName: string;
  academicYear: string;
  currentTerm: 'Term 1' | 'Term 2' | 'Term 3';
  termStartDate: string;
  termEndDate: string;
  currency: 'KES';
  mpesaPaybill: string;
  mpesaAccountPrefix: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  gradingScale: GradingScaleTier[];
}
