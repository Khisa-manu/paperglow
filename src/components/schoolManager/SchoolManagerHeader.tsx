import React, { useState } from 'react';
import { SchoolSettings, SchoolNotification, SchoolModule } from '../../types/schoolManager';
import {
  GraduationCap,
  Search,
  Bell,
  Sun,
  Moon,
  ArrowLeft,
  UserPlus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Menu,
} from 'lucide-react';

interface SchoolManagerHeaderProps {
  settings: SchoolSettings;
  notifications: SchoolNotification[];
  onOpenAdmitStudent: () => void;
  onNavigateModule: (module: SchoolModule) => void;
  onToggleMobileSidebar: () => void;
  onBackToPaperglow: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const SchoolManagerHeader: React.FC<SchoolManagerHeaderProps> = ({
  settings,
  notifications,
  onOpenAdmitStudent,
  onNavigateModule,
  onToggleMobileSidebar,
  onBackToPaperglow,
  isDark,
  onToggleDarkMode,
}) => {
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#12141a]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + School Brand & Identity */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onBackToPaperglow}
            className="flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors cursor-pointer mr-1 hidden sm:flex"
            title="Return to Paperglow Suite Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal</span>
          </button>

          <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

          {/* School Badge / Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 font-['Poppins'] tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
                  {settings.schoolName}
                </span>
                <span className="hidden xl:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40">
                  {settings.currentTerm} • {settings.academicYear}
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:flex items-center space-x-2">
                <span>NEMIS: {settings.nemisCode}</span>
                <span>•</span>
                <span>KNEC: {settings.knecCenterCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Search shortcut banner */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              readOnly
              onClick={() => onNavigateModule('students')}
              placeholder="Search students, teachers, admission #..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 cursor-pointer focus:outline-none hover:border-neutral-300 dark:hover:border-neutral-700"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Admit Student Button */}
          <button
            onClick={onOpenAdmitStudent}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admit Student</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="View School Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden z-50">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      School Alerts &amp; Circulars
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      onNavigateModule('notifications');
                      setIsNotifDropdownOpen(false);
                    }}
                    className="text-[11px] text-red-600 dark:text-red-400 font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onNavigateModule(notif.linkModule);
                        setIsNotifDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-2.5">
                        <div className="mt-0.5">
                          {notif.type === 'fee_reminder' && (
                            <DollarSign className="w-4 h-4 text-amber-500" />
                          )}
                          {notif.type === 'attendance_alert' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {notif.type === 'exam_countdown' && (
                            <Calendar className="w-4 h-4 text-blue-500" />
                          )}
                          {notif.type === 'circular' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-neutral-400 mt-1 block">
                            {notif.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
