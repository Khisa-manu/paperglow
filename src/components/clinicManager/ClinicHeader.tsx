import React from 'react';
import { ClinicProfile, ClinicNotification, ClinicModule } from '../../types/clinicManager';
import {
  Stethoscope,
  Bell,
  Plus,
  CalendarPlus,
  UserPlus,
  Users,
  Moon,
  Sun,
  Menu,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ClinicHeaderProps {
  clinic: ClinicProfile;
  notifications: ClinicNotification[];
  waitingQueueCount: number;
  onOpenRegisterPatient: () => void;
  onOpenBookAppointment: () => void;
  onNavigateModule: (module: ClinicModule) => void;
  onToggleMobileSidebar: () => void;
  onBackToPaperglow: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const ClinicHeader: React.FC<ClinicHeaderProps> = ({
  clinic,
  notifications,
  waitingQueueCount,
  onOpenRegisterPatient,
  onOpenBookAppointment,
  onNavigateModule,
  onToggleMobileSidebar,
  onBackToPaperglow,
  isDark,
  onToggleDarkMode,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#11141a]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Mobile hamburger & Clinic Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={onBackToPaperglow}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors mr-2 cursor-pointer"
              title="Return to Paperglow Suite"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Paperglow</span>
            </button>

            <div
              onClick={() => onNavigateModule('dashboard')}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold font-['Poppins'] text-sm sm:text-base text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {clinic.name}
                  </span>
                  <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/60">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{clinic.kmpdcLicense}</span>
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 hidden md:block">
                  Outpatient Medical Center &middot; Kilimani, Nairobi
                </p>
              </div>
            </div>
          </div>

          {/* Right: Quick Clinical Actions & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Queue Tracker Pill */}
            <button
              onClick={() => onNavigateModule('queue')}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
              title="View Live Triage & Waiting Queue"
            >
              <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Queue: </span>
              <span className="font-mono font-bold text-amber-900 dark:text-amber-200">
                {waitingQueueCount} Waiting
              </span>
            </button>

            {/* Quick Action: Register Patient */}
            <button
              onClick={onOpenRegisterPatient}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#161a22] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-red-600" />
              <span>Register Patient</span>
            </button>

            {/* Quick Action: Book Appointment */}
            <button
              onClick={onOpenBookAppointment}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => onNavigateModule('notifications')}
              className="relative p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Clinical Reminders and Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
