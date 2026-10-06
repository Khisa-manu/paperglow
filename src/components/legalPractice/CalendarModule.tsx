import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Gavel,
  Clock,
  Users,
  Video,
  MapPin,
  CheckCircle2,
  Filter,
  Plus,
} from 'lucide-react';
import {
  CourtHearingEvent,
  LegalDeadline,
  ClientCommunication,
} from '../../types/legalPractice';

interface CalendarModuleProps {
  hearings: CourtHearingEvent[];
  deadlines: LegalDeadline[];
  communications: ClientCommunication[];
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({
  hearings,
  deadlines,
  communications,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'court' | 'deadlines' | 'meetings'>('all');

  // Combined agenda events
  const courtEvents = hearings.map((h) => ({
    id: `court-${h.id}`,
    date: h.date,
    time: h.time,
    title: `${h.matterNumber}: ${h.hearingType}`,
    subtitle: `${h.courtForum} • ${h.courtRoom}`,
    judge: h.presidingJudge,
    counsel: h.advocateInCharge,
    type: 'court' as const,
    isVirtual: h.isVirtualCourt,
  }));

  const deadlineEvents = deadlines.map((d) => ({
    id: `dl-${d.id}`,
    date: d.dueDate,
    time: '05:00 PM (Registry Close)',
    title: `Filing Deadline: ${d.title}`,
    subtitle: `Matter: ${d.matterNumber} (${d.matterTitle})`,
    judge: undefined,
    counsel: `Assigned: ${d.assignedTo}`,
    type: 'deadline' as const,
    isVirtual: false,
  }));

  const meetingEvents = communications
    .filter((c) => c.followUpDate)
    .map((c) => ({
      id: `comm-${c.id}`,
      date: c.followUpDate || '',
      time: '10:00 AM',
      title: `Client Follow-up: ${c.subject}`,
      subtitle: `Client: ${c.clientName} (${c.channel})`,
      judge: undefined,
      counsel: `Handler: ${c.advocateName}`,
      type: 'meeting' as const,
      isVirtual: c.channel === 'Phone Call' || c.channel === 'Email',
    }));

  const allAgenda = [...courtEvents, ...deadlineEvents, ...meetingEvents]
    .filter((ev) => {
      if (filterType === 'all') return true;
      if (filterType === 'court') return ev.type === 'court';
      if (filterType === 'deadlines') return ev.type === 'deadline';
      if (filterType === 'meetings') return ev.type === 'meeting';
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Master Practice Calendar &amp; Docket Schedule
          </h2>
          <p className="text-xs text-neutral-500">
            Unified schedule of court hearings, registry filing deadlines, arbitration meetings, and client case conferences.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            All Agenda ({allAgenda.length})
          </button>
          <button
            onClick={() => setFilterType('court')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'court'
                ? 'bg-red-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Court Dates ({courtEvents.length})
          </button>
          <button
            onClick={() => setFilterType('deadlines')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'deadlines'
                ? 'bg-amber-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Deadlines ({deadlineEvents.length})
          </button>
          <button
            onClick={() => setFilterType('meetings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'meetings'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Client Meetings ({meetingEvents.length})
          </button>
        </div>
      </div>

      {/* Agenda Timeline List */}
      <div className="space-y-3">
        {allAgenda.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border bg-white dark:bg-[#12151b] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
              item.type === 'court'
                ? 'border-red-200 dark:border-red-900/60'
                : item.type === 'deadline'
                ? 'border-amber-200 dark:border-amber-900/60'
                : 'border-blue-200 dark:border-blue-900/60'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <span
                className={`p-2.5 rounded-xl shrink-0 ${
                  item.type === 'court'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                    : item.type === 'deadline'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                }`}
              >
                {item.type === 'court' ? (
                  <Gavel className="w-5 h-5" />
                ) : item.type === 'deadline' ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Users className="w-5 h-5" />
                )}
              </span>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.type === 'court'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                        : item.type === 'deadline'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.subtitle}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 pt-0.5">
                  {item.judge && <span>Presiding: {item.judge}</span>}
                  <span>{item.counsel}</span>
                  {item.isVirtual && (
                    <span className="text-blue-600 font-semibold flex items-center space-x-1">
                      <Video className="w-3 h-3" />
                      <span>Virtual Link Attached</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 self-end md:self-auto">
              <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white block">
                {item.date}
              </span>
              <span className="text-xs text-neutral-500 font-medium">{item.time}</span>
            </div>
          </div>
        ))}

        {allAgenda.length === 0 && (
          <div className="py-12 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
            <CalendarIcon className="w-8 h-8 text-neutral-400 mx-auto" />
            <p>No calendar events matching this filter category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
