import React, { useState } from 'react';
import { ClinicNotification, Patient, ClinicProfile } from '../../types/clinicManager';
import {
  Bell,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CreditCard,
  Trash2,
  Clock,
} from 'lucide-react';

interface NotificationsModuleProps {
  notifications: ClinicNotification[];
  patients: Patient[];
  clinic: ClinicProfile;
  onSendNotification: (notif: Omit<ClinicNotification, 'id' | 'isRead'>) => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({
  notifications,
  patients,
  clinic,
  onSendNotification,
  onMarkAsRead,
  onDeleteNotification,
}) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ClinicNotification['type']>('announcement');
  const [targetRole, setTargetRole] = useState('all');
  const [toastSent, setToastSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSendNotification({
      title: title.trim(),
      message: message.trim(),
      type,
      targetRole,
      date: new Date().toISOString().split('T')[0],
    });

    setIsComposeOpen(false);
    setTitle('');
    setMessage('');
    setToastSent(true);
    setTimeout(() => setToastSent(false), 3000);
  };

  const handleTriggerAppointmentReminder = () => {
    onSendNotification({
      title: 'Appointment Recall & Confirmation',
      message: `Dear Patient, your upcoming clinical consultation at ${clinic.name} is confirmed. Please arrive 15 minutes before your time slot for nurse triage.`,
      type: 'appointment',
      targetRole: 'all',
      date: new Date().toISOString().split('T')[0],
    });
    setToastSent(true);
    setTimeout(() => setToastSent(false), 3000);
  };

  const handleTriggerPaymentReminder = () => {
    onSendNotification({
      title: 'Outstanding Invoice Copay Notice',
      message: `Kindly note that pending consultation or laboratory fees can be cleared via M-Pesa Paybill ${clinic.mpesaPaybill}, Account Number: (Your CLN Patient ID).`,
      type: 'payment',
      targetRole: 'all',
      date: new Date().toISOString().split('T')[0],
    });
    setToastSent(true);
    setTimeout(() => setToastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-red-600" />
            <span>Reminders, Follow-Ups &amp; SMS Broadcasts</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Dispatch appointment confirmations, post-consultation follow-up calls, copay reminders and clinical announcements
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Notice</span>
        </button>
      </div>

      {toastSent && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Notice successfully dispatched and recorded in logs.</span>
        </div>
      )}

      {/* Preset Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-bold">
            <Calendar className="w-4 h-4 text-red-600" />
            <span>Appointment Reminder Broadcast</span>
          </div>
          <p className="text-neutral-500 text-[11px]">
            Send automated reminder to all patients with consultations scheduled within 24 hours.
          </p>
          <button
            onClick={handleTriggerAppointmentReminder}
            className="w-full py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-200 cursor-pointer"
          >
            Dispatch Appointment SMS
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-bold">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>M-Pesa Copay &amp; Bill Reminders</span>
          </div>
          <p className="text-neutral-500 text-[11px]">
            Notify patients with unsettled balances exceeding KES 1,000 with Paybill details.
          </p>
          <button
            onClick={handleTriggerPaymentReminder}
            className="w-full py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-200 cursor-pointer"
          >
            Dispatch Payment Alert
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-bold">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Follow-Up Review Calls</span>
          </div>
          <p className="text-neutral-500 text-[11px]">
            Flag patients with review dates due this week for nursing triage phone calls.
          </p>
          <button
            onClick={() => {
              onSendNotification({
                title: 'Chronic Illness Review Due',
                message: 'Patient follow-up list prepared for hypertensive & diabetic quarterly reviews.',
                type: 'followup',
                targetRole: 'Doctor / Physician',
                date: new Date().toISOString().split('T')[0],
              });
              setToastSent(true);
            }}
            className="w-full py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-200 cursor-pointer"
          >
            Flag Review Patients
          </button>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Dispatched Clinical Notices Feed ({notifications.length})
          </h3>
          <span className="text-xs text-neutral-500">Real-time gateway log</span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 flex items-start justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-bold text-xs ${
                      n.type === 'payment'
                        ? 'text-amber-600'
                        : n.type === 'appointment'
                        ? 'text-red-600'
                        : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  >
                    {n.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">({n.date})</span>
                  <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    Audience: {n.targetRole}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                  {n.message}
                </p>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => onMarkAsRead(n.id)}
                    className="p-1 rounded text-neutral-400 hover:text-emerald-600 cursor-pointer"
                    title="Mark as Read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteNotification(n.id)}
                  className="p-1 rounded text-neutral-400 hover:text-red-600 cursor-pointer"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSend}
            className="bg-white dark:bg-[#11141a] rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl text-xs"
          >
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Compose Clinical Broadcast Notice
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Notice Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Saturday Special Pediatric Clinic"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="appointment">Appointment Reminder</option>
                    <option value="payment">Payment Notice</option>
                    <option value="followup">Follow-up Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <option value="all">All Patients &amp; Staff</option>
                    <option value="Doctor / Physician">Doctors Only</option>
                    <option value="Receptionist">Reception Desk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Message Text *</label>
                <textarea
                  rows={3}
                  placeholder="Enter message text..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Dispatch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
