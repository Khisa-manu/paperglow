import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Upload,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  X,
  FileCheck,
  FolderOpen,
} from 'lucide-react';
import {
  LegalDocument,
  LegalMatter,
} from '../../types/legalPractice';

interface DocumentsModuleProps {
  documents: LegalDocument[];
  matters: LegalMatter[];
  onUploadDocument: (doc: Omit<LegalDocument, 'id' | 'uploadedAt'>) => void;
}

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({
  documents,
  matters,
  onUploadDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [matterFilter, setMatterFilter] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Upload Form State
  const [matterId, setMatterId] = useState(matters[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Pleadings & Plaints');
  const [fileName, setFileName] = useState('');
  const [version, setVersion] = useState('v1.0');
  const [uploadedBy, setUploadedBy] = useState('Litigation Registry Clerk');
  const [summary, setSummary] = useState('');

  const filteredDocs = documents.filter((doc) => {
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    if (matterFilter !== 'all' && doc.matterId !== matterFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.matterNumber.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) return;

    const matter = matters.find((m) => m.id === matterId) || matters[0];

    onUploadDocument({
      matterId: matter ? matter.id : 'mat-1',
      matterNumber: matter ? matter.matterNumber : 'HCCOMM/GEN/2026',
      matterTitle: matter ? matter.title : 'General Matter File',
      title,
      category,
      fileName,
      fileSize: `${Math.floor(1 + Math.random() * 5)}.${Math.floor(1 + Math.random() * 9)} MB`,
      fileType: fileName.endsWith('.docx') ? 'Word Document' : 'PDF Document',
      version,
      uploadedBy,
      summary,
    });

    setIsUploadOpen(false);
    setTitle('');
    setFileName('');
    setSummary('');
  };

  const handleDownloadSimulation = (doc: LegalDocument) => {
    setDownloadNotice(`Simulated secure decryption & download for: ${doc.fileName} (${doc.version})`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Pleadings, Court Orders &amp; Deeds Archive
          </h2>
          <p className="text-xs text-neutral-500">
            Secure client documents organized by case file, category, version audit trails, and court stamped registry verification.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Legal Document</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents by title, file or matter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Document Categories</option>
              <option value="Pleadings & Plaints">Pleadings &amp; Plaints</option>
              <option value="Affidavits & Exhibits">Affidavits &amp; Exhibits</option>
              <option value="Court Rulings & Orders">Court Rulings &amp; Orders</option>
              <option value="Commercial Contracts & Deeds">Commercial Contracts &amp; Deeds</option>
              <option value="Legal Opinions & Research">Legal Opinions &amp; Research</option>
            </select>
          </div>

          <div>
            <select
              value={matterFilter}
              onChange={(e) => setMatterFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Linked Matters ({matters.length})</option>
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.matterNumber}: {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                  {doc.matterNumber}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {doc.version}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                  {doc.title}
                </h3>
                <span className="text-[10px] text-neutral-400 block font-medium">
                  {doc.category}
                </span>
              </div>

              <p className="text-[11px] text-neutral-500 line-clamp-2">{doc.summary}</p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>{doc.fileName}</span>
                <span>{doc.fileSize}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">
                  Uploaded by {doc.uploadedBy}
                </span>
                <button
                  onClick={() => handleDownloadSimulation(doc)}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-neutral-700 dark:text-neutral-200 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
            <FileText className="w-8 h-8 text-neutral-400 mx-auto" />
            <p>No legal documents found matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Upload &amp; Index Legal Document
              </h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Associated Matter Case File *
                </label>
                <select
                  value={matterId}
                  onChange={(e) => setMatterId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.matterNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Originating Summons or Signed Agreement for Sale"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Document Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="Pleadings & Plaints">Pleadings &amp; Plaints</option>
                    <option value="Affidavits & Exhibits">Affidavits &amp; Exhibits</option>
                    <option value="Court Rulings & Orders">Court Rulings &amp; Orders</option>
                    <option value="Commercial Contracts & Deeds">Commercial Contracts &amp; Deeds</option>
                    <option value="Legal Opinions & Research">Legal Opinions &amp; Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Version Index
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  File Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plaint_Milimani_Stamped.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Executive Document Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief note on contents, exhibits, or registry filing status..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Upload &amp; Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
