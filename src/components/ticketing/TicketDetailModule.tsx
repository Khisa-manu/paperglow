import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  Send,
  Lock,
  Paperclip,
  CheckCircle2,
  User,
  ShieldCheck,
  Flame,
  FileText,
  Download,
  Calendar,
  Building,
  Mail,
  Phone,
  MessageSquare,
  History,
  Tag,
  ChevronDown,
} from 'lucide-react';
import {
  Ticket,
  TicketMessage,
  TicketActivity,
  TicketCategory,
  StaffMember,
  Customer,
  TicketPriority,
  TicketStatus,
} from '../../types/ticketing';

interface TicketDetailModuleProps {
  ticket: Ticket;
  messages: TicketMessage[];
  activities: TicketActivity[];
  categories: TicketCategory[];
  staffMembers: StaffMember[];
  customer?: Customer;
  currentStaff: StaffMember;
  onBack: () => void;
  onSendMessage: (ticketId: string, messageText: string, isInternal: boolean) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onUpdatePriority: (ticketId: string, priority: TicketPriority) => void;
  onUpdateAssignee: (ticketId: string, staffId: string) => void;
  onUpdateCategory: (ticketId: string, categoryId: string) => void;
}

export const TicketDetailModule: React.FC<TicketDetailModuleProps> = ({
  ticket,
  messages,
  activities,
  categories,
  staffMembers,
  customer,
  currentStaff,
  onBack,
  onSendMessage,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateAssignee,
  onUpdateCategory,
}) => {
  const [replyMode, setReplyMode] = useState<'public' | 'internal'>('public');
  const [replyText, setReplyText] = useState('');
  const [selectedMacro, setSelectedMacro] = useState('');

  // Ticket messages for this specific ticket
  const ticketMessages = messages.filter((m) => m.ticketId === ticket.id);
  const ticketActivities = activities.filter((a) => a.ticketId === ticket.id);

  // Canned Macros
  const macros = [
    {
      id: 'm-daraja',
      label: 'M-Pesa STK Escalation',
      text: 'Thank you for providing the transaction logs. We have rerouted API traffic through our secondary Nairobi IXP gateway. Please test a small transaction and confirm if the STK push prompt is received within 5 seconds.',
    },
    {
      id: 'm-timings',
      label: 'KRA Tax Exemption Steps',
      text: 'To apply zero-rated export freight VAT exemption, please ensure the Buyer Country is set to any non-KE territory and toggle "Zero-Rated Foreign Cargo" in Line Item Tax Options before regenerating the fiscal invoice.',
    },
    {
      id: 'm-barcode',
      label: 'Barcode Scanner Carriage Return',
      text: 'Please scan the CR/LF Suffix configuration barcode from page 4 of the scanner manual. This will ensure the device sends an Enter keypress automatically after each barcode scan.',
    },
    {
      id: 'm-resolve',
      label: 'Resolution Confirmation Request',
      text: 'We have applied the requested configuration update to your account. Please let us know if everything is operating as expected so we can close this ticket.',
    },
  ];

  const handleApplyMacro = (macroId: string) => {
    setSelectedMacro(macroId);
    const m = macros.find((mac) => mac.id === macroId);
    if (m) {
      setReplyText(m.text);
    }
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendMessage(ticket.id, replyText, replyMode === 'internal');
    setReplyText('');
    setSelectedMacro('');
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Back to Tickets Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400">
                {ticket.id}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500">Opened {new Date(ticket.createdAt).toLocaleString()}</span>
              {ticket.isOverdue && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>SLA Overdue</span>
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5 line-clamp-1">
              {ticket.subject}
            </h2>
          </div>
        </div>

        {/* Quick Status / Priority Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center space-x-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded-md px-2.5 py-1 text-xs">
            <span className="text-neutral-500 text-[11px]">Status:</span>
            <select
              value={ticket.status}
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
              className="font-semibold bg-transparent border-0 text-neutral-900 dark:text-white focus:ring-0 cursor-pointer capitalize p-0"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="flex items-center space-x-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded-md px-2.5 py-1 text-xs">
            <span className="text-neutral-500 text-[11px]">Priority:</span>
            <select
              value={ticket.priority}
              onChange={(e) => onUpdatePriority(ticket.id, e.target.value as TicketPriority)}
              className={`font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer capitalize p-0 ${
                ticket.priority === 'urgent'
                  ? 'text-red-600 dark:text-red-400'
                  : ticket.priority === 'high'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-neutral-900 dark:text-white'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Conversation Thread, Internal Notes, & Composer */}
        <div className="lg:col-span-2 space-y-5">
          {/* Original Customer Inquiry Box */}
          <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                  {ticket.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    {ticket.customerName}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {ticket.customerEmail} · {ticket.customerCompany}
                  </p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 tabular-nums">
                {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap pl-10 border-l-2 border-red-500/30">
              {ticket.description}
            </div>

            {/* Attachments under inquiry */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="pl-10 pt-2 space-y-1.5">
                <p className="text-[11px] font-semibold text-neutral-500">Initial Attachments:</p>
                <div className="flex flex-wrap gap-2">
                  {ticket.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center space-x-2 px-2.5 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-xs text-neutral-700 dark:text-neutral-300"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="font-mono text-[11px]">{att.name}</span>
                      <span className="text-[10px] text-neutral-400">({att.size})</span>
                      <button
                        onClick={() => alert(`Downloading simulation for ${att.name}`)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conversation Thread Messages */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
              Conversation Thread ({ticketMessages.length} Messages)
            </h3>

            {ticketMessages.map((msg) => {
              const isInternal = msg.isInternalNote;
              const isStaff = msg.senderType === 'staff';

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isInternal
                      ? 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-300 dark:border-amber-900/60'
                      : isStaff
                      ? 'bg-neutral-50/60 dark:bg-[#141820] border-neutral-200 dark:border-neutral-800'
                      : 'bg-white dark:bg-[#12151b] border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {msg.senderAvatar ? (
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold">
                          {msg.senderName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {msg.senderName}
                          </span>
                          {isInternal && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold flex items-center space-x-0.5">
                              <Lock className="w-2.5 h-2.5 inline mr-0.5" />
                              Internal Team Note
                            </span>
                          )}
                          {!isInternal && isStaff && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium">
                              Support Agent
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400">{msg.senderEmail}</p>
                      </div>
                    </div>

                    <span className="text-[11px] text-neutral-400 tabular-nums">
                      {new Date(msg.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed whitespace-pre-wrap pl-8 ${
                      isInternal
                        ? 'text-amber-900 dark:text-amber-100 font-medium'
                        : 'text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Reply Composer Form */}
          <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setReplyMode('public')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    replyMode === 'public'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply to Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReplyMode('internal')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    replyMode === 'internal'
                      ? 'bg-amber-500 text-white font-bold'
                      : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Add Internal Note</span>
                </button>
              </div>

              {/* Macro Selector */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-neutral-400 text-[11px] hidden sm:inline">Insert Macro:</span>
                <select
                  value={selectedMacro}
                  onChange={(e) => handleApplyMacro(e.target.value)}
                  className="px-2 py-1 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-700 dark:text-neutral-300 text-xs focus:outline-none"
                >
                  <option value="">Choose Canned Response...</option>
                  {macros.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-3">
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  replyMode === 'internal'
                    ? 'Write an internal note visible only to support staff and engineers...'
                    : `Reply to ${ticket.customerName}...`
                }
                className={`w-full p-3 text-xs sm:text-sm rounded-md border focus:outline-none transition-colors ${
                  replyMode === 'internal'
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900 focus:ring-1 focus:ring-amber-500 text-amber-900 dark:text-amber-100 placeholder-amber-700/50'
                    : 'bg-neutral-50 dark:bg-[#181c24] border-neutral-200 dark:border-neutral-800 focus:ring-1 focus:ring-red-600 text-neutral-900 dark:text-white placeholder-neutral-400'
                }`}
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert('Attachment upload dialog simulated: PNG, JPG, PDF, LOG files accepted.')}
                  className="flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1.5 rounded cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach file</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className={`flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
                      replyMode === 'internal'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{replyMode === 'internal' ? 'Save Internal Note' : 'Send Reply'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (1/3): Ticket Metadata, Customer Dossier, Timeline */}
        <div className="space-y-5">
          {/* Ticket Properties Card */}
          <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Ticket Properties
            </h3>

            <div className="space-y-3 text-xs">
              {/* Category */}
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Category
                </label>
                <select
                  value={ticket.categoryId}
                  onChange={(e) => onUpdateCategory(ticket.id, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Assigned Agent
                </label>
                <select
                  value={ticket.assignedStaffId || ''}
                  onChange={(e) => onUpdateAssignee(ticket.id, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {staffMembers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolution SLA Target */}
              <div className="p-2.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-neutral-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>Resolution Target</span>
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white tabular-nums">
                    {new Date(ticket.dueDate).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">First Response SLA:</span>
                  <span className="text-emerald-600 font-medium tabular-nums">
                    {ticket.firstResponseAt
                      ? `Met in 25m`
                      : ticket.isResponseOverdue
                      ? 'Overdue'
                      : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1">
                  {ticket.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Profile Card */}
          <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Customer Dossier
            </h3>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                {ticket.customerName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {ticket.customerName}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">{ticket.customerCompany}</p>
                {customer && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium inline-block mt-0.5">
                    {customer.tier}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span className="truncate">{ticket.customerEmail}</span>
              </div>
              {customer?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer && (
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                  <span>Total Tickets: {customer.totalTickets}</span>
                  <span>CSAT: {customer.satisfactionRating} / 5.0</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
            <div className="flex items-center space-x-1.5">
              <History className="w-3.5 h-3.5 text-neutral-500" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Activity Timeline
              </h3>
            </div>

            <div className="space-y-3 text-xs pl-2 border-l border-neutral-200 dark:border-neutral-800">
              {ticketActivities.map((act) => (
                <div key={act.id} className="relative pl-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 absolute -left-[17px] top-1" />
                  <p className="font-semibold text-neutral-900 dark:text-white text-[11px]">
                    {act.actorName}
                  </p>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
                    {act.action}
                  </p>
                  {act.details && (
                    <p className="text-[10px] text-neutral-400 mt-0.5">{act.details}</p>
                  )}
                  <span className="text-[10px] text-neutral-400 tabular-nums">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
