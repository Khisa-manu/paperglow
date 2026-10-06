import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react';
import { StaffMember, TicketNotification } from '../../types/ticketing';
import { CloudSyncIndicator } from '../ui/CloudSyncIndicator';

interface TicketingHeaderProps {
  currentModule: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  staffMembers: StaffMember[];
  currentStaffId: string;
  onSelectCurrentStaff: (staffId: string) => void;
  notifications: TicketNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenCreateTicket: () => void;
  onNavigateTicketDetail: (ticketId: string) => void;
  onBackToPortal: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  isCloudSyncing?: boolean;
  isCloudOnline?: boolean;
  onManualSync?: () => void;
}

export const TicketingHeader: React.FC<TicketingHeaderProps> = ({
  currentModule,
  searchQuery,
  onSearchChange,
  staffMembers,
  currentStaffId,
  onSelectCurrentStaff,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenCreateTicket,
  onNavigateTicketDetail,
  onBackToPortal,
  isDark,
  toggleDarkMode,
  isCloudSyncing,
  isCloudOnline,
  onManualSync,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const currentStaff = staffMembers.find((s) => s.id === currentStaffId) || staffMembers[0];

  const getModuleTitle = (mod: string) => {
    switch (mod) {
      case 'dashboard':
        return 'Executive Support Dashboard';
      case 'tickets':
        return 'Support Ticket Queue';
      case 'ticket_detail':
        return 'Ticket Conversation & Details';
      case 'customers':
        return 'Customer Directory & Accounts';
      case 'team':
        return 'Staff Roster & Workload Overview';
      case 'categories':
        return 'Ticket Categories & Routing';
      case 'sla':
        return 'SLA Deadlines & Escalation Policies';
      case 'knowledge_base':
        return 'Knowledge Base & Help Articles';
      case 'reports':
        return 'Support Analytics & SLA Reports';
      default:
        return 'Paperglow Ticketing';
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#12151b] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left Area: Context & Search */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-xl">
        <button
          onClick={onBackToPortal}
          title="Return to Paperglow Suite"
          className="text-neutral-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Paperglow Suite</span>
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets, subject, customer, or SKU..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all"
          />
        </div>
      </div>

      {/* Right Area: Actions, SLA Health, Notifications, Staff & Dark Mode */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <CloudSyncIndicator
          appName="Ticketing System"
          isSyncing={isCloudSyncing}
          isOnline={isCloudOnline}
          onManualSync={onManualSync}
        />

        {/* SLA Health Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded text-xs text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold tabular-nums">96.4%</span>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">SLA Adherence</span>
        </div>

        {/* Primary Action: New Ticket */}
        <button
          onClick={onOpenCreateTicket}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Ticket</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-[#12151b]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[11px] px-1.5 py-0.2 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-500">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.ticketId) {
                          onNavigateTicketDetail(notif.ticketId);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3 hover:bg-neutral-50 dark:hover:bg-[#202530] transition-colors cursor-pointer flex items-start space-x-3 ${
                        !notif.isRead ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'overdue' ? (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        ) : notif.type === 'new_ticket' ? (
                          <Plus className="w-4 h-4 text-blue-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-neutral-400 mt-1 block tabular-nums">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Staff Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
            className="flex items-center space-x-2 p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
          >
            <img
              src={currentStaff.avatar}
              alt={currentStaff.name}
              className="w-7 h-7 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                {currentStaff.name}
              </p>
              <p className="text-[10px] text-neutral-500 leading-tight">{currentStaff.role}</p>
            </div>
          </button>

          {isStaffMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-50 p-2">
              <p className="text-[11px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                Switch Active Agent
              </p>
              {staffMembers.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => {
                    onSelectCurrentStaff(staff.id);
                    setIsStaffMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 p-2 rounded text-left transition-colors cursor-pointer ${
                    staff.id === currentStaffId
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <img src={staff.avatar} alt={staff.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{staff.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{staff.role}</p>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      staff.status === 'online'
                        ? 'bg-emerald-500'
                        : staff.status === 'busy'
                        ? 'bg-amber-500'
                        : 'bg-neutral-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
