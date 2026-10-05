import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FileText,
  CheckSquare,
  AlertCircle,
  X,
  UserCheck,
  ChevronDown,
  Edit2,
} from 'lucide-react';
import { PartyEvent, PartyBranch, EventType, ActionItem } from '../../types/partyManager';

interface PartyEventsModuleProps {
  events: PartyEvent[];
  branches: PartyBranch[];
  onAddEvent: (event: PartyEvent) => void;
  onUpdateEvent: (event: PartyEvent) => void;
}

export const PartyEventsModule: React.FC<PartyEventsModuleProps> = ({
  events,
  branches,
  onAddEvent,
  onUpdateEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<PartyEvent | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // New Event Form State
  const [eventForm, setEventForm] = useState<{
    title: string;
    eventType: EventType;
    date: string;
    time: string;
    venue: string;
    branchId: string;
    attendeesExpected: number;
    agendaInput: string;
  }>({
    title: '',
    eventType: 'branch_agm',
    date: '2025-04-15',
    time: '10:00 AM - 02:00 PM',
    venue: 'County Secretariat Hall',
    branchId: branches[0]?.id || 'branch-nbi',
    attendeesExpected: 80,
    agendaInput: 'Opening Remarks & Prayers\nAdoption of Previous Minutes\nBranch Financial Report\nElection of Delegates',
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const agendaItems = eventForm.agendaInput
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const newEvent: PartyEvent = {
      id: `evt-${Date.now()}`,
      title: eventForm.title,
      eventType: eventForm.eventType,
      date: eventForm.date,
      time: eventForm.time,
      venue: eventForm.venue,
      branchId: eventForm.branchId,
      attendeesExpected: Number(eventForm.attendeesExpected),
      attendeesRecorded: 0,
      status: 'upcoming',
      agendaItems,
      actionItems: [],
    };

    onAddEvent(newEvent);
    setIsScheduleModalOpen(false);
    setSelectedEvent(newEvent);
  };

  const handleToggleActionItem = (eventId: string, actionId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const updatedActionItems = targetEvent.actionItems.map((item) => {
      if (item.id === actionId) {
        return {
          ...item,
          status: (item.status === 'done' ? 'pending' : 'done') as 'done' | 'pending',
        };
      }
      return item;
    });

    const updatedEvent = { ...targetEvent, actionItems: updatedActionItems };
    onUpdateEvent(updatedEvent);
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(updatedEvent);
    }
  };

  const handleAddActionItem = (eventId: string, task: string, owner: string, deadline: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent || !task) return;

    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      task,
      owner,
      deadline,
      status: 'pending',
    };

    const updatedEvent = {
      ...targetEvent,
      actionItems: [...targetEvent.actionItems, newItem],
    };
    onUpdateEvent(updatedEvent);
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(updatedEvent);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.eventType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600" />
            Statutory Assemblies, AGMs & Committee Meetings
          </h2>
          <p className="text-xs text-slate-500">
            Internal meeting agendas, quorum verification, and action item resolutions
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Assembly</span>
        </button>
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
          All Sessions ({events.length})
        </button>
        <button
          onClick={() => setFilterType('national_nec')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'national_nec'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          National NEC
        </button>
        <button
          onClick={() => setFilterType('branch_agm')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'branch_agm'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Regional AGMs
        </button>
        <button
          onClick={() => setFilterType('caucuses')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'caucuses'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Leagues & Caucuses
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredEvents.map((evt) => {
          const isCompleted = evt.status === 'completed';
          const branchName =
            branches.find((b) => b.id === evt.branchId)?.name || 'National Headquarters';

          return (
            <div
              key={evt.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-red-100 text-red-800">
                      {evt.eventType.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{evt.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {evt.date} • {evt.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Expected: <strong>{evt.attendeesExpected} Delegates</strong>
                      {isCompleted && (
                        <span className="text-emerald-700 ml-1">
                          (Quorum Met: {evt.attendeesRecorded} Present)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Agendas preview */}
                {evt.agendaItems && evt.agendaItems.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div className="font-semibold text-slate-800 mb-1.5">Agenda Items:</div>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {evt.agendaItems.map((agenda, idx) => (
                        <li key={idx} className="line-clamp-1">{agenda}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items status */}
                {evt.actionItems && evt.actionItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-red-600" />
                      <span>Action Items ({evt.actionItems.filter((a) => a.status === 'done').length}/{evt.actionItems.length} Resolved)</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">{branchName}</span>
                <button
                  onClick={() => setSelectedEvent(evt)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Manage Session & Minutes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assembly Details, Attendance & Action Items Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  {selectedEvent.eventType.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedEvent.title}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span>{selectedEvent.date}</span> • <span>{selectedEvent.venue}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attendance & Quorum Verification Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Delegate Attendance & Quorum
                </span>
                <span className="font-semibold text-slate-700">
                  {selectedEvent.attendeesRecorded} / {selectedEvent.attendeesExpected} Present
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    const updated = {
                      ...selectedEvent,
                      attendeesRecorded: Math.min(
                        selectedEvent.attendeesExpected,
                        selectedEvent.attendeesRecorded + 1
                      ),
                    };
                    onUpdateEvent(updated);
                    setSelectedEvent(updated);
                  }}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                >
                  + Record Attendee
                </button>
                <button
                  onClick={() => {
                    const updated = {
                      ...selectedEvent,
                      status:
                        selectedEvent.status === 'completed'
                          ? ('upcoming' as const)
                          : ('completed' as const),
                      attendeesRecorded:
                        selectedEvent.status === 'upcoming'
                          ? selectedEvent.attendeesExpected
                          : selectedEvent.attendeesRecorded,
                    };
                    onUpdateEvent(updated);
                    setSelectedEvent(updated);
                  }}
                  className="px-2.5 py-1 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900"
                >
                  Mark Session {selectedEvent.status === 'completed' ? 'Upcoming' : 'Completed'}
                </button>
              </div>
            </div>

            {/* Agendas list */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Formal Agendas</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedEvent.agendaItems.map((agenda, i) => (
                  <li
                    key={i}
                    className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2"
                  >
                    <span className="font-bold text-red-600">{i + 1}.</span>
                    <span>{agenda}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Minutes Summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Official Deliberation Minutes
              </h4>
              <textarea
                rows={3}
                value={selectedEvent.minutesSummary || ''}
                placeholder="Record recorded resolutions, voting tallies, and executive directives..."
                onChange={(e) => {
                  const updated = { ...selectedEvent, minutesSummary: e.target.value };
                  setSelectedEvent(updated);
                  onUpdateEvent(updated);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-red-500 focus:outline-hidden"
              />
            </div>

            {/* Action Items Manager */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Resolutions & Action Items Checklist
                </h4>
              </div>

              <div className="space-y-2 mb-3">
                {selectedEvent.actionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleActionItem(selectedEvent.id, item.id)}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.status === 'done'}
                        onChange={() => {}}
                        className="rounded text-red-600 focus:ring-0 cursor-pointer"
                      />
                      <span
                        className={
                          item.status === 'done'
                            ? 'line-through text-slate-400 font-normal'
                            : 'text-slate-800 font-medium'
                        }
                      >
                        {item.task}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 shrink-0 text-right">
                      <div>Assigned: {item.owner}</div>
                      <div className="text-slate-400">Due: {item.deadline}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Action Item Mini-Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const taskInput = (form.elements.namedItem('task') as HTMLInputElement).value;
                  const ownerInput = (form.elements.namedItem('owner') as HTMLInputElement).value;
                  const deadlineInput = (form.elements.namedItem('deadline') as HTMLInputElement).value;
                  handleAddActionItem(selectedEvent.id, taskInput, ownerInput, deadlineInput);
                  form.reset();
                }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-100"
              >
                <input
                  type="text"
                  name="task"
                  placeholder="New resolution task..."
                  required
                  className="sm:col-span-2 px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
                />
                <input
                  type="text"
                  name="owner"
                  placeholder="Task owner..."
                  required
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
                />
                <input
                  type="date"
                  name="deadline"
                  defaultValue="2025-04-01"
                  required
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
                />
                <div className="sm:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                  >
                    + Add Action Item
                  </button>
                </div>
              </form>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Schedule Party Meeting or Assembly
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. County Delegates Consultative Conference"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Type</label>
                  <select
                    value={eventForm.eventType}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, eventType: e.target.value as EventType })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="national_nec">National Executive Committee (NEC)</option>
                    <option value="branch_agm">Regional Branch AGM</option>
                    <option value="caucuses">Leagues / Caucus Session</option>
                    <option value="committee_session">Statutory Committee Session</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organizing Branch</label>
                  <select
                    value={eventForm.branchId}
                    onChange={(e) => setEventForm({ ...eventForm, branchId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Venue / Physical Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Hotel, Boardroom, Civic Centre"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Delegates</label>
                  <input
                    type="number"
                    required
                    value={eventForm.attendeesExpected}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, attendeesExpected: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Agendas (One per line)
                </label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.agendaInput}
                  onChange={(e) => setEventForm({ ...eventForm, agendaInput: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Publish & Gazetted Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
