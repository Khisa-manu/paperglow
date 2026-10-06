import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Sparkles,
  Users,
  UserCheck,
  Globe,
  BellRing,
  CreditCard,
  BarChart3,
  Settings,
  X,
  Plus,
} from 'lucide-react';
import { BookingModule } from '../../types/booking';

interface BookingSidebarProps {
  currentModule: BookingModule;
  onSelectModule: (mod: BookingModule) => void;
  todayCount: number;
  upcomingCount: number;
  pendingCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenCreateBooking: () => void;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  currentModule,
  onSelectModule,
  todayCount,
  upcomingCount,
  pendingCount,
  isMobileOpen,
  onCloseMobile,
  onOpenCreateBooking,
}) => {
  const navItems = [
    {
      id: 'dashboard' as BookingModule,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: todayCount > 0 ? `${todayCount} Today` : undefined,
      badgeColor: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
    },
    {
      id: 'calendar' as BookingModule,
      label: 'Calendar',
      icon: Calendar,
    },
    {
      id: 'bookings' as BookingModule,
      label: 'Bookings List',
      icon: Clock,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : undefined,
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    },
    {
      id: 'services' as BookingModule,
      label: 'Services & Pricing',
      icon: Sparkles,
    },
    {
      id: 'customers' as BookingModule,
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'staff' as BookingModule,
      label: 'Staff Specialists',
      icon: UserCheck,
    },
    {
      id: 'online_booking' as BookingModule,
      label: 'Online Booking Page',
      icon: Globe,
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    },
    {
      id: 'reminders' as BookingModule,
      label: 'Reminders & SMS',
      icon: BellRing,
    },
    {
      id: 'payments' as BookingModule,
      label: 'Payments (KES)',
      icon: CreditCard,
    },
    {
      id: 'reports' as BookingModule,
      label: 'Reports & Revenue',
      icon: BarChart3,
    },
    {
      id: 'settings' as BookingModule,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 w-64 bg-white dark:bg-[#12151b] border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-40 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Application Sub-header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              PB
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Paperglow Booking
              </div>
              <div className="text-[10px] text-neutral-500">Service Operations v3.2</div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onOpenCreateBooking();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-red-500 dark:text-red-600'
                        : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800'
                        : item.badgeColor || 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status / Currency indicator */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Online Booking Active</span>
          </div>
          <span className="font-bold text-neutral-700 dark:text-neutral-300">KES (Kenyan Shillings)</span>
        </div>
      </aside>
    </>
  );
};
