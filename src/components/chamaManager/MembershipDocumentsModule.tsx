import React, { useState, useEffect } from 'react';
import { Member, GroupProfile } from '../../types/chamaManager';
import {
  Award,
  CreditCard,
  Printer,
  Download,
  RotateCw,
  Search,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Building,
  User,
  QrCode,
  FileCheck,
} from 'lucide-react';

interface MembershipDocumentsModuleProps {
  members: Member[];
  group: GroupProfile;
  initialMemberId?: string;
}

export const MembershipDocumentsModule: React.FC<MembershipDocumentsModuleProps> = ({
  members,
  group,
  initialMemberId,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialMemberId && members.some((m) => m.id === initialMemberId)
      ? initialMemberId
      : members[0]?.id || ''
  );
  const [docType, setDocType] = useState<'certificate' | 'id_card'>('certificate');
  const [certSerial, setCertSerial] = useState<number>(20260491);
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (initialMemberId && members.some((m) => m.id === initialMemberId)) {
      setSelectedMemberId(initialMemberId);
    }
  }, [initialMemberId, members]);

  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setCertSerial((prev) => prev + Math.floor(Math.random() * 50 + 1));
      setIssueDate(new Date().toISOString().split('T')[0]);
      setIsRegenerating(false);
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocument = () => {
    if (!selectedMember) return;
    const isCert = docType === 'certificate';
    const filename = isCert
      ? `${group.name.replace(/\s+/g, '_')}_Membership_Certificate_${selectedMember.membershipNumber}.html`
      : `${group.name.replace(/\s+/g, '_')}_Digital_ID_${selectedMember.membershipNumber}.html`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isCert ? 'Official Membership Certificate' : 'Digital Membership ID Card'} - ${selectedMember.fullName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;700&display=swap');
    * { box-sizing: border-box; }
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 30px;
      background: #f1f5f9;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .print-actions {
      margin-bottom: 24px;
      display: flex;
      gap: 12px;
    }
    .print-btn {
      background: #dc2626;
      color: #ffffff;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
    }
    .print-btn:hover { background: #b91c1c; }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .print-actions { display: none !important; }
      .cert-container, .id-card-container { box-shadow: none !important; border: 8px double #991b1b !important; }
    }
    /* Certificate Styles */
    .cert-container {
      width: 100%;
      max-width: 820px;
      background: #ffffff;
      padding: 50px 60px;
      border: 12px double #991b1b;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      position: relative;
      text-align: center;
    }
    .cert-title {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 900;
      color: #7f1d1d;
      margin: 10px 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cert-reg {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #475569;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .cert-badge {
      display: inline-block;
      padding: 5px 16px;
      border-radius: 9999px;
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .cert-body { margin: 30px 0; }
    .cert-witness { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; }
    .cert-member-name {
      font-family: 'Poppins', sans-serif;
      font-size: 32px;
      font-weight: 900;
      color: #0f172a;
      text-decoration: underline;
      text-decoration-color: #dc2626;
      text-underline-offset: 8px;
      margin: 14px 0;
    }
    .cert-text {
      font-size: 13px;
      line-height: 1.7;
      color: #334155;
      max-width: 620px;
      margin: 0 auto;
    }
    .cert-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 24px;
      text-align: left;
    }
    .cert-grid-item {
      background: #f8fafc;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }
    .cert-grid-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .cert-grid-val { font-size: 13px; font-weight: 800; color: #0f172a; font-family: monospace; }
    .cert-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #fee2e2;
    }
    .sig-box { width: 170px; text-align: center; }
    .sig-font { font-family: 'Brush Script MT', cursive, serif; font-size: 24px; color: #7f1d1d; font-style: italic; }
    .sig-line { border-top: 1px solid #94a3b8; padding-top: 4px; font-size: 11px; font-weight: 700; }
    .sig-role { font-size: 10px; color: #64748b; }
    
    /* ID Card Styles */
    .id-wrapper {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .id-card {
      width: 380px;
      height: 230px;
      border-radius: 16px;
      background: linear-gradient(135deg, #11141a 0%, #1e2430 70%, #450a0a 100%);
      color: #ffffff;
      padding: 18px;
      box-shadow: 0 16px 36px rgba(0,0,0,0.25);
      border: 1px solid #334155;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .id-card-back {
      background: #0f172a;
    }
    .id-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding-bottom: 8px;
    }
    .id-badge {
      background: #dc2626;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .id-body {
      display: flex;
      gap: 14px;
      align-items: center;
      margin: auto 0;
    }
    .id-avatar {
      width: 68px;
      height: 68px;
      border-radius: 12px;
      border: 2px solid #ef4444;
      background: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      color: #ef4444;
      flex-shrink: 0;
    }
    .id-name { font-size: 16px; font-weight: 800; font-family: 'Poppins', sans-serif; color: #ffffff; }
    .id-num { font-size: 12px; font-weight: 800; color: #f87171; font-family: monospace; }
    .id-detail { font-size: 10px; color: #cbd5e1; }
    .id-footer {
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
      border-top: 1px solid rgba(255,255,255,0.12);
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  ${
    isCert
      ? `
  <div class="cert-container" id="chama-certificate-print">
    <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
      <div style="width:36px; height:36px; border-radius:50%; background:#dc2626; color:#fff; font-weight:900; line-height:36px; text-align:center;">UB</div>
    </div>
    <div class="cert-title">${group.name}</div>
    <div class="cert-reg">Ministry of Cooperatives &amp; Social Development · Reg: ${group.registrationNumber}</div>
    <div class="cert-badge">Official Certificate of Group Membership</div>

    <div class="cert-body">
      <div class="cert-witness">This is to officially certify and witness that</div>
      <div class="cert-member-name">${selectedMember.fullName}</div>
      <div class="cert-text">
        having satisfied all statutory requirements, vetted by the executive committee, and sworn to the constitution bylaws of <strong>${group.name}</strong>, is hereby admitted as an authenticated registered member with full investment shares, credit facility eligibility, and voting rights.
      </div>

      <div class="cert-grid">
        <div class="cert-grid-item">
          <div class="cert-grid-label">Membership No.</div>
          <div class="cert-grid-val" style="color:#b91c1c;">${selectedMember.membershipNumber}</div>
        </div>
        <div class="cert-grid-item">
          <div class="cert-grid-label">National ID</div>
          <div class="cert-grid-val">${selectedMember.idNumber}</div>
        </div>
        <div class="cert-grid-item">
          <div class="cert-grid-label">Admission Date</div>
          <div class="cert-grid-val">${selectedMember.dateJoined}</div>
        </div>
        <div class="cert-grid-item">
          <div class="cert-grid-label">Member Status</div>
          <div class="cert-grid-val" style="color:#059669;">${selectedMember.status} (Active)</div>
        </div>
      </div>
    </div>

    <div class="cert-footer">
      <div class="sig-box">
        <div class="sig-font">David K. Koech</div>
        <div class="sig-line">${group.chairpersonName}</div>
        <div class="sig-role">Executive Chairperson</div>
      </div>

      <div style="text-align:center;">
        <div style="font-size:10px; font-weight:800; color:#b91c1c; font-family:monospace;">CERT NO: UB-${certSerial}</div>
        <div style="font-size:9px; color:#64748b;">Issued: ${issueDate} · Nairobi, Kenya</div>
      </div>

      <div class="sig-box">
        <div class="sig-font">Faith N. Mwangi</div>
        <div class="sig-line">${group.secretaryName}</div>
        <div class="sig-role">General Secretary</div>
      </div>
    </div>
  </div>`
      : `
  <div class="id-wrapper" id="chama-idcard-print">
    <!-- FRONT -->
    <div class="id-card">
      <div class="id-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:24px; height:24px; border-radius:4px; background:#dc2626; text-align:center; line-height:24px; font-weight:900; font-size:12px;">UB</div>
          <div>
            <div style="font-size:11px; font-weight:800; text-transform:uppercase;">${group.name}</div>
            <div style="font-size:8px; color:#94a3b8;">Reg: ${group.registrationNumber}</div>
          </div>
        </div>
        <div class="id-badge">${selectedMember.role}</div>
      </div>

      <div class="id-body">
        <div class="id-avatar">UB</div>
        <div>
          <div class="id-name">${selectedMember.fullName}</div>
          <div class="id-num">No: ${selectedMember.membershipNumber}</div>
          <div class="id-detail">National ID: ${selectedMember.idNumber}</div>
          <div class="id-detail">Phone: ${selectedMember.phone}</div>
        </div>
      </div>

      <div class="id-footer">
        <span>Admitted: ${selectedMember.dateJoined}</span>
        <span style="color:#34d399; font-weight:800;">● Active Member</span>
        <span>Exp: 12/2028</span>
      </div>
    </div>

    <!-- BACK -->
    <div class="id-card id-card-back">
      <div style="height:28px; background:#020617; border-radius:4px; margin:-8px -8px 0 -8px;"></div>
      <div style="font-size:9px; color:#cbd5e1; line-height:1.5;">
        <div style="font-weight:800; color:#fff; text-transform:uppercase; margin-bottom:2px;">Property of ${group.name}</div>
        <div>If found, please surrender to nearest Co-operative Bank branch or Police Station.</div>
        <div style="margin-top:6px; color:#f87171; font-weight:800;">
          M-Pesa Paybill: ${group.mpesaPaybill} · Account: ${group.mpesaAccountNumber}
        </div>
        <div style="margin-top:2px;">
          Next of Kin: ${selectedMember.nextOfKinName} (${selectedMember.nextOfKinRelationship}) · ${selectedMember.nextOfKinPhone}
        </div>
      </div>
      <div class="id-footer">
        <span>Signatories: Chair &amp; Sec</span>
        <span style="font-family:monospace; color:#e2e8f0;">CARD ID: ${selectedMember.membershipNumber}-2026</span>
      </div>
    </div>
  </div>`
  }
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

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Award className="w-5 h-5 text-red-600" />
            <span>Membership Credentials &amp; Verification Studio</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Generate authenticated, printable Membership Certificates and Digital QR Identification Cards
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#11141a] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-red-600' : ''}`} />
            <span>Regenerate Credentials</span>
          </button>

          <button
            onClick={handleDownloadDocument}
            className="px-3.5 py-2 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-bold text-red-700 dark:text-red-300 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Document</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {docType === 'certificate' ? 'Membership Certificate' : 'Digital ID Card'} document downloaded successfully.
          </span>
        </div>
      )}

      {/* Control Bar: Select Member & Document Type Switcher */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Member Selector */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 shrink-0">
            Select Member:
          </span>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-bold text-neutral-900 dark:text-neutral-100 max-w-xs w-full"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.membershipNumber} — {m.fullName} ({m.role})
              </option>
            ))}
          </select>
        </div>

        {/* View Switcher: Certificate vs ID Card */}
        <div className="inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start md:self-auto">
          <button
            onClick={() => setDocType('certificate')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              docType === 'certificate'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Membership Certificate</span>
          </button>
          <button
            onClick={() => setDocType('id_card')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              docType === 'id_card'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Digital ID Card (Front &amp; Back)</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW WORKSPACE */}
      {selectedMember && docType === 'certificate' && (
        <div className="flex justify-center p-2 sm:p-6 bg-neutral-100 dark:bg-[#0a0c10] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
          {/* Printable A4 Certificate Card */}
          <div
            id="chama-certificate-print"
            className="w-full max-w-3xl bg-white text-neutral-900 p-8 sm:p-12 rounded-xl shadow-2xl border-[10px] border-double border-red-800 relative selection:bg-red-100"
            style={{ minHeight: '520px' }}
          >
            {/* Ornate Corner Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-red-800" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-red-800" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-red-800" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-red-800" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-red-800/40 pb-6">
              <div className="inline-flex items-center justify-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-lg shadow-xs ring-4 ring-red-100">
                  UB
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-red-900 font-['Poppins']">
                {group.name}
              </h1>
              <p className="text-xs uppercase tracking-widest text-neutral-600 font-semibold">
                Ministry of Cooperatives &amp; Social Development · Reg: {group.registrationNumber}
              </p>
              <div className="inline-block px-4 py-1 rounded-full bg-red-50 text-red-800 text-xs font-bold uppercase tracking-wider border border-red-200">
                Official Certificate of Group Membership
              </div>
            </div>

            {/* Body */}
            <div className="py-8 text-center space-y-4">
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
                This is to officially certify and witness that
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 underline decoration-red-600 decoration-2 underline-offset-8 font-['Poppins']">
                {selectedMember.fullName}
              </h2>

              <p className="text-xs text-neutral-700 max-w-lg mx-auto leading-relaxed pt-2">
                having satisfied all constitutional prerequisites, vetted by the executive committee, and sworn to the bylaws of <strong>{group.name}</strong>, is hereby admitted as an authentic registered member with full statutory privileges, investment shares, and voting rights.
              </p>

              {/* Key Credentials Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-xl mx-auto text-xs text-left">
                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                    Membership No.
                  </span>
                  <span className="font-mono font-bold text-red-700 text-sm">
                    {selectedMember.membershipNumber}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                    National ID
                  </span>
                  <span className="font-mono font-bold text-neutral-900">
                    {selectedMember.idNumber}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                    Admission Date
                  </span>
                  <span className="font-bold text-neutral-900 tabular-nums">
                    {selectedMember.dateJoined}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                    Status
                  </span>
                  <span className="font-bold text-emerald-700 uppercase">
                    {selectedMember.status} (Active)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Footer: Signatures, Seal & QR Code */}
            <div className="pt-6 border-t-2 border-red-800/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
              {/* Chairperson Signature Line */}
              <div className="text-center w-44">
                <div className="font-['Brush_Script_MT',cursive,serif] text-xl text-red-900 italic h-7 flex items-center justify-center">
                  David K. Koech
                </div>
                <div className="border-t border-neutral-400 pt-1">
                  <span className="font-bold block text-neutral-800">{group.chairpersonName}</span>
                  <span className="text-[10px] text-neutral-500">Executive Chairperson</span>
                </div>
              </div>

              {/* Official Seal & QR Code */}
              <div className="flex flex-col items-center space-y-1">
                {/* Visual SVG QR */}
                <div className="p-1.5 bg-white border border-neutral-300 rounded shadow-xs">
                  <svg className="w-16 h-16 text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="40" y="10" width="20" height="10" />
                    <rect x="45" y="30" width="10" height="20" />
                    <rect x="35" y="60" width="15" height="15" />
                    <rect x="60" y="60" width="15" height="15" />
                    <rect x="70" y="40" width="20" height="10" />
                    <rect x="80" y="70" width="15" height="20" />
                  </svg>
                </div>
                <span className="text-[9px] font-mono font-bold text-red-700">
                  CERT-NO: UB-{certSerial}
                </span>
                <span className="text-[9px] text-neutral-400 tabular-nums">
                  Issued: {issueDate}
                </span>
              </div>

              {/* Secretary Signature Line */}
              <div className="text-center w-44">
                <div className="font-['Brush_Script_MT',cursive,serif] text-xl text-red-900 italic h-7 flex items-center justify-center">
                  Faith N. Mwangi
                </div>
                <div className="border-t border-neutral-400 pt-1">
                  <span className="font-bold block text-neutral-800">{group.secretaryName}</span>
                  <span className="text-[10px] text-neutral-500">General Secretary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL MEMBERSHIP ID CARD PREVIEW */}
      {selectedMember && docType === 'id_card' && (
        <div className="flex flex-col items-center justify-center p-6 bg-neutral-100 dark:bg-[#0a0c10] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Standard CR-80 High-Security Digital Membership Card
            </h3>
            <p className="text-xs text-neutral-500">
              Dual-sided verified photo identification badge with Co-op Bank Paybill coordinates &amp; QR verification
            </p>
          </div>

          <div id="chama-idcard-print" className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            {/* FRONT OF ID CARD */}
            <div className="w-[340px] sm:w-[380px] h-[220px] rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950 text-white p-4 shadow-2xl border border-neutral-700 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle watermarked emblem */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <Award className="w-48 h-48 text-white" />
              </div>

              {/* Top Card Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                    UB
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-tight uppercase font-['Poppins']">
                      {group.name}
                    </div>
                    <div className="text-[9px] text-neutral-400">
                      Reg: {group.registrationNumber}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-600/90 text-white">
                  {selectedMember.role}
                </span>
              </div>

              {/* Middle Member Info with Avatar */}
              <div className="flex items-center space-x-3.5 my-auto">
                {/* Photo Avatar */}
                <div className="w-16 h-16 rounded-xl bg-neutral-800 border-2 border-red-500 flex items-center justify-center text-neutral-300 font-bold text-xl overflow-hidden shadow-md shrink-0">
                  <User className="w-10 h-10 text-neutral-400" />
                </div>

                <div className="space-y-0.5 leading-tight">
                  <div className="text-sm font-extrabold font-['Poppins'] text-white">
                    {selectedMember.fullName}
                  </div>
                  <div className="text-[11px] font-mono text-red-400 font-bold">
                    No: {selectedMember.membershipNumber}
                  </div>
                  <div className="text-[10px] text-neutral-300">
                    Nat. ID: <span className="font-mono">{selectedMember.idNumber}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Phone: {selectedMember.phone}
                  </div>
                </div>
              </div>

              {/* Bottom Card Bar */}
              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-neutral-400">
                <span>Admitted: {selectedMember.dateJoined}</span>
                <span className="text-emerald-400 font-bold uppercase">● Active Member</span>
                <span>Exp: 12/2028</span>
              </div>
            </div>

            {/* BACK OF ID CARD */}
            <div className="w-[340px] sm:w-[380px] h-[220px] rounded-2xl bg-neutral-900 text-white p-4 shadow-2xl border border-neutral-700 flex flex-col justify-between relative overflow-hidden">
              {/* Magnetic Strip Header */}
              <div className="w-full h-8 bg-neutral-950 rounded -mx-4 -mt-4 border-b border-neutral-800" />

              {/* Middle Section: Instructions & QR */}
              <div className="flex items-center justify-between gap-3 text-xs pt-2">
                <div className="space-y-1 text-[10px] text-neutral-300 leading-snug">
                  <p className="font-bold text-white uppercase text-[10px]">
                    Official Terms of Possession:
                  </p>
                  <p className="text-[9px] text-neutral-400">
                    This card remains the property of {group.name}. If found, please return to Co-operative Bank Westlands or nearest Police Station.
                  </p>
                  <div className="pt-1 text-[9px] space-y-0.5">
                    <div>
                      <strong className="text-neutral-200">Next of Kin:</strong> {selectedMember.nextOfKinName} ({selectedMember.nextOfKinRelationship})
                    </div>
                    <div>
                      <strong className="text-neutral-200">Emergency Phone:</strong> {selectedMember.nextOfKinPhone}
                    </div>
                    <div>
                      <strong className="text-red-400">Paybill:</strong> {group.mpesaPaybill} · A/C: {group.mpesaAccountNumber}
                    </div>
                  </div>
                </div>

                {/* Verification QR */}
                <div className="p-1 bg-white rounded shrink-0">
                  <svg className="w-14 h-14 text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="40" y="20" width="20" height="10" />
                    <rect x="50" y="40" width="10" height="20" />
                    <rect x="35" y="60" width="25" height="15" />
                    <rect x="70" y="50" width="20" height="20" />
                  </svg>
                </div>
              </div>

              {/* Bottom Signature Bar */}
              <div className="flex items-center justify-between border-t border-neutral-800 pt-2 text-[9px] text-neutral-400">
                <span>Auth Signatory: Chair &amp; Sec</span>
                <span className="font-mono text-neutral-300">CARD ID: {selectedMember.membershipNumber}-2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
