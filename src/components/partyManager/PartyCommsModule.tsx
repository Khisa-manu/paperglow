import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { PartyCommunication } from '../../types/partyManager';

interface PartyCommsModuleProps {
  communications: PartyCommunication[];
  onAddCommunication: (comm: PartyCommunication) => void;
}

export const PartyCommsModule: React.FC<PartyCommsModuleProps> = ({
  communications,
  onAddCommunication,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState<PartyCommunication | null>(null);

  // Form State
  const [form, setForm] = useState<{
    title: string;
    messageType: 'circular' | 'executive_memo' | 'resolution' | 'announcement';
    channel: 'internal_portal' | 'sms_gateway' | 'email_blast' | 'whatsapp_notice';
    targetAudience: string;
    body: string;
    senderName: string;
    senderRole: string;
    recipientCount: number;
  }>({
    title: '',
    messageType: 'circular',
    channel: 'internal_portal',
    targetAudience: 'All County Secretariats & Accredited Delegates',
    body: '',
    senderName: 'Adv. Kenneth Omondi Otieno',
    senderRole: 'Secretary General',
    recipientCount: 420,
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newComm: PartyCommunication = {
      id: `comm-${Date.now()}`,
      title: form.title,
      messageType: form.messageType,
      channel: form.channel,
      targetAudience: form.targetAudience,
      body: form.body,
      senderName: form.senderName,
      senderRole: form.senderRole,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recipientCount: Number(form.recipientCount),
      deliveryRate: 99.1,
      status: 'sent',
    };
    onAddCommunication(newComm);
    setIsComposeModalOpen(false);
    setSelectedComm(newComm);
  };

  const filteredComms = communications.filter((c) => {
    if (filterType === 'all') return true;
    return c.messageType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-red-600" />
            Party Circulars, Executive Memos & Internal Broadcasts
          </h2>
          <p className="text-xs text-slate-500">
            Official internal communiqués, resolutions, and multi-channel statutory dispatches
          </p>
        </div>

        <button
          onClick={() => setIsComposeModalOpen(true)}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue New Circular</span>
        </button>
      </div>

      {/* Multi-Channel Integrations Showcase (Future Integrations as specified) */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl border border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Connected Broadcast Gateways (Kenyan Telco & Messaging)
            </span>
          </div>
          <span className="text-[10px] font-semibold bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
            Telecommunications Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Safaricom / Africa's Talking
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Active SMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bulk SMS sender ID: <strong className="text-slate-200">UCA-KENYA</strong>. Automated delivery to 47 counties.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                Meta WhatsApp Business API
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Encrypted channel for branch coordinators and verified delegate caucus alerts.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                DKIM / SPF Email Relays
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Configured
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Authenticated dispatches from <strong className="text-slate-200">secretariat@ucakenya.or.ke</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Communiqués ({communications.length})
        </button>
        <button
          onClick={() => setFilterType('circular')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'circular'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Party Circulars
        </button>
        <button
          onClick={() => setFilterType('executive_memo')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'executive_memo'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Executive Memos
        </button>
        <button
          onClick={() => setFilterType('resolution')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'resolution'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Resolutions
        </button>
      </div>

      {/* Communications Feed */}
      <div className="space-y-3">
        {filteredComms.map((comm) => (
          <div
            key={comm.id}
            onClick={() => setSelectedComm(comm)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 cursor-pointer transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-red-100 text-red-800">
                  {comm.messageType.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-slate-900">{comm.title}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{comm.sentAt}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                  {comm.channel.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{comm.body}</p>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                Author: <strong className="text-slate-700">{comm.senderName}</strong> ({comm.senderRole})
              </div>
              <div className="flex items-center gap-3">
                <span>Audience: <strong>{comm.targetAudience}</strong></span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Delivered to {comm.recipientCount.toLocaleString()} ({comm.deliveryRate}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedComm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-red-100 text-red-800">
                  {selectedComm.messageType.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedComm.title}</h3>
                <div className="text-xs text-slate-500">
                  Sent on {selectedComm.sentAt} via {selectedComm.channel}
                </div>
              </div>
              <button
                onClick={() => setSelectedComm(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <div><strong>Audience:</strong> {selectedComm.targetAudience}</div>
              <div><strong>Issued By:</strong> {selectedComm.senderName}, {selectedComm.senderRole}</div>
              <div className="text-emerald-700 font-semibold">
                Delivered to {selectedComm.recipientCount.toLocaleString()} verified party channels ({selectedComm.deliveryRate}% delivery confirmation)
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-serif">
              {selectedComm.body}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedComm(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Close Memo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Circular Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Compose Official Party Communiqué
              </h3>
              <button
                onClick={() => setIsComposeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Header</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Circular No. 04/2025: Compliance Audit Filing Completed"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Type</label>
                  <select
                    value={form.messageType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        messageType: e.target.value as 'circular' | 'executive_memo' | 'resolution' | 'announcement',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="circular">Party Circular</option>
                    <option value="executive_memo">Executive Leadership Memo</option>
                    <option value="resolution">NEC Resolution</option>
                    <option value="announcement">Member Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dispatch Gateway</label>
                  <select
                    value={form.channel}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        channel: e.target.value as 'internal_portal' | 'sms_gateway' | 'email_blast' | 'whatsapp_notice',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="internal_portal">Internal Secretariat Portal</option>
                    <option value="sms_gateway">Safaricom Bulk SMS (Africa's Talking)</option>
                    <option value="email_blast">Official Email Broadcast</option>
                    <option value="whatsapp_notice">WhatsApp Notice Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  required
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Message Text</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter formal declaration, instructions, statutory citations..."
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authorized Signatory</label>
                  <input
                    type="text"
                    required
                    value={form.senderName}
                    onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={form.senderRole}
                    onChange={(e) => setForm({ ...form, senderRole: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
