import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Gavel,
  User,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  LegalMatter,
  LegalClient,
  LegalStaff,
  MatterType,
  CourtForum,
  MatterStatus,
} from '../../types/legalPractice';

interface CreateMatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: LegalClient[];
  staff: LegalStaff[];
  onSaveMatter: (matterData: Omit<LegalMatter, 'id' | 'totalBilledKes' | 'totalPaidKes' | 'outstandingBalanceKes' | 'totalHoursRecorded' | 'timeline' | 'updatedAt'>) => void;
}

export const CreateMatterModal: React.FC<CreateMatterModalProps> = ({
  isOpen,
  onClose,
  clients,
  staff,
  onSaveMatter,
}) => {
  const [matterNumber, setMatterNumber] = useState('HCCOMM/E' + Math.floor(100 + Math.random() * 900) + '/2026');
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [matterType, setMatterType] = useState<MatterType>('Commercial Litigation');
  const [courtForum, setCourtForum] = useState<CourtForum>('High Court (Commercial & Tax Division)');
  const [assignedAdvocateId, setAssignedAdvocateId] = useState(staff[0]?.id || '');
  const [status, setStatus] = useState<MatterStatus>('open');
  const [filingDate, setFilingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [nextCourtDate, setNextCourtDate] = useState('');
  const [nextCourtPurpose, setNextCourtPurpose] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [opposingCounsel, setOpposingCounsel] = useState('');
  const [caseJudge, setCaseJudge] = useState('');
  const [disputeValueKes, setDisputeValueKes] = useState('15000000');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !matterNumber.trim()) return;

    const client = clients.find((c) => c.id === clientId) || clients[0];
    const advocate = staff.find((s) => s.id === assignedAdvocateId) || staff[0];

    onSaveMatter({
      matterNumber,
      title,
      clientId: client.id,
      clientName: client.name,
      clientType: client.clientType,
      matterType,
      courtForum,
      assignedAdvocateId: advocate.id,
      assignedAdvocateName: advocate.name,
      status,
      filingDate,
      nextCourtDate: nextCourtDate || undefined,
      nextCourtPurpose: nextCourtPurpose || undefined,
      opposingParty: opposingParty || undefined,
      opposingCounsel: opposingCounsel || undefined,
      caseJudge: caseJudge || undefined,
      disputeValueKes: parseFloat(disputeValueKes) || undefined,
      description,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Register New Legal Matter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Matter / Cause Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HCCOMM/E412/2026 or ELC/12/2025"
                value={matterNumber}
                onChange={(e) => setMatterNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Client *
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clientType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Matter Case Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Safariland Logistics Kenya Ltd vs. BlueWave Fuel Importers Ltd"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Practice Area *
              </label>
              <select
                value={matterType}
                onChange={(e) => setMatterType(e.target.value as MatterType)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="Commercial Litigation">Commercial Litigation</option>
                <option value="Conveyancing & Real Estate">Conveyancing &amp; Real Estate</option>
                <option value="Employment & Labour Relations">Employment &amp; Labour Relations</option>
                <option value="Environment and Land Court (ELC)">Environment and Land Court (ELC)</option>
                <option value="Corporate & M&A">Corporate &amp; M&amp;A</option>
                <option value="Banking & Finance">Banking &amp; Finance</option>
                <option value="Family & Succession">Family &amp; Succession</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Court Forum
              </label>
              <select
                value={courtForum}
                onChange={(e) => setCourtForum(e.target.value as CourtForum)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="High Court (Commercial & Tax Division)">High Court Commercial</option>
                <option value="Environment and Land Court (ELC)">ELC</option>
                <option value="Employment and Labour Relations Court (ELRC)">ELRC</option>
                <option value="Court of Appeal (Nairobi)">Court of Appeal</option>
                <option value="Chief Magistrate Commercial Court (Milimani)">Chief Magistrate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Lead Handling Advocate *
              </label>
              <select
                value={assignedAdvocateId}
                onChange={(e) => setAssignedAdvocateId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Dispute / Claim Value in KES
              </label>
              <input
                type="number"
                placeholder="e.g. 25000000"
                value={disputeValueKes}
                onChange={(e) => setDisputeValueKes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Opposing Party
              </label>
              <input
                type="text"
                placeholder="e.g. BlueWave Fuel Importers Ltd"
                value={opposingParty}
                onChange={(e) => setOpposingParty(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Opposing Counsel Law Firm
              </label>
              <input
                type="text"
                placeholder="e.g. Mboya & Associates Advocates"
                value={opposingCounsel}
                onChange={(e) => setOpposingCounsel(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Case Summary &amp; Cause of Action *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Brief facts of the dispute, breach of agreement, relief sought..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
            >
              Register Case Matter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
