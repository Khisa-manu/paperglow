import React, { useState } from 'react';
import { QueueItem, Patient, StaffMember, QueueStage } from '../../types/clinicManager';
import {
  Clock,
  UserCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  UserPlus,
  Stethoscope,
  Receipt,
} from 'lucide-react';

interface QueueModuleProps {
  queue: QueueItem[];
  patients: Patient[];
  staff: StaffMember[];
  onCheckInWalkIn: (patientId: string, practitionerId: string, priority: 'Normal' | 'Urgent' | 'Emergency') => void;
  onAdvanceQueueStage: (queueId: string) => void;
  onRecordVitalsForQueueItem: (queueItem: QueueItem) => void;
  onDischargeAndBill: (queueItem: QueueItem) => void;
}

export const QueueModule: React.FC<QueueModuleProps> = ({
  queue,
  patients,
  staff,
  onCheckInWalkIn,
  onAdvanceQueueStage,
  onRecordVitalsForQueueItem,
  onDischargeAndBill,
}) => {
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedPractitionerId, setSelectedPractitionerId] = useState(staff[0]?.id || '');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');

  const activeDoctors = staff.filter((s) => s.role.includes('Doctor') || s.role.includes('Clinical Officer'));

  const triageList = queue.filter((q) => q.stage === 'triage');
  const waitingList = queue.filter((q) => q.stage === 'waiting');
  const inConsultList = queue.filter((q) => q.stage === 'in_consultation');
  const billingList = queue.filter((q) => q.stage === 'ready_for_billing');

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedPractitionerId) return;
    onCheckInWalkIn(selectedPatientId, selectedPractitionerId, priority);
    setIsCheckInModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-600" />
            <span>Reception &amp; Live Triage Queue</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time outpatient flow management &middot; Check-in &rarr; Nurse Triage &rarr; Consultation &rarr; Billing &amp; Discharge
          </p>
        </div>

        <button
          onClick={() => setIsCheckInModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Check-in Patient</span>
        </button>
      </div>

      {/* 4 Flow Stage Summary Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Stage 1: Triage */}
        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 shadow-2xs">
          <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 font-semibold mb-1">
            <span>1. Nurse Triage / Vitals</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-blue-900 dark:text-blue-200 tabular-nums">
            {triageList.length}
          </div>
          <span className="text-[10px] text-blue-700/80 dark:text-blue-400 block mt-0.5">
            Awaiting vital signs logging
          </span>
        </div>

        {/* Stage 2: Waiting for Doctor */}
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 font-semibold mb-1">
            <span>2. Waiting for Doctor</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-amber-900 dark:text-amber-200 tabular-nums">
            {waitingList.length}
          </div>
          <span className="text-[10px] text-amber-700/80 dark:text-amber-400 block mt-0.5">
            Triaged &middot; In waiting bay
          </span>
        </div>

        {/* Stage 3: In Consultation */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
            <span>3. In Consultation</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-emerald-900 dark:text-emerald-200 tabular-nums">
            {inConsultList.length}
          </div>
          <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 block mt-0.5">
            Physician room active
          </span>
        </div>

        {/* Stage 4: Billing & Discharge */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
            <span>4. Ready for Billing</span>
            <Receipt className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <div className="text-2xl font-black font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
            {billingList.length}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">
            Prescription &amp; cashier handoff
          </span>
        </div>
      </div>

      {/* Main Active Queue Table */}
      <div className="rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <span>Active Outpatients in Facility ({queue.length})</span>
          </h3>
          <span className="text-xs text-neutral-500">
            Average facility turnaround time: 38 mins
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Queue #</th>
                <th className="py-3 px-4 font-semibold">Patient Name &amp; No.</th>
                <th className="py-3 px-4 font-semibold">Arrival &amp; Wait</th>
                <th className="py-3 px-4 font-semibold">Current Stage</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Assigned Doctor</th>
                <th className="py-3 px-4 font-semibold text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No active patients in queue. Click &quot;Check-in Patient&quot; to queue an arrival.
                  </td>
                </tr>
              ) : (
                queue.map((q) => (
                  <tr key={q.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40">
                    <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                      Q-{q.queueNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                        {q.patientName}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {q.patientNumber}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span>{q.arrivalTime}</span>
                      <span className="block text-[11px] font-mono text-neutral-500">
                        Wait: {q.waitTimeMinutes} mins
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.stage === 'in_consultation'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : q.stage === 'waiting'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : q.stage === 'ready_for_billing'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {q.stage.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          q.priority === 'Emergency'
                            ? 'text-red-600'
                            : q.priority === 'Urgent'
                            ? 'text-amber-600'
                            : 'text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {q.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100 block">
                        {q.assignedPractitionerName}
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        {q.consultingRoom}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {q.stage === 'triage' && (
                          <button
                            onClick={() => onRecordVitalsForQueueItem(q)}
                            className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Record Vitals
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (q.stage === 'ready_for_billing' || q.stage === 'in_consultation') {
                              onDischargeAndBill(q);
                            } else {
                              onAdvanceQueueStage(q.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          {q.stage === 'triage'
                            ? 'To Waiting'
                            : q.stage === 'waiting'
                            ? 'Call to Doctor'
                            : q.stage === 'in_consultation'
                            ? 'To Billing'
                            : 'Complete & Bill'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check-In Modal */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#11141a] rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Check In Patient to Queue
            </h3>
            <form onSubmit={handleCheckInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-semibold"
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
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Assign Doctor / Practitioner
                </label>
                <select
                  value={selectedPractitionerId}
                  onChange={(e) => setSelectedPractitionerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-semibold"
                  required
                >
                  {activeDoctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.consultingRoom})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Triage Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal', 'Urgent', 'Emergency'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                        priority === p
                          ? p === 'Emergency'
                            ? 'bg-red-600 text-white border-red-600'
                            : p === 'Urgent'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                >
                  Check In Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
