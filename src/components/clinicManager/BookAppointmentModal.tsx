import React, { useState } from 'react';
import {
  Appointment,
  Patient,
  StaffMember,
  MedicalService,
  AppointmentType,
} from '../../types/clinicManager';
import { CalendarDays, X } from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  staff: StaffMember[];
  services: MedicalService[];
  initialPatientId?: string;
  onBookAppointment: (appointment: Omit<Appointment, 'id' | 'appointmentNumber' | 'reminderSent'>) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  patients,
  staff,
  services,
  initialPatientId,
  onBookAppointment,
}) => {
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.id || '');
  const [practitionerId, setPractitionerId] = useState(staff[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [date, setDate] = useState('2026-10-06');
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [type, setType] = useState<AppointmentType>('Consultation');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const timeSlots = [
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === patientId) || patients[0];
    const selPractitioner = staff.find((s) => s.id === practitionerId) || staff[0];
    const selService = services.find((s) => s.id === serviceId) || services[0];

    onBookAppointment({
      patientId: selPatient.id,
      patientName: selPatient.fullName,
      patientNumber: selPatient.patientNumber,
      patientPhone: selPatient.phone,
      practitionerId: selPractitioner.id,
      practitionerName: selPractitioner.fullName,
      serviceId: selService.id,
      serviceName: selService.name,
      date,
      timeSlot,
      type,
      status: 'scheduled',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#11141a] rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl text-xs max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Schedule Clinic Appointment
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

        <div className="space-y-3">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.patientNumber} — {p.fullName} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Doctor / Practitioner *
            </label>
            <select
              value={practitionerId}
              onChange={(e) => setPractitionerId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-medium"
              required
            >
              {staff
                .filter((s) => s.role.includes('Doctor') || s.role.includes('Clinical'))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.consultingRoom})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Clinical Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            >
              {services.map((srv) => (
                <option key={srv.id} value={srv.id}>
                  {srv.name} (KES {srv.priceKes.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Visit Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            >
              <option value="Consultation">New Consultation</option>
              <option value="Follow-up">Follow-up Review</option>
              <option value="Vaccination">Vaccination / Immunization</option>
              <option value="Antenatal">Antenatal / Maternity Care</option>
              <option value="Emergency">Urgent Clinical Visit</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Clinical Symptoms / Chief Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Follow-up for chest tightness and asthma review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
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
            Confirm Appointment
          </button>
        </div>
      </form>
    </div>
  );
};
