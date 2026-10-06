import React from 'react';
import { ClinicModule } from '../../types/clinicManager';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Clock,
  ClipboardList,
  Receipt,
  Activity,
  UserCheck,
  FileText,
  Bell,
  BarChart3,
  Settings,
  X,
  ShieldCheck,
} from 'lucide-react';

interface ClinicSidebarProps {
  currentModule: ClinicModule;
  onSelectModule: (module: ClinicModule) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  counts: {
    totalPatients: number;
    todayAppointments: number;
    queueWaiting: number;
    pendingInvoices: number;
    unreadNotifications: number;
  };
}

export const ClinicSidebar: React.FC<ClinicSidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  counts,
}) => {
  const sections: {
    title: string;
    items: {
      id: ClinicModule;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeVariant?: 'red' | 'amber' | 'neutral';
    }[];
  }[] = [
    {
      title: 'Clinical Operations',
      items: [
        {
          id: 'dashboard',
          label: 'Clinic Cockpit',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          id: 'queue',
          label: 'Reception & Queue',
          icon: <Clock className="w-4 h-4" />,
          badge: counts.queueWaiting > 0 ? `${counts.queueWaiting} waiting` : undefined,
          badgeVariant: 'amber',
        },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: <CalendarDays className="w-4 h-4" />,
          badge: counts.todayAppointments > 0 ? counts.todayAppointments : undefined,
          badgeVariant: 'neutral',
        },
        {
          id: 'consultations',
          label: 'Consultations & EHR',
          icon: <ClipboardList className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Patients & Services',
      items: [
        {
          id: 'patients',
          label: 'Patient Directory',
          icon: <Users className="w-4 h-4" />,
          badge: counts.totalPatients,
        },
        {
          id: 'services',
          label: 'Medical Services',
          icon: <Activity className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Billing & Staff',
      items: [
        {
          id: 'billing',
          label: 'Billing & Payments',
          icon: <Receipt className="w-4 h-4" />,
          badge: counts.pendingInvoices > 0 ? `${counts.pendingInvoices} due` : undefined,
          badgeVariant: 'red',
        },
        {
          id: 'staff',
          label: 'Doctors & Staff',
          icon: <UserCheck className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Documentation & Intelligence',
      items: [
        {
          id: 'documents',
          label: 'Clinical Documents & Rx',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          id: 'notifications',
          label: 'Reminders & Notices',
          icon: <Bell className="w-4 h-4" />,
          badge: counts.unreadNotifications > 0 ? counts.unreadNotifications : undefined,
          badgeVariant: 'red',
        },
        {
          id: 'settings',
          label: 'Clinic Settings',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full py-4 text-neutral-800 dark:text-neutral-200">
      {/* Mobile Close Button */}
      <div className="flex md:hidden items-center justify-between px-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500 font-['Poppins']">
          Navigation Menu
        </span>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-semibold shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeVariant === 'red'
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                          : item.badgeVariant === 'amber'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
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

      {/* Bottom EHR Medical Records Compliance Notice */}
      <div className="p-3 mx-3 mt-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-[10px] text-neutral-500 leading-snug">
        <div className="flex items-center space-x-1.5 font-bold text-neutral-700 dark:text-neutral-300 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
          <span>EHR Audit Certified</span>
        </div>
        Clinical records management system only. No automated medical diagnosis or treatment advice generated.
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white dark:bg-[#11141a] border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-[#11141a] shadow-xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
