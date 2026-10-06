import React, { useState } from 'react';
import { ChamaNotification, Member, GroupProfile } from '../../types/chamaManager';
import {
  Bell,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  Trash2,
} from 'lucide-react';

interface NotificationsModuleProps {
  notifications: ChamaNotification[];
  members: Member[];
  group: GroupProfile;
  onSendNotification: (notif: Omit<ChamaNotification, 'id' | 'isRead'>) => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({
  notifications,
  members,
  group,
  onSendNotification,
  onMarkAsRead,
  onDeleteNotification,
}) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ChamaNotification['type']>('announcement');
  const [toastSent, setToastSent] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSendNotification({
      title,
      message,
      type,
      date: new Date().toISOString().split('T')[0],
      targetRole: 'all',
    });

    setIsBroadcasting(false);
    setTitle('');
    setMessage('');
    setToastSent(true);
    setTimeout(() => setToastSent(false), 3000);
  };

  const handleTriggerContributionReminder = () => {
    onSendNotification({
      title: 'October Monthly Contribution Reminder',
      message: `Dear Member, kindly settle your monthly savings of KES ${group.monthlyContributionKes.toLocaleString()} and Welfare KES ${group.monthlyWelfareKes.toLocaleString()} to Paybill ${group.mpesaPaybill}, Account ${group.mpesaAccountNumber}.`,
      type: 'contribution_reminder',
      date: new Date().toISOString().split('T')[0],
      targetRole: 'all',
    });
    setToastSent(true);
    setTimeout(() => setToastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-red-600" />
            <span>Reminders, Circulars &amp; SMS Broadcasts</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Dispatch monthly contribution alerts, meeting summons, and urgent bereavement circulars
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleTriggerContributionReminder}
            className="px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          >
            Trigger M-Pesa Reminder SMS
          </button>

          <button
            onClick={() => setIsBroadcasting(true)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send New Broadcast</span>
          </button>
        </div>
      </div>

      {toastSent && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Broadcast dispatched to {members.length} registered member phone numbers.</span>
        </div>
      )}

      {/* Broadcast Modal */}
      {isBroadcasting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleBroadcast}
            className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Compose Member Announcement
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Circular Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. October Meeting Agenda &amp; Venue Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Notification Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ChamaNotification['type'])}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                >
                  <option value="announcement">General Announcement</option>
                  <option value="contribution_reminder">Contribution Due Reminder</option>
                  <option value="meeting">Meeting Assembly Summons</option>
                  <option value="loan_due">Loan Due Notice</option>
                  <option value="welfare">Welfare Benevolent Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Message Content (Dispatched via App &amp; SMS)
                </label>
                <textarea
                  rows={4}
                  placeholder="Type clear notice instructions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBroadcasting(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Dispatch Circular
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
              n.isRead
                ? 'bg-white dark:bg-[#11141a] border-neutral-200 dark:border-neutral-800'
                : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-xs font-['Poppins']">
                  {n.title}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase">
                  {n.type.replace('_', ' ')}
                </span>
                {!n.isRead && (
                  <span className="text-[10px] font-bold text-red-600">● Unread</span>
                )}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {n.message}
              </p>
              <span className="text-[10px] text-neutral-400 block pt-1">
                Dispatched {n.date}
              </span>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {!n.isRead && (
                <button
                  onClick={() => onMarkAsRead(n.id)}
                  className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                >
                  Mark Read
                </button>
              )}
              <button
                onClick={() => onDeleteNotification(n.id)}
                className="text-neutral-400 hover:text-red-600 p-1"
                title="Delete Notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
