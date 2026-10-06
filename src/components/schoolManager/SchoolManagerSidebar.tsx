import React from 'react';
import { SchoolModule } from '../../types/schoolManager';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  CreditCard,
  FileSpreadsheet,
  Clock,
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SchoolManagerSidebarProps {
  currentModule: SchoolModule;
  onSelectModule: (module: SchoolModule) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  counts: {
    students: number;
    teachers: number;
    feeArrearsCount: number;
    unreadNotifications: number;
    activeAssignments: number;
  };
}

export const SchoolManagerSidebar: React.FC<SchoolManagerSidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  counts,
}) => {
  const navSections: {
    title: string;
    items: {
      id: SchoolModule;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeVariant?: 'red' | 'amber' | 'neutral';
    }[];
  }[] = [
    {
      title: 'Core Administration',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          id: 'students',
          label: 'Students Directory',
          icon: <Users className="w-4 h-4" />,
          badge: counts.students,
        },
        {
          id: 'teachers',
          label: 'Teachers & Staff',
          icon: <GraduationCap className="w-4 h-4" />,
          badge: counts.teachers,
        },
        {
          id: 'classes',
          label: 'Classes & Subjects',
          icon: <Layers className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Academics & Daily Ops',
      items: [
        {
          id: 'attendance',
          label: 'Daily Attendance',
          icon: <CalendarCheck className="w-4 h-4" />,
        },
        {
          id: 'fees',
          label: 'Fees & Payments',
          icon: <CreditCard className="w-4 h-4" />,
          badge: counts.feeArrearsCount > 0 ? `${counts.feeArrearsCount} due` : undefined,
          badgeVariant: 'amber',
        },
        {
          id: 'exams',
          label: 'Exams & Results',
          icon: <FileSpreadsheet className="w-4 h-4" />,
        },
        {
          id: 'timetable',
          label: 'Timetable Schedules',
          icon: <Clock className="w-4 h-4" />,
        },
        {
          id: 'assignments',
          label: 'Homework & Tasks',
          icon: <BookOpen className="w-4 h-4" />,
          badge: counts.activeAssignments,
          badgeVariant: 'neutral',
        },
      ],
    },
    {
      title: 'Engagement & System',
      items: [
        {
          id: 'communication',
          label: 'Communication & Notices',
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          id: 'events',
          label: 'Events & Calendar',
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          id: 'reports',
          label: 'Analytics & Reports',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          id: 'notifications',
          label: 'Notifications & Alerts',
          icon: <Bell className="w-4 h-4" />,
          badge: counts.unreadNotifications > 0 ? counts.unreadNotifications : undefined,
          badgeVariant: 'red',
        },
        {
          id: 'settings',
          label: 'School Settings',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleSelect = (module: SchoolModule) => {
    onSelectModule(module);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-neutral-50 dark:bg-[#101217] border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-200 ease-in-out overflow-y-auto flex flex-col justify-between ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5">
                {sec.title}
              </p>
              {sec.items.map((item) => {
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer group ${
                      isActive
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-white' : 'text-neutral-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ml-1.5 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeVariant === 'red'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                            : item.badgeVariant === 'amber'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom System Pill */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 mt-4">
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-100 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NEMIS &amp; KNEC Online</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
              CBC Form 1-4 &amp; JSS Curriculum Engine Active • KES Currency
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
