import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Phone,
  Mail,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import {
  ClientCommunication,
  LegalClient,
  LegalMatter,
  LegalStaff,
} from '../../types/legalPractice';

interface CommunicationsModuleProps {
  communications: ClientCommunication[];
  clients: LegalClient[];
  matters: LegalMatter[];
  staff: LegalStaff[];
  onAddCommunication: (comm: Omit<ClientCommunication, 'id'>) => void;
}

export const CommunicationsModule: React.FC<CommunicationsModuleProps> = ({
  communications,
  clients,
  matters,
  staff,
  onAddCommunication,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Form State
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [matterId, setMatterId] = useState(matters[0]?.id || '');
  const [channel, setChannel] = useState<any>('In-Person Conference');
  const [direction, setDirection] = useState<'inbound' | 'outbound'>('outbound');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [advocateName, setAdvocateName] = useState(staff[0]?.name || 'David Kamau, SC');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    const client = clients.find((c) => c.id === clientId) || clients[0];
    const matter = matters.find((m) => m.id === matterId);

    onAddCommunication({
      clientId: client.id,
      clientName: client.name,
      matterId: matter?.id,
      matterNumber: matter?.matterNumber,
      channel,
      direction,
      subject,
      content,
      timestamp: new Date().toISOString(),
      advocateName,
      followUpDate,
      followUpCompleted: false,
    });

    setIsLogOpen(false);
    setSubject('');
    setContent('');
  };

  const filteredCommunications = communications.filter((c) => {
    if (channelFilter !== 'all' && c.channel !== channelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        (c.matterNumber && c.matterNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Client Consultations &amp; Case Communications
          </h2>
          <p className="text-xs text-neutral-500">
            Log strategic case conferences, client instructions, formal legal advice transmission letters, and automated follow-up reminders.
          </p>
        </div>

        <button
          onClick={() => setIsLogOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Communication</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by client, subject or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Communication Channels</option>
              <option value="In-Person Conference">In-Person Conference</option>
              <option value="Phone Call">Phone Call</option>
              <option value="Formal Letter">Formal Letter</option>
              <option value="Email">Email</option>
              <option value="WhatsApp / SMS">WhatsApp / SMS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communications Feed */}
      <div className="space-y-3">
        {filteredCommunications.map((comm) => (
          <div
            key={comm.id}
            className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-neutral-900 dark:text-white">
                  {comm.clientName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {comm.channel}
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  {comm.direction}
                </span>
              </div>

              <div className="text-[11px] text-neutral-400 font-mono">
                {comm.timestamp.replace('T', ' ').slice(0, 16)}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {comm.subject}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {comm.content}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
              <div>
                Advocate: <strong className="text-neutral-800 dark:text-neutral-200">{comm.advocateName}</strong>
                {comm.matterNumber && (
                  <span> • Matter: <span className="font-mono text-red-600 font-bold">{comm.matterNumber}</span></span>
                )}
              </div>

              {comm.followUpDate && (
                <div className="text-amber-600 font-semibold text-[11px] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Scheduled Follow-Up: {comm.followUpDate}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredCommunications.length === 0 && (
          <div className="py-12 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
            <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto" />
            <p>No client communications matching your search filter.</p>
          </div>
        )}
      </div>

      {/* Log Communication Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Record Client Communication / Strategy Session
              </h3>
              <button
                onClick={() => setIsLogOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
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
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Matter File (Optional)
                  </label>
                  <select
                    value={matterId}
                    onChange={(e) => setMatterId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="">General Retainer Discussion</option>
                    {matters.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.matterNumber}: {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Communication Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="In-Person Conference">In-Person Conference</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Formal Letter">Formal Letter</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp / SMS">WhatsApp / SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Direction
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="outbound">Outbound (Firm to Client)</option>
                    <option value="inbound">Inbound (Client to Firm)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Witness Evidence Preparation or Settlement Terms Review"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Detailed Minutes / Summary of Advice *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize instructions given, documents requested, or legal advice communicated..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Advocate Handler
                  </label>
                  <select
                    value={advocateName}
                    onChange={(e) => setAdvocateName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Next Follow-up Due
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
