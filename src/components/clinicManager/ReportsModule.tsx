import React, { useState } from 'react';
import {
  Patient,
  Appointment,
  ConsultationRecord,
  Invoice,
  MedicalService,
  StaffMember,
  ClinicProfile,
} from '../../types/clinicManager';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  FileCheck,
} from 'lucide-react';

interface ReportsModuleProps {
  clinic: ClinicProfile;
  patients: Patient[];
  appointments: Appointment[];
  consultations: ConsultationRecord[];
  invoices: Invoice[];
  services: MedicalService[];
  staff: StaffMember[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  clinic,
  patients,
  appointments,
  consultations,
  invoices,
  services,
  staff,
}) => {
  const [reportType, setReportType] = useState<'financial' | 'clinical' | 'attendance' | 'debtors'>('financial');

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmountKes, 0);
  const totalCollected = invoices.reduce((sum, i) => sum + i.amountPaidKes, 0);
  const totalOutstanding = invoices.reduce((sum, i) => sum + i.balanceKes, 0);

  // Payment Breakdown
  const mpesaTotal = invoices
    .filter((i) => i.paymentMethod === 'M-Pesa')
    .reduce((s, i) => s + i.amountPaidKes, 0);
  const cashTotal = invoices
    .filter((i) => i.paymentMethod === 'Cash')
    .reduce((s, i) => s + i.amountPaidKes, 0);
  const insuranceTotal = invoices
    .filter((i) => i.paymentMethod === 'SHA / NHIF' || i.paymentMethod === 'Private Insurance')
    .reduce((s, i) => s + i.amountPaidKes, 0);

  // Debtor Patients
  const debtorInvoices = invoices.filter((i) => i.balanceKes > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <span>Clinic Operational &amp; Financial Analytics</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Certified accounting audits, patient throughput statistics, and physician productivity reports
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Audit Report</span>
        </button>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'financial', label: 'Revenue & Payment Channels' },
          { id: 'clinical', label: 'Clinical Encounters & Services' },
          { id: 'attendance', label: 'Doctor Consultations & Staff Roster' },
          { id: 'debtors', label: 'Aged Receivables & Debtors' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
              reportType === tab.id
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                : 'bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FINANCIAL REPORT VIEW */}
      {reportType === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Total Revenue Invoiced</span>
              <div className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1">
                KES {totalInvoiced.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-500 block mt-0.5">100% Billing volume</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase block font-semibold">Collected Cashflow</span>
              <div className="text-xl font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400 mt-1">
                KES {totalCollected.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-500 block mt-0.5">
                {totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0}% Collection recovery rate
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase block font-semibold">Outstanding Balance</span>
              <div className="text-xl font-bold font-['Poppins'] text-amber-600 dark:text-amber-400 mt-1">
                KES {totalOutstanding.toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-500 block mt-0.5">Insurance copays &amp; delayed claims</span>
            </div>
          </div>

          {/* Payment Channels Matrix */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Payment Channels Distribution
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>M-Pesa Collections (Paybill {clinic.mpesaPaybill})</span>
                  <span className="font-mono font-bold">KES {mpesaTotal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${totalCollected > 0 ? (mpesaTotal / totalCollected) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Cash Payments</span>
                  <span className="font-mono font-bold">KES {cashTotal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full rounded-full"
                    style={{ width: `${totalCollected > 0 ? (cashTotal / totalCollected) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>SHA / NHIF &amp; Private Insurance Pre-Auth</span>
                  <span className="font-mono font-bold">KES {insuranceTotal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${totalCollected > 0 ? (insuranceTotal / totalCollected) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLINICAL REPORT VIEW */}
      {reportType === 'clinical' && (
        <div className="space-y-6 text-xs">
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Most Utilized Clinical Services &amp; Tariffs
            </h3>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {services.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                      {s.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {s.code} &middot; {s.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-red-600 dark:text-red-400 block">
                      KES {s.priceKes.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-400">{s.turnaroundTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE & STAFF REPORT */}
      {reportType === 'attendance' && (
        <div className="space-y-6 text-xs">
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Physician Consultation Activity &amp; Roster Compliance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Practitioner</th>
                    <th className="py-2.5 px-3">Role &amp; Department</th>
                    <th className="py-2.5 px-3">Total Consultations</th>
                    <th className="py-2.5 px-3">Shift Hours</th>
                    <th className="py-2.5 px-3 text-right">Duty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {staff.map((st) => (
                    <tr key={st.id}>
                      <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                        {st.fullName}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-500">
                        {st.role} &middot; {st.department}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">
                        {st.totalConsultationsCompleted}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-500">
                        {st.shiftHours}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.onDuty
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {st.onDuty ? 'On Duty' : 'Off Duty'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DEBTORS REPORT */}
      {reportType === 'debtors' && (
        <div className="space-y-6 text-xs">
          <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Outstanding Debtors Ledger (Unsettled Patient Invoices)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Patient Name</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Total (KES)</th>
                    <th className="py-2.5 px-3">Paid (KES)</th>
                    <th className="py-2.5 px-3 text-right">Outstanding (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {debtorInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-red-600">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                        {inv.patientName} ({inv.patientNumber})
                      </td>
                      <td className="py-2.5 px-3 text-neutral-500">{inv.date}</td>
                      <td className="py-2.5 px-3 font-mono">KES {inv.totalAmountKes.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-600">KES {inv.amountPaidKes.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600 text-right">
                        KES {inv.balanceKes.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
