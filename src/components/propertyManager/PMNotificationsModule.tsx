import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Send,
  Check,
  Trash2,
  Smartphone,
} from 'lucide-react';
import { PropertyNotification, Tenant } from '../../types/propertyManager';

interface PMNotificationsModuleProps {
  notifications: PropertyNotification[];
  tenants: Tenant[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onBroadcastRentReminders: () => void;
}

export const PMNotificationsModule: React.FC<PMNotificationsModuleProps> = ({
  notifications,
  tenants,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onBroadcastRentReminders,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'rent_reminder' | 'lease_expiry' | 'maintenance_update'>('all');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    setBroadcastFeedback(null);

    setTimeout(() => {
      onBroadcastRentReminders();
      setIsBroadcasting(false);
      const overdueCount = tenants.filter((t) => t.balanceKes > 0).length;
      setBroadcastFeedback(`Automated SMS & WhatsApp dispatch sent to ${overdueCount} tenants with outstanding rent!`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Batch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Automated Reminders &amp; Property Alerts
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Rent due reminders, expiring tenancy alerts, and contractor maintenance notifications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg cursor-pointer"
            >
              Mark All as Read
            </button>
          )}

          <button
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isBroadcasting ? 'Dispatching...' : 'Broadcast Rent Reminders'}</span>
          </button>
        </div>
      </div>

      {/* Broadcast Toast Banner */}
      {broadcastFeedback && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{broadcastFeedback}</span>
          </div>
          <button
            onClick={() => setBroadcastFeedback(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded font-medium cursor-pointer ${
            filterType === 'all'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('rent_reminder')}
          className={`px-3 py-1.5 rounded font-medium cursor-pointer ${
            filterType === 'rent_reminder'
              ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 font-semibold shadow-xs'
              : 'text-neutral-500'
          }`}
        >
          Rent Reminders
        </button>
        <button
          onClick={() => setFilterType('lease_expiry')}
          className={`px-3 py-1.5 rounded font-medium cursor-pointer ${
            filterType === 'lease_expiry'
              ? 'bg-white dark:bg-neutral-900 text-amber-700 dark:text-amber-400 font-semibold shadow-xs'
              : 'text-neutral-500'
          }`}
        >
          Lease Expiries
        </button>
        <button
          onClick={() => setFilterType('maintenance_update')}
          className={`px-3 py-1.5 rounded font-medium cursor-pointer ${
            filterType === 'maintenance_update'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500'
          }`}
        >
          Maintenance
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 text-xs">
            No active alerts under this category.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                notif.read
                  ? 'opacity-70 bg-transparent'
                  : 'bg-red-50/20 dark:bg-red-950/10'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    notif.type === 'rent_reminder'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                      : notif.type === 'lease_expiry'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                  }`}
                >
                  {notif.type === 'rent_reminder' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : notif.type === 'lease_expiry' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Wrench className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-neutral-400 block pt-0.5">
                    {notif.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {!notif.read && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded cursor-pointer"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteNotification(notif.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
