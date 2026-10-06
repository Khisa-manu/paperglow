import React, { useState } from 'react';
import { ClinicProfile } from '../../types/clinicManager';
import {
  Settings,
  Building,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Bell,
  Stethoscope,
} from 'lucide-react';

interface SettingsModuleProps {
  clinic: ClinicProfile;
  onUpdateClinic: (updated: ClinicProfile) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  clinic,
  onUpdateClinic,
}) => {
  const [formData, setFormData] = useState<ClinicProfile>(clinic);
  const [newDepartment, setNewDepartment] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClinic(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) return;
    setFormData((prev) => ({
      ...prev,
      departments: [...prev.departments, newDepartment.trim()],
    }));
    setNewDepartment('');
  };

  const handleRemoveDepartment = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== idx),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-red-600" />
            <span>Clinic Configuration, Licensing &amp; Tariffs</span>
          </h2>
          <p className="text-xs text-neutral-500">
            KMPDC regulatory accreditation, consultation fees in KES, M-Pesa billing credentials and clinical departments
          </p>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Clinic settings and tariff configuration saved successfully.</span>
        </div>
      )}

      {/* 1. Facility Accreditation & Profile */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center space-x-2 font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] text-sm">
          <Building className="w-4 h-4 text-red-600" />
          <span>1. Healthcare Facility Profile &amp; Regulatory Licences</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Clinic Legal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              KMPDC Facility License No.
            </label>
            <input
              type="text"
              value={formData.kmpdcLicense}
              onChange={(e) => setFormData({ ...formData, kmpdcLicense: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold text-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              KRA PIN (Kenya Revenue Authority)
            </label>
            <input
              type="text"
              value={formData.kraPin}
              onChange={(e) => setFormData({ ...formData, kraPin: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Location Address
            </label>
            <input
              type="text"
              value={formData.locationAddress}
              onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Main Reception Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Emergency Hotline
            </label>
            <input
              type="text"
              value={formData.emergencyHotline}
              onChange={(e) => setFormData({ ...formData, emergencyHotline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-red-600 font-bold"
            />
          </div>
        </div>
      </div>

      {/* 2. Consultation Fees & M-Pesa Setup */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center space-x-2 font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] text-sm">
          <CreditCard className="w-4 h-4 text-red-600" />
          <span>2. Standard Consultation Tariffs &amp; M-Pesa Integration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              General Doctor Consultation (KES)
            </label>
            <input
              type="number"
              value={formData.defaultConsultationFeeKes}
              onChange={(e) => setFormData({ ...formData, defaultConsultationFeeKes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Specialist Consultation (KES)
            </label>
            <input
              type="number"
              value={formData.specialistConsultationFeeKes}
              onChange={(e) => setFormData({ ...formData, specialistConsultationFeeKes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              M-Pesa Business Paybill No.
            </label>
            <input
              type="text"
              value={formData.mpesaPaybill}
              onChange={(e) => setFormData({ ...formData, mpesaPaybill: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold text-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Default Account Reference
            </label>
            <input
              type="text"
              value={formData.mpesaAccountNumber}
              onChange={(e) => setFormData({ ...formData, mpesaAccountNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Departments & Clinic Hours */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center space-x-2 font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] text-sm">
          <Clock className="w-4 h-4 text-red-600" />
          <span>3. Clinical Departments &amp; Working Hours</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Operating Clinic Hours Description
            </label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Active Outpatient Departments
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.departments.map((dept, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center space-x-1.5"
                >
                  <span>{dept}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDepartment(idx)}
                    className="text-neutral-400 hover:text-red-600"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="New department name..."
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
              <button
                type="button"
                onClick={handleAddDepartment}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
