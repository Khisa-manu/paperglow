import React, { useState } from 'react';
import {
  ClinicDocument,
  Patient,
  ClinicProfile,
  DocumentType,
} from '../../types/clinicManager';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Search,
  Building,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  User,
} from 'lucide-react';

interface DocumentsModuleProps {
  documents: ClinicDocument[];
  patients: Patient[];
  clinic: ClinicProfile;
  onAddDocument: (doc: Omit<ClinicDocument, 'id' | 'documentNumber'>) => void;
}

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({
  documents,
  patients,
  clinic,
  onAddDocument,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Document Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [docType, setDocType] = useState<DocumentType>('sick_off');
  const [title, setTitle] = useState('Medical Certificate of Incapacity (Sick-Off)');
  const [practitionerName, setPractitionerName] = useState('Dr. Brenda Muthoni, MBChB');
  const [practitionerRole] = useState('Senior Physician (KMPDC A.8491)');
  const [diagnosisNotice, setDiagnosisNotice] = useState('Acute febrile illness under treatment');
  const [recommendedRestDays, setRecommendedRestDays] = useState(2);
  const [excusedStartDate, setExcusedStartDate] = useState('2026-10-06');
  const [excusedEndDate, setExcusedEndDate] = useState('2026-10-07');
  const [clinicalRemarks, setClinicalRemarks] = useState('Patient is unfit for normal occupational duties and is advised complete bed rest.');

  const selectedDocument = documents.find((d) => d.id === selectedDocId) || documents[0];

  const filteredDocuments = documents.filter((d) => {
    return typeFilter === 'all' || d.type === typeFilter;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocument = () => {
    if (!selectedDocument) return;
    const filename = `${clinic.name.replace(/\s+/g, '_')}_${selectedDocument.documentNumber}.html`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${selectedDocument.title} - ${selectedDocument.patientName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=DM+Sans:wght@400;500;700&display=swap');
    body { font-family: 'DM Sans', sans-serif; padding: 40px; background: #fff; color: #0f172a; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 2px solid #dc2626; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 800; color: #991b1b; text-transform: uppercase; }
    .sub { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .doc-type { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: #1e293b; margin: 20px 0 10px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0; }
    .body { font-size: 13px; line-height: 1.8; margin: 24px 0; }
    .footer { margin-top: 50px; display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 20px; }
    .sig { font-family: 'Brush Script MT', cursive; font-size: 24px; color: #991b1b; }
    @media print { button { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <button onclick="window.print()" style="background:#dc2626; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:bold; cursor:pointer; margin-bottom:20px;">Print / Save as PDF</button>
  <div class="header">
    <div class="title">${clinic.name}</div>
    <div class="sub">${clinic.locationAddress} &middot; KMPDC Licence: ${clinic.kmpdcLicense} &middot; Tel: ${clinic.phone}</div>
  </div>
  <div class="doc-type">${selectedDocument.title}</div>
  <div style="font-size:11px; font-family:monospace; color:#dc2626; font-weight:bold;">REF NO: ${selectedDocument.documentNumber} &middot; Date: ${selectedDocument.issuedDate}</div>
  
  <div class="grid">
    <div><strong>Patient Name:</strong> ${selectedDocument.patientName}</div>
    <div><strong>Patient Number:</strong> ${selectedDocument.patientNumber}</div>
  </div>

  <div class="body">
    ${selectedDocument.content.diagnosisNotice ? `<p><strong>Clinical Medical Notice:</strong> ${selectedDocument.content.diagnosisNotice}</p>` : ''}
    ${selectedDocument.content.recommendedRestDays ? `<p><strong>Recommended Excused Bed Rest:</strong> ${selectedDocument.content.recommendedRestDays} Consecutive Days (From ${selectedDocument.content.excusedStartDate} to ${selectedDocument.content.excusedEndDate})</p>` : ''}
    ${selectedDocument.content.referredFacility ? `<p><strong>Referred Facility:</strong> ${selectedDocument.content.referredFacility} (${selectedDocument.content.specialistType})</p><p><strong>Reason for Referral:</strong> ${selectedDocument.content.reasonForReferral}</p>` : ''}
    <p><strong>Physician Remarks:</strong> ${selectedDocument.content.clinicalRemarks || selectedDocument.summary}</p>
  </div>

  <div class="footer">
    <div>
      <div class="sig">Dr. Brenda Muthoni</div>
      <div style="font-weight:bold; font-size:12px;">${selectedDocument.practitionerName}</div>
      <div style="font-size:10px; color:#64748b;">${selectedDocument.practitionerRole}</div>
    </div>
    <div style="text-align:right;">
      <div style="border:1px dashed #94a3b8; width:120px; height:60px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#94a3b8; margin-left:auto;">
        CLINIC STAMP
      </div>
      <div style="font-size:9px; color:#64748b; margin-top:4px;">St. Jude Family Care Official Seal</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === patientId) || patients[0];

    onAddDocument({
      patientId: selPatient.id,
      patientName: selPatient.fullName,
      patientNumber: selPatient.patientNumber,
      type: docType,
      title,
      issuedDate: new Date().toISOString().split('T')[0],
      practitionerName,
      practitionerRole,
      summary: clinicalRemarks,
      content: {
        diagnosisNotice,
        recommendedRestDays,
        excusedStartDate,
        excusedEndDate,
        clinicalRemarks,
      },
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-red-600" />
            <span>Clinical Documentation, Sick-Offs &amp; Referrals</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Generate, preview, print, and download verified medical certificates, doctor referral letters and clinical forms
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Clinical Document</span>
          </button>
          <button
            onClick={handleDownloadDocument}
            className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a] text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Select Document & Filter */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto text-xs">
          <span className="font-semibold text-neutral-600 dark:text-neutral-400 shrink-0">
            Select Document:
          </span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold max-w-sm w-full"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.documentNumber} — {d.title} ({d.patientName})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs">
          {['all', 'sick_off', 'referral', 'medical_summary'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer capitalize ${
                typeFilter === t
                  ? 'bg-red-600 text-white font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Document Workspace Preview */}
      {selectedDocument && (
        <div className="flex justify-center p-4 sm:p-8 bg-neutral-100 dark:bg-[#0c0e12] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
          <div
            id="clinic-document-print"
            className="w-full max-w-2xl bg-white text-neutral-900 p-8 sm:p-12 rounded-xl shadow-xl border-4 border-neutral-300 space-y-6"
          >
            {/* Document Letterhead */}
            <div className="text-center border-b-2 border-red-700 pb-4 space-y-1">
              <div className="inline-flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm">
                  SJ
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold uppercase font-['Poppins'] text-red-800 tracking-tight">
                  {clinic.name}
                </h1>
              </div>
              <p className="text-[11px] text-neutral-600 font-medium">
                {clinic.locationAddress} &middot; Tel: {clinic.phone} &middot; Emergency: {clinic.emergencyHotline}
              </p>
              <div className="inline-block px-3 py-0.5 rounded-full bg-red-50 text-red-800 text-[10px] font-bold border border-red-200">
                Licenced by Kenya Medical Practitioners and Dentists Council: {clinic.kmpdcLicense}
              </div>
            </div>

            {/* Document Title & Reference Bar */}
            <div className="flex items-center justify-between text-xs pt-2">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Document Title</span>
                <h2 className="text-base font-bold font-['Poppins'] text-neutral-900">
                  {selectedDocument.title}
                </h2>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-red-700 block">{selectedDocument.documentNumber}</span>
                <span className="text-[11px] text-neutral-500">Date Issued: {selectedDocument.issuedDate}</span>
              </div>
            </div>

            {/* Patient Credentials Block */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">Patient Name:</span>
                <span className="font-bold block text-sm">{selectedDocument.patientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">Patient Hospital Number:</span>
                <span className="font-mono font-bold block">{selectedDocument.patientNumber}</span>
              </div>
            </div>

            {/* Document Body Content */}
            <div className="space-y-4 text-xs text-neutral-800 leading-relaxed py-2">
              {selectedDocument.content.diagnosisNotice && (
                <div>
                  <strong className="text-neutral-900 block mb-1">Clinical Evaluation Summary:</strong>
                  <p>{selectedDocument.content.diagnosisNotice}</p>
                </div>
              )}

              {selectedDocument.content.recommendedRestDays && (
                <div className="p-3 rounded-lg bg-red-50/50 border border-red-200 space-y-1">
                  <strong className="text-red-900 block font-bold">
                    Incapacity Certificate &amp; Excused Absence:
                  </strong>
                  <p>
                    This is to certify that the patient is unfit to carry out employment or academic duties and has been advised complete medical rest for a duration of{' '}
                    <strong>{selectedDocument.content.recommendedRestDays} consecutive days</strong>, commencing from{' '}
                    <strong>{selectedDocument.content.excusedStartDate}</strong> to{' '}
                    <strong>{selectedDocument.content.excusedEndDate}</strong>.
                  </p>
                </div>
              )}

              {selectedDocument.content.referredFacility && (
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200 space-y-1">
                  <strong className="text-blue-900 block font-bold">
                    Specialist Clinical Referral:
                  </strong>
                  <p>
                    Referred to: <strong>{selectedDocument.content.referredFacility}</strong> ({selectedDocument.content.specialistType})
                  </p>
                  <p>Reason: {selectedDocument.content.reasonForReferral}</p>
                </div>
              )}

              <div>
                <strong className="text-neutral-900 block mb-1">Attending Practitioner Remarks:</strong>
                <p>{selectedDocument.content.clinicalRemarks || selectedDocument.summary}</p>
              </div>
            </div>

            {/* Sign-off & Official Stamp */}
            <div className="pt-6 border-t-2 border-neutral-200 flex items-end justify-between text-xs">
              <div className="space-y-1">
                <div className="font-['Brush_Script_MT',cursive] text-2xl text-red-900 italic h-7 flex items-center">
                  Dr. Brenda Muthoni
                </div>
                <div className="border-t border-neutral-400 pt-1 w-48">
                  <span className="font-bold block text-neutral-900">{selectedDocument.practitionerName}</span>
                  <span className="text-[10px] text-neutral-500">{selectedDocument.practitionerRole}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="w-28 h-14 border border-dashed border-neutral-400 rounded flex items-center justify-center text-[10px] text-neutral-400 font-semibold ml-auto">
                  CLINIC SEAL / STAMP
                </div>
                <span className="text-[9px] text-neutral-400 block mt-1">Certified Outpatient Document</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Document Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white dark:bg-[#11141a] rounded-2xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl text-xs max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Issue Official Clinical Certificate / Document
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-semibold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.patientNumber} — {p.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => {
                      const t = e.target.value as DocumentType;
                      setDocType(t);
                      if (t === 'sick_off') setTitle('Medical Certificate of Incapacity (Sick-Off)');
                      else if (t === 'referral') setTitle('Clinical Referral Form to Specialist');
                      else setTitle('Comprehensive Medical Summary Report');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <option value="sick_off">Sick-off / Incapacity Certificate</option>
                    <option value="referral">Clinical Referral Form</option>
                    <option value="medical_summary">Medical Summary Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Rest Days (For Sick-Off)</label>
                  <input
                    type="number"
                    value={recommendedRestDays}
                    onChange={(e) => setRecommendedRestDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Clinical Evaluation Finding</label>
                <input
                  type="text"
                  value={diagnosisNotice}
                  onChange={(e) => setDiagnosisNotice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Physician Directions &amp; Remarks</label>
                <textarea
                  rows={3}
                  value={clinicalRemarks}
                  onChange={(e) => setClinicalRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
              >
                Generate Document
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
