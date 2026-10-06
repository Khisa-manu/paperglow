import React, { useState } from 'react';
import {
  ConsultationRecord,
  Patient,
  StaffMember,
  PrescriptionItem,
  VitalSigns,
  ClinicProfile,
} from '../../types/clinicManager';
import {
  ClipboardList,
  Plus,
  Search,
  Activity,
  User,
  Calendar,
  Clock,
  Pill,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
} from 'lucide-react';

interface ConsultationsModuleProps {
  consultations: ConsultationRecord[];
  patients: Patient[];
  staff: StaffMember[];
  clinic: ClinicProfile;
  onAddConsultation: (record: Omit<ConsultationRecord, 'id' | 'visitNumber' | 'billed'>) => void;
  onOpenCreateInvoiceForConsultation: (consultation: ConsultationRecord) => void;
}

export const ConsultationsModule: React.FC<ConsultationsModuleProps> = ({
  consultations,
  patients,
  staff,
  clinic,
  onAddConsultation,
  onOpenCreateInvoiceForConsultation,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(consultations[0] || null);
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for new consultation
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [practitionerId, setPractitionerId] = useState(staff[0]?.id || '');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState('');
  const [examinationFindings, setExaminationFindings] = useState('');
  const [clinicalImpressionDiagnosis, setClinicalImpressionDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Vitals
  const [bpSystolic, setBpSystolic] = useState(120);
  const [bpDiastolic, setBpDiastolic] = useState(80);
  const [pulseRate, setPulseRate] = useState(72);
  const [temperatureCelsius, setTemperatureCelsius] = useState(36.8);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [oxygenSaturationSpO2, setOxygenSaturationSpO2] = useState(98);
  const [weightKg, setWeightKg] = useState(65);
  const [heightCm, setHeightCm] = useState(170);

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      drugName: 'Paracetamol Tablets 500mg',
      dosage: '1000mg',
      frequency: 'Every 8 hours prn',
      durationDays: 3,
      instructions: 'Take after meals for pain/fever',
    },
  ]);
  const [newDrugName, setNewDrugName] = useState('');
  const [newDrugDosage, setNewDrugDosage] = useState('');
  const [newDrugFreq, setNewDrugFreq] = useState('');
  const [newDrugDuration, setNewDrugDuration] = useState(5);
  const [newDrugInstructions, setNewDrugInstructions] = useState('');

  // BMI Calculation
  const computedBmi = heightCm > 0 ? parseFloat((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)) : 0;

  const handleAddPrescriptionItem = () => {
    if (!newDrugName.trim()) return;
    setPrescriptions((prev) => [
      ...prev,
      {
        drugName: newDrugName.trim(),
        dosage: newDrugDosage.trim(),
        frequency: newDrugFreq.trim(),
        durationDays: newDrugDuration,
        instructions: newDrugInstructions.trim(),
      },
    ]);
    setNewDrugName('');
    setNewDrugDosage('');
    setNewDrugFreq('');
    setNewDrugInstructions('');
  };

  const handleRemovePrescription = (idx: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === patientId) || patients[0];
    const selPractitioner = staff.find((s) => s.id === practitionerId) || staff[0];

    const vitalsData: VitalSigns = {
      bpSystolic,
      bpDiastolic,
      pulseRate,
      temperatureCelsius,
      respiratoryRate,
      oxygenSaturationSpO2,
      weightKg,
      heightCm,
      bmi: computedBmi,
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: selPractitioner.fullName,
    };

    onAddConsultation({
      patientId: selPatient.id,
      patientName: selPatient.fullName,
      patientNumber: selPatient.patientNumber,
      patientAge: selPatient.age,
      patientGender: selPatient.gender,
      practitionerId: selPractitioner.id,
      practitionerName: selPractitioner.fullName,
      practitionerRole: selPractitioner.role,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint,
      historyOfPresentIllness,
      vitals: vitalsData,
      examinationFindings,
      clinicalImpressionDiagnosis,
      treatmentPlan,
      prescriptions,
      labRequests: [],
      followUpDate: followUpDate || undefined,
      clinicalNotes,
      consultationFeeKes: clinic.defaultConsultationFeeKes,
    });

    setIsNewConsultationOpen(false);
    setChiefComplaint('');
    setHistoryOfPresentIllness('');
    setExaminationFindings('');
    setClinicalImpressionDiagnosis('');
    setTreatmentPlan('');
    setClinicalNotes('');
  };

  const filteredConsultations = consultations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.patientName.toLowerCase().includes(q) ||
      c.patientNumber.toLowerCase().includes(q) ||
      c.clinicalImpressionDiagnosis.toLowerCase().includes(q) ||
      c.practitionerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-red-600" />
            <span>Consultations &amp; Clinical Records (EHR)</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Outpatient encounters, clinical notes, vital signs, prescriptions, and follow-up schedules
          </p>
        </div>

        <button
          onClick={() => setIsNewConsultationOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Consultation</span>
        </button>
      </div>

      {/* EHR Ethical Compliance Banner */}
      <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
        <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <strong className="text-neutral-900 dark:text-neutral-100">Clinical Records Notice: </strong>
          This is an administrative medical-record archiving system. Diagnoses, clinical impressions, and treatment plans are recorded directly by authorized healthcare practitioners. The system does not generate automated diagnoses or medical advice.
        </div>
      </div>

      {/* Split Layout: Consultation List & Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Search & Encounter List (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search encounter by patient, diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500 shadow-2xs"
            />
          </div>

          <div className="space-y-3">
            {filteredConsultations.map((c) => {
              const isSelected = selectedRecord?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedRecord(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'border-red-600 bg-red-50/20 dark:bg-red-950/20 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141a] hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] block text-sm">
                        {c.patientName}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {c.patientNumber} &middot; {c.visitNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 tabular-nums">
                      {c.date}
                    </span>
                  </div>

                  <div className="text-neutral-800 dark:text-neutral-200">
                    <span className="text-neutral-500 font-medium">Impression: </span>
                    <span className="font-semibold text-red-700 dark:text-red-400">
                      {c.clinicalImpressionDiagnosis}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    <span>{c.practitionerName}</span>
                    <span>BP: {c.vitals.bpSystolic}/{c.vitals.bpDiastolic} mmHg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Encounter Details Dossier (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRecord ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6 text-xs">
              {/* Encounter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-red-600 text-xs">
                      {selectedRecord.visitNumber}
                    </span>
                    <span className="text-neutral-400">&middot;</span>
                    <span className="text-neutral-500">
                      {selectedRecord.date} at {selectedRecord.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                    {selectedRecord.patientName}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Patient No: {selectedRecord.patientNumber} &middot; {selectedRecord.patientGender}, {selectedRecord.patientAge} years
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenCreateInvoiceForConsultation(selectedRecord)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-red-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Generate Invoice
                  </button>
                </div>
              </div>

              {/* Vital Signs Row */}
              <div className="space-y-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[10px] block">
                  Vital Signs &amp; Anthropometry
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Blood Pressure</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                      {selectedRecord.vitals.bpSystolic}/{selectedRecord.vitals.bpDiastolic}
                    </span>
                    <span className="text-[9px] text-neutral-400 block">mmHg</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Pulse Rate</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                      {selectedRecord.vitals.pulseRate}
                    </span>
                    <span className="text-[9px] text-neutral-400 block">bpm</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">Temperature</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                      {selectedRecord.vitals.temperatureCelsius}&deg;C
                    </span>
                    <span className="text-[9px] text-neutral-400 block">Axillary</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">SpO2 / BMI</span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                      {selectedRecord.vitals.oxygenSaturationSpO2}% / {selectedRecord.vitals.bmi}
                    </span>
                    <span className="text-[9px] text-neutral-400 block">
                      {selectedRecord.vitals.weightKg}kg &middot; {selectedRecord.vitals.heightCm}cm
                    </span>
                  </div>
                </div>
              </div>

              {/* Subjective & Objective Findings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                    Chief Complaint &amp; HPI:
                  </span>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {selectedRecord.chiefComplaint}
                  </p>
                  <p className="text-neutral-500 text-[11px] pt-1 border-t border-neutral-200 dark:border-neutral-800">
                    {selectedRecord.historyOfPresentIllness}
                  </p>
                </div>

                <div className="space-y-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                    Physical Examination Findings:
                  </span>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {selectedRecord.examinationFindings}
                  </p>
                </div>
              </div>

              {/* Clinical Impression & Diagnosis */}
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-1">
                <span className="font-bold text-red-900 dark:text-red-300 block text-xs">
                  Clinical Impression / Diagnosis:
                </span>
                <p className="text-sm font-extrabold text-red-700 dark:text-red-400 font-['Poppins']">
                  {selectedRecord.clinicalImpressionDiagnosis}
                </p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Plan: {selectedRecord.treatmentPlan}
                </p>
              </div>

              {/* Prescription Items */}
              <div className="space-y-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[10px] block">
                  Medications &amp; Prescriptions ({selectedRecord.prescriptions.length})
                </span>
                <div className="space-y-2">
                  {selectedRecord.prescriptions.map((rx, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-start justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          {rx.drugName} &middot; {rx.dosage}
                        </span>
                        <span className="text-[11px] text-neutral-600 dark:text-neutral-400 block">
                          Frequency: {rx.frequency} &middot; Duration: {rx.durationDays} days
                        </span>
                        <span className="text-[10px] text-neutral-500 block italic">
                          Instructions: {rx.instructions}
                        </span>
                      </div>
                      <Pill className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Sign-off */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                <span>Attending Practitioner: <strong>{selectedRecord.practitionerName}</strong></span>
                <span>Follow-up: <strong>{selectedRecord.followUpDate || 'As needed'}</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-400 bg-white dark:bg-[#11141a] rounded-2xl border border-neutral-200 dark:border-neutral-800">
              Select an encounter to view complete clinical notes.
            </div>
          )}
        </div>
      </div>

      {/* New Consultation Modal */}
      {isNewConsultationOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveConsultation}
            className="bg-white dark:bg-[#11141a] rounded-2xl max-w-3xl w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Record New Clinical Encounter
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Log patient vitals, subjective history, physical findings, diagnosis and prescriptions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewConsultationOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Patient & Doctor Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Select Patient *
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-semibold"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.patientNumber} — {p.fullName} ({p.age}y, {p.gender})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Attending Practitioner *
                </label>
                <select
                  value={practitionerId}
                  onChange={(e) => setPractitionerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-semibold"
                  required
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                Vital Signs &amp; Measurements:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-500 text-[10px] mb-0.5">BP Systolic / Diastolic</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-center font-mono"
                      placeholder="120"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-center font-mono"
                      placeholder="80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-0.5">Pulse Rate (bpm)</label>
                  <input
                    type="number"
                    value={pulseRate}
                    onChange={(e) => setPulseRate(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-0.5">Temperature (&deg;C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperatureCelsius}
                    onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-0.5">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={oxygenSaturationSpO2}
                    onChange={(e) => setOxygenSaturationSpO2(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-0.5">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-0.5">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 text-[10px] mb-0.5">Computed BMI</label>
                  <div className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 font-mono font-bold">
                    {computedBmi} kg/m&sup2;
                  </div>
                </div>
              </div>
            </div>

            {/* Subjective History */}
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Chief Complaint *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Throbbing frontal headache and photophobia for 2 days"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  History of Present Illness (HPI)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed patient narration, onset, duration, aggravating/relieving factors..."
                  value={historyOfPresentIllness}
                  onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Physical Examination Findings
                </label>
                <textarea
                  rows={2}
                  placeholder="General condition, chest sounds, abdominal palpation, throat examination..."
                  value={examinationFindings}
                  onChange={(e) => setExaminationFindings(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

            {/* Diagnosis / Impression & Plan */}
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20 space-y-3">
              <div>
                <label className="block text-red-900 dark:text-red-300 font-bold mb-1">
                  Practitioner Clinical Impression / Diagnosis *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acute Bacterial Pharyngitis / Essential Hypertension"
                  value={clinicalImpressionDiagnosis}
                  onChange={(e) => setClinicalImpressionDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-neutral-900 font-semibold"
                  required
                />
                <span className="text-[10px] text-neutral-500 block mt-1">
                  * Clinical diagnosis is authored directly by the attending physician.
                </span>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Treatment Plan &amp; Management Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Non-pharmacological advice, lifestyle, hydration, rest..."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
            </div>

            {/* Prescriptions Generator */}
            <div className="space-y-3">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                Prescribe Medications:
              </span>
              <div className="space-y-2">
                {prescriptions.map((rx, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between"
                  >
                    <div>
                      <strong>{rx.drugName}</strong> — {rx.dosage} ({rx.frequency}, {rx.durationDays}d)
                      <span className="block text-[10px] text-neutral-500">{rx.instructions}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePrescription(idx)}
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Drug Name (e.g. Amoxicillin 500mg)"
                    value={newDrugName}
                    onChange={(e) => setNewDrugName(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 500mg 1 cap)"
                    value={newDrugDosage}
                    onChange={(e) => setNewDrugDosage(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g. 1 cap tid)"
                    value={newDrugFreq}
                    onChange={(e) => setNewDrugFreq(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Days (e.g. 5)"
                    value={newDrugDuration}
                    onChange={(e) => setNewDrugDuration(parseInt(e.target.value) || 1)}
                    className="w-24 px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                  <input
                    type="text"
                    placeholder="Instructions (e.g. Take after meals)"
                    value={newDrugInstructions}
                    onChange={(e) => setNewDrugInstructions(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrescriptionItem}
                    className="px-3 py-1.5 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold"
                  >
                    Add Rx
                  </button>
                </div>
              </div>
            </div>

            {/* Follow-up date */}
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                Scheduled Follow-up Date (Optional)
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsNewConsultationOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Save Encounter Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
