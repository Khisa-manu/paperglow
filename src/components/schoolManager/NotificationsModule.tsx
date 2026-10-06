import React, { useState } from 'react';
import { SchoolNotification, SchoolModule } from '../../types/schoolManager';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Calendar,
  DollarSign,
  Filter,
} from 'lucide-react';

interface NotificationsModuleProps {
  notifications: SchoolNotification[];
  onMarkAsRead: (id: string) => void;
  onNavigateModule: (module: SchoolModule) => void;
  onSendSmsReminderToDebtors: () => void;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({
  notifications,
  onMarkAsRead,
  onNavigateModule,
  onSendSmsReminderToDebtors,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    return filterType === 'all' || n.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Notifications, Deadlines &amp; Reminder Center
          </h1>
          <p className="text-xs text-neutral-500">
            Automated alerts for fee arrears, attendance exceptions, exam timetables and parent notifications
          </p>
        </div>

        <button
          onClick={onSendSmsReminderToDebtors}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Fee Arrears SMS Reminder</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-neutral-500">Alert Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
          >
            <option value="all">All Alerts &amp; Notifications</option>
            <option value="fee_reminder">Fee Arrears Reminders</option>
            <option value="attendance_alert">Attendance Exceptions</option>
            <option value="exam_countdown">Exam Deadlines</option>
            <option value="circular">Parent Circulars</option>
          </select>
        </div>

        <span className="text-neutral-400 font-mono text-[11px]">
          {notifications.filter((n) => !n.isRead).length} unread alerts
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
              notif.isRead
                ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] opacity-80'
                : 'border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0 mt-0.5">
                {notif.type === 'fee_reminder' && (
                  <DollarSign className="w-4 h-4 text-amber-500" />
                )}
                {notif.type === 'attendance_alert' && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                {notif.type === 'exam_countdown' && (
                  <Calendar className="w-4 h-4 text-blue-500" />
                )}
                {notif.type === 'circular' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {notif.title}
                  </h3>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                      notif.priority === 'urgent'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {notif.priority}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {notif.message}
                </p>

                <div className="text-[10px] text-neutral-400 font-mono pt-1">
                  Generated: {notif.date}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onNavigateModule(notif.linkModule)}
                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer"
              >
                Go to Module
              </button>
              {!notif.isRead && (
                <button
                  onClick={() => onMarkAsRead(notif.id)}
                  className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
