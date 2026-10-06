import React, { useState } from 'react';
import { QueueItem, VitalSigns } from '../../types/clinicManager';
import { Activity, X } from 'lucide-react';

interface RecordVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  queueItem: QueueItem | null;
  onSaveVitals: (queueId: string, vitals: VitalSigns) => void;
}

export const RecordVitalsModal: React.FC<RecordVitalsModalProps> = ({
  isOpen,
  onClose,
  queueItem,
  onSaveVitals,
}) => {
  const [bpSystolic, setBpSystolic] = useState(120);
  const [bpDiastolic, setBpDiastolic] = useState(80);
  const [pulseRate, setPulseRate] = useState(72);
  const [temperatureCelsius, setTemperatureCelsius] = useState(36.8);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [oxygenSaturationSpO2, setOxygenSaturationSpO2] = useState(98);
  const [weightKg, setWeightKg] = useState(65);
  const [heightCm, setHeightCm] = useState(170);

  if (!isOpen || !queueItem) return null;

  const bmi = heightCm > 0 ? parseFloat((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vitalsData: VitalSigns = {
      bpSystolic,
      bpDiastolic,
      pulseRate,
      temperatureCelsius,
      respiratoryRate,
      oxygenSaturationSpO2,
      weightKg,
      heightCm,
      bmi,
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: 'Nurse Grace Wambui (Triage)',
    };

    onSaveVitals(queueItem.id, vitalsData);
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
            <Activity className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                Log Nurse Triage Vitals
              </h3>
              <p className="text-[11px] text-neutral-500">
                Patient: <strong>{queueItem.patientName}</strong> ({queueItem.patientNumber})
              </p>
            </div>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Blood Pressure (Systolic / Diastolic)
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-center font-bold"
                  placeholder="120"
                  required
                />
                <span>/</span>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-center font-bold"
                  placeholder="80"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Pulse Rate (bpm)
              </label>
              <input
                type="number"
                value={pulseRate}
                onChange={(e) => setPulseRate(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Temperature (&deg;C)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Oxygen Saturation SpO2 (%)
              </label>
              <input
                type="number"
                value={oxygenSaturationSpO2}
                onChange={(e) => setOxygenSaturationSpO2(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Calculated BMI
              </label>
              <div className="px-2 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 font-mono font-bold text-center">
                {bmi}
              </div>
            </div>
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
            Save Vitals &amp; Send to Doctor
          </button>
        </div>
      </form>
    </div>
  );
};
