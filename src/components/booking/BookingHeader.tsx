import React from 'react';
import {
  Calendar,
  Search,
  Plus,
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Bell,
  Sparkles,
} from 'lucide-react';
import { BookingModule } from '../../types/booking';

interface BookingHeaderProps {
  currentModule: BookingModule;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateBooking: () => void;
  onNavigateOnlineBooking: () => void;
  onBackToPaperglow: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  todayCount: number;
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({
  currentModule,
  searchQuery,
  onSearchChange,
  onOpenCreateBooking,
  onNavigateOnlineBooking,
  onBackToPaperglow,
  isDark,
  toggleDarkMode,
  todayCount,
}) => {
  const getModuleTitle = (mod: BookingModule) => {
    switch (mod) {
      case 'dashboard':
        return 'Booking & Appointments Dashboard';
      case 'calendar':
        return 'Interactive Schedule Calendar';
      case 'bookings':
        return 'Appointments & Reservations Registry';
      case 'services':
        return 'Service Catalog & Pricing (KES)';
      case 'customers':
        return 'Customer Profiles & Booking History';
      case 'staff':
        return 'Staff Specialists & Working Hours';
      case 'online_booking':
        return 'Public Online Booking Portal';
      case 'reminders':
        return 'SMS, WhatsApp & Email Reminders';
      case 'payments':
        return 'Deposits & M-Pesa Reconciliation';
      case 'reports':
        return 'Revenue & Appointment Analytics';
      case 'settings':
        return 'Business Profile & Booking Policies';
      default:
        return 'Paperglow Booking';
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#12151b] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Back Link & Module Title */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-xl">
        <button
          onClick={onBackToPaperglow}
          title="Return to Paperglow Suite"
          className="text-neutral-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1 text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Paperglow Suite</span>
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:border-neutral-800 hidden sm:block" />

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] tracking-tight">
              {getModuleTitle(currentModule)}
            </h1>
            {todayCount > 0 && (
              <span className="hidden xl:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                {todayCount} Today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
        <div className="w-full relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search booking, client, or service..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700/80 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Customer Portal Link Simulator */}
        <button
          onClick={onNavigateOnlineBooking}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          title="Preview public online booking portal"
        >
          <Globe className="w-3.5 h-3.5 text-red-600" />
          <span>Client Booking Page</span>
        </button>

        {/* Create Booking Button */}
        <button
          onClick={onOpenCreateBooking}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Appointment</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
