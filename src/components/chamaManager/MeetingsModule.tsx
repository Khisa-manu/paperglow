import React, { useState } from 'react';
import { Meeting, Member, GroupProfile } from '../../types/chamaManager';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  ListTodo,
  FileText,
  Users,
} from 'lucide-react';

interface MeetingsModuleProps {
  meetings: Meeting[];
  members: Member[];
  group: GroupProfile;
  onAddMeeting: (meeting: Omit<Meeting, 'id' | 'attendance'>) => void;
}

export const MeetingsModule: React.FC<MeetingsModuleProps> = ({
  meetings,
  members,
  group,
  onAddMeeting,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-11-21');
  const [newTime, setNewTime] = useState('14:00 - 17:00 EAT');
  const [newVenue, setNewVenue] = useState('PrideInn Westlands, Nairobi');
  const [newMeetingType, setNewMeetingType] = useState<Meeting['meetingType']>('Monthly General Meeting');
  const [newAgendaStr, setNewAgendaStr] = useState('1. Opening Prayers\n2. Confirmation of Previous Minutes\n3. Financial Statements Review\n4. Land Investments Update\n5. A.O.B');

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddMeeting({
      title: newTitle,
      date: newDate,
      time: newTime,
      venue: newVenue,
      meetingType: newMeetingType,
      status: 'scheduled',
      agenda: newAgendaStr.split('\n').filter((l) => l.trim().length > 0),
      actionItems: [],
    });

    setIsCreating(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-red-600" />
            <span>Meetings, Agendas &amp; Minutes Register</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Monthly physical &amp; virtual assemblies, roll call attendance, deliberations &amp; action items
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Create Meeting Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateMeeting}
            className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-lg w-full space-y-4"
          >
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Schedule Chama Assembly
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. November 2026 Monthly General Meeting"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Venue / Virtual Link
                </label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Agenda Items (one per line)
                </label>
                <textarea
                  rows={4}
                  value={newAgendaStr}
                  onChange={(e) => setNewAgendaStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm &amp; Notify Members
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meetings Cards */}
      <div className="space-y-6">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                    {meeting.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      meeting.status === 'scheduled'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="tabular-nums">{meeting.date} ({meeting.time})</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{meeting.venue}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Agenda List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-['Poppins'] text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                Deliberation Agenda:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {meeting.agenda.map((ag, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-start space-x-2 text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="font-bold text-red-600">{idx + 1}.</span>
                    <span>{ag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Minutes (if completed) */}
            {meeting.minutesSummary && (
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                  Adopted Minutes Summary:
                </span>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {meeting.minutesSummary}
                </p>
              </div>
            )}

            {/* Action Items (if any) */}
            {meeting.actionItems && meeting.actionItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-['Poppins'] text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                  Enforceable Action Items:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {meeting.actionItems.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            act.done ? 'text-emerald-600' : 'text-neutral-400'
                          }`}
                        />
                        <span className={act.done ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}>
                          {act.task}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        Assignee: <strong>{act.assignee}</strong> (Due {act.deadline})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
