import React, { useState } from 'react';
import { SchoolEvent } from '../../types/schoolManager';
import { Calendar, Plus, MapPin, Users, Tag, Clock, Check, X } from 'lucide-react';

interface EventsModuleProps {
  events: SchoolEvent[];
  onAddEvent: (event: Omit<SchoolEvent, 'id'>) => void;
}

export const EventsModule: React.FC<EventsModuleProps> = ({ events, onAddEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<SchoolEvent['eventType']>('Academic');
  const [startDate, setStartDate] = useState('2026-03-15');
  const [endDate, setEndDate] = useState('2026-03-15');
  const [location, setLocation] = useState('School Main Assembly Hall');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('Dean of Studies');
  const [isPublic, setIsPublic] = useState(true);

  const filtered = events.filter((e) => {
    return filterType === 'all' || e.eventType === filterType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title: title.trim(),
      eventType,
      startDate,
      endDate: endDate || startDate,
      location: location.trim(),
      description: description.trim(),
      organizer: organizer.trim(),
      isPublic,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            School Calendar, Term Dates &amp; Events
          </h1>
          <p className="text-xs text-neutral-500">
            Parent conferences, sports days, midterm breaks and national examination calendars
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Calendar Event</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Event Category:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="Academic">Academic</option>
            <option value="Sports & Co-Curricular">Sports &amp; Athletics</option>
            <option value="Parents Meeting">Parents &amp; AGM</option>
            <option value="Holiday / Break">School Breaks &amp; Holidays</option>
            <option value="Examination">Examinations</option>
          </select>
        </div>

        <span className="text-neutral-400 font-mono text-[11px]">
          {filtered.length} scheduled fixtures in 2026 Academic Calendar
        </span>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                  {ev.eventType}
                </span>

                <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{ev.startDate}</span>
                </span>
              </div>

              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                {ev.title}
              </h2>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {ev.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{ev.location}</span>
              </div>
              <span className="text-[11px] font-medium text-neutral-400">
                Organized by: {ev.organizer}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Event */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#14171d] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Add Calendar Event
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Form 4 Chemistry Practical Mock Rehearsal"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports & Co-Curricular">Sports &amp; Co-Curricular</option>
                    <option value="Parents Meeting">Parents Meeting</option>
                    <option value="Holiday / Break">Holiday / Break</option>
                    <option value="Examination">Examination</option>
                    <option value="National Contest">National Contest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Science Complex Lab 1"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Organizing Department
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. Games Department"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of the event..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
