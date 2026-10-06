import React from 'react';
import {
  Patient,
  ConsultationRecord,
  Invoice,
  Appointment,
} from '../../types/clinicManager';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Calendar,
  CreditCard,
  ClipboardList,
  AlertTriangle,
  X,
  Stethoscope,
  Clock,
} from 'lucide-react';

interface PatientProfileModalProps {
  patient: Patient | null;
  consultations: ConsultationRecord[];
  invoices: Invoice[];
  appointments: Appointment[];
  onClose: () => void;
  onBookAppointment: (patient: Patient) => void;
  onCheckInToQueue: (patient: Patient) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  patient,
  consultations,
  invoices,
  appointments,
  onClose,
  onBookAppointment,
  onCheckInToQueue,
}) => {
  if (!patient) return null;

  const patientConsultations = consultations.filter((c) => c.patientId === patient.id);
  const patientInvoices = invoices.filter((i) => i.patientId === patient.id);
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#11141a] rounded-2xl max-w-3xl w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center text-xl font-bold font-['Poppins'] shadow-xs">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  {patient.fullName}
                </h2>
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                  {patient.patientNumber}
                </span>
              </div>
              <p className="text-neutral-500 text-[11px]">
                {patient.gender} &middot; {patient.age} years old &middot; Registered on {patient.dateRegistered}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onCheckInToQueue(patient);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-100 cursor-pointer"
            >
              Check Into Queue
            </button>
            <button
              onClick={() => {
                onBookAppointment(patient);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
            >
              Book Visit
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Overview Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Contact &amp; ID</span>
            <div className="font-bold text-neutral-900 dark:text-neutral-100">{patient.phone}</div>
            <div className="text-neutral-500">{patient.email}</div>
            <div className="text-[10px] text-neutral-400 font-mono">ID: {patient.nationalId}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Emergency Contact</span>
            <div className="font-bold text-neutral-900 dark:text-neutral-100">{patient.emergencyContactName}</div>
            <div className="text-neutral-500">{patient.emergencyContactPhone}</div>
            <div className="text-[10px] text-neutral-400">Relation: {patient.emergencyContactRelation}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Financial &amp; Balance</span>
            <div className="font-bold text-neutral-900 dark:text-neutral-100">{patient.paymentModePreference}</div>
            {patient.insurancePolicyNumber && (
              <div className="text-[10px] text-neutral-500 font-mono">Policy: {patient.insurancePolicyNumber}</div>
            )}
            <div className="font-mono font-bold text-amber-600">
              Outstanding: KES {patient.outstandingBalanceKes.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Clinical Highlights: Blood group, Allergies & Chronic Conditions */}
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20 space-y-2">
          <span className="font-bold text-red-900 dark:text-red-300 block uppercase tracking-wider text-[10px]">
            Clinical Alert Summary
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-neutral-500 text-[10px] block">Blood Group:</span>
              <span className="font-bold text-red-700 dark:text-red-400 text-sm">{patient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block">Known Drug Allergies:</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {patient.allergies.join(', ') || 'None Reported'}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block">Chronic Conditions:</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {patient.chronicConditions.join(', ') || 'None Recorded'}
              </span>
            </div>
          </div>
        </div>

        {/* Past Consultations */}
        <div className="space-y-3">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-1.5 font-['Poppins']">
            <ClipboardList className="w-4 h-4 text-red-600" />
            <span>Consultation &amp; Visit History ({patientConsultations.length})</span>
          </h4>

          {patientConsultations.length === 0 ? (
            <p className="text-neutral-400 italic">No previous consultations recorded for this patient.</p>
          ) : (
            <div className="space-y-2.5">
              {patientConsultations.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      {c.clinicalImpressionDiagnosis}
                    </span>
                    <span className="text-neutral-400 font-mono text-[10px]">{c.date}</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                    <strong>Chief Complaint:</strong> {c.chiefComplaint}
                  </p>
                  <div className="text-[10px] text-neutral-500 flex justify-between pt-1">
                    <span>Doctor: {c.practitionerName}</span>
                    <span>BP: {c.vitals.bpSystolic}/{c.vitals.bpDiastolic} mmHg &middot; Temp: {c.vitals.temperatureCelsius}&deg;C</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices and Billing Records */}
        <div className="space-y-3">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-1.5 font-['Poppins']">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Billing &amp; Invoice Ledger ({patientInvoices.length})</span>
          </h4>

          {patientInvoices.length === 0 ? (
            <p className="text-neutral-400 italic">No invoices issued for this patient.</p>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border rounded-lg overflow-hidden">
              {patientInvoices.map((inv) => (
                <div key={inv.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-red-600 block">{inv.invoiceNumber}</span>
                    <span className="text-neutral-500 text-[10px]">{inv.date} &middot; {inv.items.map(i => i.description).join(', ')}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold block">KES {inv.totalAmountKes.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold uppercase ${inv.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {inv.status} (Balance: KES {inv.balanceKes.toLocaleString()})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
