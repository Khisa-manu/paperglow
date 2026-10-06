import React, { useState } from 'react';
import { SchoolAnnouncement } from '../../types/schoolManager';
import {
  MessageSquare,
  Plus,
  Send,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Bell,
  Users,
  Search,
} from 'lucide-react';

interface CommunicationModuleProps {
  announcements: SchoolAnnouncement[];
  onAddAnnouncement: (announcement: Omit<SchoolAnnouncement, 'id'>) => void;
  onSendSmsBroadcast: (announcementId: string) => void;
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({
  announcements,
  onAddAnnouncement,
  onSendSmsBroadcast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SchoolAnnouncement['category']>('Academic');
  const [audience, setAudience] = useState<SchoolAnnouncement['audience']>('All Parents');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Dr. Josephat M. Kariuki (Principal)');
  const [isUrgent, setIsUrgent] = useState(false);
  const [sendSms, setSendSms] = useState(true);

  const filtered = announcements.filter((a) => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddAnnouncement({
      title: title.trim(),
      category,
      audience,
      publishedDate: new Date().toISOString().split('T')[0],
      content: content.trim(),
      authorName: authorName.trim(),
      isUrgent,
      smsSent: sendSms,
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            School Communications, Circulars &amp; SMS Broadcasts
          </h1>
          <p className="text-xs text-neutral-500">
            Official announcements, parent notices, term opening circulars and bulk SMS dispatch
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice / Circular</span>
        </button>
      </div>

      {/* SMS Gateway Simulated Metric Banner */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-neutral-900 dark:text-neutral-100">
              Bulk SMS Sender ID: <span className="font-mono text-red-600">HILLVIEW</span>
            </div>
            <div className="text-[11px] text-neutral-500">
              Integrated with Safaricom &amp; Airtel Kenya Telecommunications Gateway • 4,820 SMS Credits Remaining
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>SMS Gateway Connected</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars and notices..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <option value="all">All Notice Categories</option>
            <option value="Academic">Academic</option>
            <option value="Fees & Finance">Fees &amp; Finance</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ann.isUrgent
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {ann.category}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  Audience: <span className="font-bold text-neutral-700 dark:text-neutral-300">{ann.audience}</span>
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-neutral-400">
                <span className="font-mono text-[11px]">{ann.publishedDate}</span>
                {ann.smsSent && (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold text-[10px] flex items-center space-x-1">
                    <Smartphone className="w-3 h-3" />
                    <span>SMS Dispatched</span>
                  </span>
                )}
              </div>
            </div>

            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              {ann.title}
            </h2>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px]">
                Authorized by: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{ann.authorName}</span>
              </span>

              {!ann.smsSent && (
                <button
                  onClick={() => onSendSmsBroadcast(ann.id)}
                  className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send via SMS Broadcast</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Publish Notice */}
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
                Publish School Circular / Parent Notice
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
                  Circular Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. End of Term Closing Arrangements & Transport"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Fees & Finance">Fees &amp; Finance</option>
                    <option value="Event">Event</option>
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="All Parents">All Parents &amp; Guardians</option>
                    <option value="Teachers & Staff">Faculty &amp; Staff</option>
                    <option value="Boarding Parents">Boarding Parents Only</option>
                    <option value="Form 4 & Grade 9 Candidates">Candidate Parents</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Author / Issuing Office
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Principal or Deputy Principal"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-medium">
                  Circular Content / Body *
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft official school communication..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Dispatch SMS Broadcast to Registered Parents
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span className="font-bold text-red-600">Urgent Notice</span>
                </label>
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
