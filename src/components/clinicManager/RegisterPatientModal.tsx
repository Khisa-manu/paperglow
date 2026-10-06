import React, { useState } from 'react';
import { Patient } from '../../types/clinicManager';
import { UserPlus, X } from 'lucide-react';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterPatient: (patient: Omit<Patient, 'id' | 'totalVisits' | 'outstandingBalanceKes'>) => void;
}

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({
  isOpen,
  onClose,
  onRegisterPatient,
}) => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [dateOfBirth, setDateOfBirth] = useState('1995-05-12');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [residentialArea, setResidentialArea] = useState('Kilimani, Nairobi');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+254 7');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('Spouse');
  const [bloodGroup, setBloodGroup] = useState<Patient['bloodGroup']>('O+');
  const [allergiesStr, setAllergiesStr] = useState('None Reported');
  const [chronicConditionsStr, setChronicConditionsStr] = useState('');
  const [paymentModePreference, setPaymentModePreference] = useState<Patient['paymentModePreference']>('Cash / M-Pesa');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    // Calculate approximate age
    const birthYear = new Date(dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = Math.max(1, currentYear - birthYear);

    const generatedNumber = `CLN-2026-0${Math.floor(500 + Math.random() * 499)}`;

    onRegisterPatient({
      patientNumber: generatedNumber,
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      age,
      phone: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      nationalId: nationalId.trim() || 'Pending verification',
      residentialArea: residentialArea.trim(),
      emergencyContactName: emergencyContactName.trim() || 'Not specified',
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyContactRelation,
      bloodGroup,
      allergies: allergiesStr.split(',').map((s) => s.trim()).filter(Boolean),
      chronicConditions: chronicConditionsStr.split(',').map((s) => s.trim()).filter(Boolean),
      paymentModePreference,
      insuranceProvider: insuranceProvider.trim() || undefined,
      insurancePolicyNumber: insurancePolicyNumber.trim() || undefined,
      dateRegistered: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#11141a] rounded-2xl max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto text-xs"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Register New Outpatient
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Samuel Kipchumba Tanui"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Mobile Phone (M-Pesa) *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">National ID / Passport</label>
            <input
              type="text"
              placeholder="e.g. 29401829"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Residential Estate / Area</label>
            <input
              type="text"
              placeholder="e.g. Kileleshwa, Nairobi"
              value={residentialArea}
              onChange={(e) => setResidentialArea(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold text-red-600"
            >
              <option value="O+">O Positive (O+)</option>
              <option value="A+">A Positive (A+)</option>
              <option value="B+">B Positive (B+)</option>
              <option value="AB+">AB Positive (AB+)</option>
              <option value="O-">O Negative (O-)</option>
              <option value="A-">A Negative (A-)</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Known Drug &amp; Food Allergies</label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Sulfa, Aspirin (separated by commas)"
              value={allergiesStr}
              onChange={(e) => setAllergiesStr(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Pre-existing Chronic Conditions</label>
            <input
              type="text"
              placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes"
              value={chronicConditionsStr}
              onChange={(e) => setChronicConditionsStr(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Payment Method</label>
            <select
              value={paymentModePreference}
              onChange={(e) => setPaymentModePreference(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            >
              <option value="Cash / M-Pesa">Cash / M-Pesa</option>
              <option value="SHA / NHIF">SHA / Social Health Authority</option>
              <option value="Private Insurance">Private Medical Insurance</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Insurance Scheme &amp; Policy No.</label>
            <input
              type="text"
              placeholder="e.g. Jubilee / JUB-99182"
              value={insurancePolicyNumber}
              onChange={(e) => setInsurancePolicyNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
          >
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
};
