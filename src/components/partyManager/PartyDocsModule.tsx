import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  ShieldCheck,
  Lock,
  Calendar,
  X,
  FileCheck,
  Upload,
} from 'lucide-react';
import { PartyDocument } from '../../types/partyManager';

interface PartyDocsModuleProps {
  documents: PartyDocument[];
  onAddDocument: (doc: PartyDocument) => void;
}

export const PartyDocsModule: React.FC<PartyDocsModuleProps> = ({
  documents,
  onAddDocument,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<PartyDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Document form state
  const [form, setForm] = useState<{
    title: string;
    category: PartyDocument['category'];
    referenceNumber: string;
    fileSize: string;
    accessLevel: PartyDocument['accessLevel'];
    description: string;
  }>({
    title: '',
    category: 'compliance_return',
    referenceNumber: 'ORPP/DOC/2025-01',
    fileSize: '1.8 MB',
    accessLevel: 'public_members',
    description: '',
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: PartyDocument = {
      id: `doc-${Date.now()}`,
      title: form.title,
      category: form.category,
      referenceNumber: form.referenceNumber,
      fileFormat: 'pdf',
      fileSize: form.fileSize,
      uploadedBy: 'Adv. Kenneth Omondi Otieno',
      uploadedAt: new Date().toISOString().split('T')[0],
      accessLevel: form.accessLevel,
      downloadCount: 0,
      description: form.description,
    };
    onAddDocument(newDoc);
    setIsUploadModalOpen(false);
    setSelectedDoc(newDoc);
  };

  const handleSimulatedDownload = (doc: PartyDocument) => {
    alert(`Downloading verified copy of "${doc.title}" (${doc.referenceNumber}). File size: ${doc.fileSize}`);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase());

    const matchCat = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-600" />
            Statutory Document Repository & Legal Vault
          </h2>
          <p className="text-xs text-slate-500">
            Registered Party Constitution, certified ORPP compliance returns, audited accounts, and policy whitepapers
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, reference number, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-red-500 focus:outline-hidden"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:border-red-500 focus:outline-hidden"
        >
          <option value="all">All Document Categories</option>
          <option value="constitution_bylaws">Constitution & Bylaws</option>
          <option value="compliance_return">ORPP Compliance Returns</option>
          <option value="nec_resolutions">NEC Resolutions</option>
          <option value="financial_audit">Audited Accounts</option>
          <option value="party_policy">Policy Whitepapers</option>
          <option value="meeting_minutes">Meeting Minutes</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 truncate">
                    {doc.referenceNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {doc.fileFormat.toUpperCase()} • {doc.fileSize}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3">{doc.description}</p>

                <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span>Uploaded: {doc.uploadedAt}</span>
                    <span className="font-semibold text-slate-600 capitalize">
                      {doc.accessLevel.replace('_', ' ')}
                    </span>
                  </div>
                  <div>Archived by: <strong className="text-slate-600">{doc.uploadedBy}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => handleSimulatedDownload(doc)}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  {selectedDoc.referenceNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedDoc.title}</h3>
                <div className="text-xs text-slate-500 capitalize">
                  Category: {selectedDoc.category.replace('_', ' ')}
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-200">
              <div className="font-semibold text-slate-900">Document Overview</div>
              <p className="text-slate-600 leading-relaxed">{selectedDoc.description}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-700">
                <div>File Format: <strong>{selectedDoc.fileFormat.toUpperCase()}</strong></div>
                <div>Size: <strong>{selectedDoc.fileSize}</strong></div>
                <div>Uploaded: <strong>{selectedDoc.uploadedAt}</strong></div>
                <div>Access Tier: <strong>{selectedDoc.accessLevel}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Downloaded {selectedDoc.downloadCount.toLocaleString()} times by accredited organs
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSimulatedDownload(selectedDoc)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Verified PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Upload Organization Document
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Political Parties Act Audit Certificate 2025"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as PartyDocument['category'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="compliance_return">ORPP Compliance Return</option>
                    <option value="constitution_bylaws">Constitution / Bylaws</option>
                    <option value="nec_resolutions">NEC Resolutions</option>
                    <option value="financial_audit">Financial Audit Statement</option>
                    <option value="party_policy">Policy Whitepaper</option>
                    <option value="meeting_minutes">Meeting Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ref Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ORPP/RET/2025-01"
                    value={form.referenceNumber}
                    onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Access Level</label>
                <select
                  value={form.accessLevel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      accessLevel: e.target.value as PartyDocument['accessLevel'],
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                >
                  <option value="public_members">Public to All Registered Members</option>
                  <option value="delegates_only">Accredited Delegates Only</option>
                  <option value="nec_executive_only">National Executive Committee Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the contents, statutory citations, and legal background..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Ingest & Encrypt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
