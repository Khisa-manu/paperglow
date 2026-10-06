import React, { useState } from 'react';
import { GroupProfile, ChamaNotification, ChamaModule } from '../../types/chamaManager';
import {
  Users2,
  Bell,
  Sun,
  Moon,
  ArrowLeft,
  Plus,
  CreditCard,
  FileCheck,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';

interface ChamaHeaderProps {
  group: GroupProfile;
  notifications: ChamaNotification[];
  onOpenAddMember: () => void;
  onOpenRecordContribution: () => void;
  onOpenApplyLoan: () => void;
  onNavigateModule: (module: ChamaModule) => void;
  onToggleMobileSidebar: () => void;
  onBackToPaperglow: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const ChamaHeader: React.FC<ChamaHeaderProps> = ({
  group,
  notifications,
  onOpenAddMember,
  onOpenRecordContribution,
  onOpenApplyLoan,
  onNavigateModule,
  onToggleMobileSidebar,
  onBackToPaperglow,
  isDark,
  onToggleDarkMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f1115]/95 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Brand Identity */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              onClick={onBackToPaperglow}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors mr-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paperglow Home</span>
            </button>

            <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-sm sm:text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tracking-tight leading-none">
                    {group.name}
                  </h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                    KES Chama
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden md:block">
                  Reg: {group.registrationNumber} · Co-op Bank &amp; M-Pesa Paybill {group.mpesaPaybill}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions, Notifications & Theme */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={onOpenRecordContribution}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Contribution</span>
              </button>

              <button
                onClick={onOpenApplyLoan}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-red-600" />
                <span>Apply Loan</span>
              </button>

              <button
                onClick={onOpenAddMember}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-500" />
                <span>Add Member</span>
              </button>
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-neutral-900" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                      Chama Notifications ({unreadCount} unread)
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          setShowNotifications(false);
                          onNavigateModule('notifications');
                        }}
                        className="p-3 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-neutral-400">{notif.date}</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-[11px] line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigateModule('notifications');
                      }}
                      className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                    >
                      View all reminders &amp; announcements
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
