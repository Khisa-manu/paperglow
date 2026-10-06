import React, { useState } from 'react';
import { Student, SchoolClass } from '../../types/schoolManager';
import { X, UserPlus, Check } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: SchoolClass[];
  onAddStudent: (student: Omit<Student, 'id' | 'feeBalanceKes'>) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  classes,
  onAddStudent,
}) => {
  const [admissionNumber, setAdmissionNumber] = useState(
    `NHA-2026-${Math.floor(1000 + Math.random() * 9000).toString().slice(-4)}`
  );
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('2009-04-12');
  const [classId, setClassId] = useState(classes[0]?.id || 'cls-1');
  const [boardingStatus, setBoardingStatus] = useState<'Day Scholar' | 'Boarder'>('Day Scholar');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('+254 ');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('Parent');
  const [residentialAddress, setResidentialAddress] = useState('Nairobi, Kenya');
  const [nemisUpi, setNemisUpi] = useState(`UPI-${Math.floor(1000000 + Math.random() * 9000000)}-K`);
  const [emergencyContact, setEmergencyContact] = useState('+254 ');
  const [kcpeMarks, setKcpeMarks] = useState<number | undefined>(380);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !guardianName.trim()) return;

    const selectedClass = classes.find((c) => c.id === classId) || classes[0];

    onAddStudent({
      admissionNumber,
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      classId: selectedClass.id,
      className: selectedClass.name,
      stream: selectedClass.stream,
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      guardianEmail: guardianEmail.trim(),
      guardianRelationship,
      residentialAddress: residentialAddress.trim(),
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      boardingStatus,
      nemisUpi: nemisUpi.trim(),
      emergencyContact: emergencyContact.trim(),
      kcpeMarks: kcpeMarks ? Number(kcpeMarks) : undefined,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Student Admission &amp; Enrollment
              </h2>
              <p className="text-[11px] text-neutral-500">
                Register pupil into Nairobi Hillview Academy master roll
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Section 1: Student Demographics */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[10px]">
              1. Student Academic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Full Name of Student *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Victor Kibet Kipkemoi"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Admission Number (Auto-Generated)
                </label>
                <input
                  type="text"
                  required
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 font-mono border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Class &amp; Stream Assignment *
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.stream})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Boarding / Scholar Type
                </label>
                <select
                  value={boardingStatus}
                  onChange={(e) => setBoardingStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="Day Scholar">Day Scholar</option>
                  <option value="Boarder">Boarder</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  NEMIS UPI Identifier
                </label>
                <input
                  type="text"
                  value={nemisUpi}
                  onChange={(e) => setNemisUpi(e.target.value)}
                  placeholder="UPI-1029381-K"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  KCPE / Primary Assessment Marks (out of 500)
                </label>
                <input
                  type="number"
                  max={500}
                  value={kcpeMarks || ''}
                  onChange={(e) => setKcpeMarks(Number(e.target.value))}
                  placeholder="e.g. 395"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800" />

          {/* Section 2: Guardian Information */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[10px]">
              2. Parent / Guardian Particulars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Dr. Jane W. Kipkemoi"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Guardian Relationship
                </label>
                <input
                  type="text"
                  value={guardianRelationship}
                  onChange={(e) => setGuardianRelationship(e.target.value)}
                  placeholder="Father / Mother / Sponsor"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Phone Number (for SMS Circulars) *
                </label>
                <input
                  type="text"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+254 722 000 000"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Guardian Email
                </label>
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="guardian@example.co.ke"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Residential Estate / Address
                </label>
                <input
                  type="text"
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value)}
                  placeholder="e.g. Karen Triangle, Nairobi"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Complete Admission</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
