import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Gavel,
  FileText,
  CheckSquare,
  Clock,
  CreditCard,
  Calendar,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Settings,
  X,
  Plus,
  Scale,
} from 'lucide-react';
import { LegalModule } from '../../types/legalPractice';

interface LegalPracticeSidebarProps {
  currentModule: LegalModule;
  onSelectModule: (mod: LegalModule) => void;
  activeMattersCount: number;
  upcomingCourtCount: number;
  urgentDeadlinesCount: number;
  openTasksCount: number;
  overdueInvoicesCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenCreateMatter: () => void;
}

export const LegalPracticeSidebar: React.FC<LegalPracticeSidebarProps> = ({
  currentModule,
  onSelectModule,
  activeMattersCount,
  upcomingCourtCount,
  urgentDeadlinesCount,
  openTasksCount,
  overdueInvoicesCount,
  isMobileOpen,
  onCloseMobile,
  onOpenCreateMatter,
}) => {
  const navItems = [
    {
      id: 'dashboard' as LegalModule,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'matters' as LegalModule,
      label: 'Matters & Cases',
      icon: Briefcase,
      badge: `${activeMattersCount}`,
      badgeColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
    },
    {
      id: 'clients' as LegalModule,
      label: 'Clients',
      icon: Users,
    },
    {
      id: 'court_deadlines' as LegalModule,
      label: 'Court & Deadlines',
      icon: Gavel,
      badge: upcomingCourtCount + urgentDeadlinesCount > 0 ? `${upcomingCourtCount + urgentDeadlinesCount}` : undefined,
      badgeColor: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 font-bold',
    },
    {
      id: 'documents' as LegalModule,
      label: 'Pleadings & Documents',
      icon: FileText,
    },
    {
      id: 'tasks' as LegalModule,
      label: 'Tasks',
      icon: CheckSquare,
      badge: openTasksCount > 0 ? `${openTasksCount}` : undefined,
      badgeColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    },
    {
      id: 'time_tracking' as LegalModule,
      label: 'Time Tracking',
      icon: Clock,
    },
    {
      id: 'billing' as LegalModule,
      label: 'Fee Notes & Billing',
      icon: CreditCard,
      badge: overdueInvoicesCount > 0 ? `${overdueInvoicesCount} Due` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold',
    },
    {
      id: 'calendar' as LegalModule,
      label: 'Calendar Diary',
      icon: Calendar,
    },
    {
      id: 'communications' as LegalModule,
      label: 'Communications',
      icon: MessageSquare,
    },
    {
      id: 'reports' as LegalModule,
      label: 'Reports & Analytics',
      icon: BarChart3,
    },
    {
      id: 'team' as LegalModule,
      label: 'Team & Permissions',
      icon: ShieldCheck,
    },
    {
      id: 'settings' as LegalModule,
      label: 'Practice Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#12151b] border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 lg:hidden">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-red-600" />
            <span className="font-bold text-sm font-['Poppins']">Paperglow Legal</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Matter Creation Button */}
        <div className="p-4 pb-2">
          <button
            onClick={() => {
              onOpenCreateMatter();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Open New Matter</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-red-600 dark:text-red-400' : 'text-neutral-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Judiciary E-Filing
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Currency</span>
            <span className="font-mono text-neutral-600 dark:text-neutral-300 font-semibold">
              KES (Kenyan Shilling)
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
