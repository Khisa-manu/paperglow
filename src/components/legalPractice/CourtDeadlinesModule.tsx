import React, { useState } from 'react';
import {
  Gavel,
  Clock,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Video,
  MapPin,
  X,
  User,
  Check,
} from 'lucide-react';
import {
  CourtHearingEvent,
  LegalDeadline,
  LegalMatter,
  LegalStaff,
  CourtForum,
  TaskPriority,
} from '../../types/legalPractice';

interface CourtDeadlinesModuleProps {
  hearings: CourtHearingEvent[];
  deadlines: LegalDeadline[];
  matters: LegalMatter[];
  staff: LegalStaff[];
  onAddHearing: (hearing: Omit<CourtHearingEvent, 'id' | 'reminderSent'>) => void;
  onAddDeadline: (deadline: Omit<LegalDeadline, 'id' | 'isCompleted'>) => void;
  onToggleDeadline: (deadlineId: string) => void;
}

export const CourtDeadlinesModule: React.FC<CourtDeadlinesModuleProps> = ({
  hearings,
  deadlines,
  matters,
  staff,
  onAddHearing,
  onAddDeadline,
  onToggleDeadline,
}) => {
  const [activeTab, setActiveTab] = useState<'hearings' | 'deadlines'>('hearings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddHearingOpen, setIsAddHearingOpen] = useState(false);
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);

  // New Hearing State
  const [hearingMatterId, setHearingMatterId] = useState(matters[0]?.id || '');
  const [courtForum, setCourtForum] = useState<CourtForum>('High Court (Commercial & Tax Division)');
  const [courtRoom, setCourtRoom] = useState('Courtroom 4, Milimani Law Courts');
  const [presidingJudge, setPresidingJudge] = useState('Hon. Lady Justice J. W. Kamau');
  const [hearingType, setHearingType] = useState<any>('Formal Hearing');
  const [hearingDate, setHearingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [hearingTime, setHearingTime] = useState('09:30 AM');
  const [advocateInCharge, setAdvocateInCharge] = useState(staff[0]?.name || 'David Kamau, SC');
  const [isVirtualCourt, setIsVirtualCourt] = useState(false);
  const [virtualCourtLink, setVirtualCourtLink] = useState('');
  const [hearingNotes, setHearingNotes] = useState('');

  // New Deadline State
  const [deadlineMatterId, setDeadlineMatterId] = useState(matters[0]?.id || '');
  const [deadlineTitle, setDeadlineTitle] = useState('');
  const [deadlineType, setDeadlineType] = useState<any>('Court Filing Deadline');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [assignedTo, setAssignedTo] = useState(staff[2]?.name || 'Brian Omondi Awori');
  const [priority, setPriority] = useState<TaskPriority>('urgent');
  const [deadlineNotes, setDeadlineNotes] = useState('');

  const handleCreateHearing = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = matters.find((m) => m.id === hearingMatterId) || matters[0];
    if (!matter) return;

    onAddHearing({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      courtForum,
      courtRoom,
      presidingJudge,
      hearingType,
      date: hearingDate,
      time: hearingTime,
      advocateInCharge,
      isVirtualCourt,
      virtualCourtLink: isVirtualCourt ? virtualCourtLink : undefined,
      notes: hearingNotes,
      status: 'upcoming',
    });

    setIsAddHearingOpen(false);
    setHearingNotes('');
  };

  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineTitle.trim()) return;
    const matter = matters.find((m) => m.id === deadlineMatterId) || matters[0];
    if (!matter) return;

    onAddDeadline({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      title: deadlineTitle,
      deadlineType,
      dueDate,
      assignedTo,
      priority,
      notes: deadlineNotes,
    });

    setIsAddDeadlineOpen(false);
    setDeadlineTitle('');
    setDeadlineNotes('');
  };

  const filteredHearings = hearings.filter((h) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.matterNumber.toLowerCase().includes(q) ||
      h.matterTitle.toLowerCase().includes(q) ||
      h.courtForum.toLowerCase().includes(q) ||
      h.presidingJudge.toLowerCase().includes(q)
    );
  });

  const filteredDeadlines = deadlines.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.matterNumber.toLowerCase().includes(q) ||
      d.matterTitle.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.assignedTo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Court Diary &amp; Statutory Deadlines Watch
          </h2>
          <p className="text-xs text-neutral-500">
            Track Milimani High Court, ELC, ELRC hearings, virtual Teams courtroom links, and statutory 14-day filing limitations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddHearingOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Docket Court Date</span>
          </button>
          <button
            onClick={() => setIsAddDeadlineOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Add Deadline</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('hearings')}
            className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'hearings'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Court Appearances &amp; Hearings ({hearings.length})
          </button>
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'deadlines'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Filing Deadlines &amp; Submissions ({deadlines.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search diary or matter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
          />
        </div>
      </div>

      {activeTab === 'hearings' ? (
        /* Hearings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHearings.map((h) => (
            <div
              key={h.id}
              className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                      {h.matterNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {h.hearingType}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white mt-1">
                    {h.matterTitle}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                    {h.date}
                  </div>
                  <div className="text-xs text-red-600 font-semibold">{h.time}</div>
                </div>
              </div>

              {/* Courtroom & Judge */}
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5">
                <div className="flex items-center space-x-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
                  <Gavel className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{h.courtForum}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{h.courtRoom}</span>
                </div>
                <div className="text-neutral-500 text-[11px]">
                  Presiding: <strong className="text-neutral-700 dark:text-neutral-300">{h.presidingJudge}</strong>
                </div>
              </div>

              {/* Virtual Link or Notes */}
              {h.isVirtualCourt && h.virtualCourtLink && (
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Virtual Session (Teams / Zoom)</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold underline cursor-pointer">
                    Join Link
                  </span>
                </div>
              )}

              {h.notes && (
                <p className="text-xs text-neutral-500 italic">
                  Counsel Instructions: {h.notes}
                </p>
              )}

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Advocate: <strong className="text-neutral-800 dark:text-neutral-200">{h.advocateInCharge}</strong></span>
                <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SMS Diary Alert Active</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Deadlines List */
        <div className="space-y-3">
          {filteredDeadlines.map((dl) => (
            <div
              key={dl.id}
              className={`p-4 rounded-xl border bg-white dark:bg-[#12151b] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                dl.isCompleted
                  ? 'border-neutral-200 dark:border-neutral-800 opacity-60'
                  : dl.priority === 'urgent'
                  ? 'border-red-200 dark:border-red-900/60'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <button
                  onClick={() => onToggleDeadline(dl.id)}
                  className={`mt-0.5 p-1 rounded-md border cursor-pointer transition-colors ${
                    dl.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-red-500'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        dl.priority === 'urgent'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                          : dl.priority === 'high'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {dl.priority}
                    </span>
                    <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                      {dl.matterNumber}
                    </span>
                    <h3
                      className={`text-sm font-bold ${
                        dl.isCompleted
                          ? 'line-through text-neutral-400'
                          : 'text-neutral-900 dark:text-white'
                      }`}
                    >
                      {dl.title}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-500">
                    Matter: {dl.matterTitle} • Assigned: <strong className="text-neutral-700 dark:text-neutral-300">{dl.assignedTo}</strong>
                  </p>
                  {dl.notes && <p className="text-[11px] text-neutral-400 italic">{dl.notes}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-red-600 block">
                    Due: {dl.dueDate}
                  </span>
                  <span className="text-[10px] text-neutral-400">{dl.deadlineType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Docket Court Hearing Modal */}
      {isAddHearingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Docket Court Hearing / Appearance
              </h3>
              <button
                onClick={() => setIsAddHearingOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHearing} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Select Matter Case File *
                </label>
                <select
                  value={hearingMatterId}
                  onChange={(e) => setHearingMatterId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.matterNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Court Forum *
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

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Hearing Nature
                  </label>
                  <select
                    value={hearingType}
                    onChange={(e) => setHearingType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="Formal Hearing">Formal Hearing</option>
                    <option value="Mention for Directions">Mention for Directions</option>
                    <option value="Ruling">Ruling</option>
                    <option value="Judgment">Judgment</option>
                    <option value="Pre-Trial Conference">Pre-Trial Conference</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={hearingDate}
                    onChange={(e) => setHearingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={hearingTime}
                    onChange={(e) => setHearingTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Courtroom / Division
                  </label>
                  <input
                    type="text"
                    value={courtRoom}
                    onChange={(e) => setCourtRoom(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Presiding Judge / Magistrate
                  </label>
                  <input
                    type="text"
                    value={presidingJudge}
                    onChange={(e) => setPresidingJudge(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Appearing Advocate
                </label>
                <select
                  value={advocateInCharge}
                  onChange={(e) => setAdvocateInCharge(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isVirtual"
                  checked={isVirtualCourt}
                  onChange={(e) => setIsVirtualCourt(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="isVirtual" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  Virtual Court Session (Microsoft Teams / Zoom)
                </label>
              </div>

              {isVirtualCourt && (
                <div>
                  <input
                    type="url"
                    placeholder="https://judiciary.go.ke/v/..."
                    value={virtualCourtLink}
                    onChange={(e) => setVirtualCourtLink(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddHearingOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Docket Hearing Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Deadline Modal */}
      {isAddDeadlineOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Record Statutory / Filing Deadline
              </h3>
              <button
                onClick={() => setIsAddDeadlineOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeadline} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Associated Matter *
                </label>
                <select
                  value={deadlineMatterId}
                  onChange={(e) => setDeadlineMatterId(e.target.value)}
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
                  Deadline Action Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. File Supplementary Affidavit or Pay Stamp Duty"
                  value={deadlineTitle}
                  onChange={(e) => setDeadlineTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Deadline Category
                  </label>
                  <select
                    value={deadlineType}
                    onChange={(e) => setDeadlineType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="Court Filing Deadline">Court Filing Deadline</option>
                    <option value="Statutory Limitation">Statutory Limitation</option>
                    <option value="Submissions Due">Submissions Due</option>
                    <option value="Client Response">Client Response</option>
                    <option value="Stamp Duty & Registry">Stamp Duty &amp; Registry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Assignee
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
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
                    Urgency Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeadlineOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Set Deadline Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
