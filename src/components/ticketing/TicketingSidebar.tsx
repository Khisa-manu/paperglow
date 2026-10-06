import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Users,
  UserCheck,
  FolderTree,
  ClockAlert,
  BookOpen,
  BarChart3,
  Flame,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  LifeBuoy,
} from 'lucide-react';
import { TicketingModule } from '../../types/ticketing';

interface TicketingSidebarProps {
  currentModule: TicketingModule;
  onSelectModule: (module: TicketingModule) => void;
  openTicketsCount: number;
  overdueTicketsCount: number;
  urgentTicketsCount: number;
  onQuickFilter?: (filterType: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const TicketingSidebar: React.FC<TicketingSidebarProps> = ({
  currentModule,
  onSelectModule,
  openTicketsCount,
  overdueTicketsCount,
  urgentTicketsCount,
  onQuickFilter,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TicketingModule,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'tickets' as TicketingModule,
      label: 'Tickets',
      icon: Inbox,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
    },
    {
      id: 'customers' as TicketingModule,
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'team' as TicketingModule,
      label: 'Team & Workload',
      icon: UserCheck,
    },
    {
      id: 'categories' as TicketingModule,
      label: 'Categories',
      icon: FolderTree,
    },
    {
      id: 'sla' as TicketingModule,
      label: 'SLA & Escalation',
      icon: ClockAlert,
      badge: overdueTicketsCount > 0 ? `${overdueTicketsCount} overdue` : undefined,
      badgeColor: 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold',
    },
    {
      id: 'knowledge_base' as TicketingModule,
      label: 'Knowledge Base',
      icon: BookOpen,
    },
    {
      id: 'reports' as TicketingModule,
      label: 'Reports & Analytics',
      icon: BarChart3,
    },
  ];

  const handleNavClick = (mod: TicketingModule) => {
    onSelectModule(mod);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#11141a] border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* App Title Header */}
        <div className="h-16 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              P
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white font-['Poppins']">
                  Paperglow
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  Ticketing
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Issue Tracking & Support</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2">
              Workspace
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-red-600 dark:text-red-400' : 'text-neutral-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Filter Queues */}
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2">
              Priority Queues
            </p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectModule('tickets');
                  if (onQuickFilter) onQuickFilter('urgent');
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>Urgent & High</span>
                </div>
                {urgentTicketsCount > 0 && (
                  <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 tabular-nums">
                    {urgentTicketsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onSelectModule('tickets');
                  if (onQuickFilter) onQuickFilter('overdue');
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Overdue SLA</span>
                </div>
                {overdueTicketsCount > 0 && (
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                    {overdueTicketsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onSelectModule('tickets');
                  if (onQuickFilter) onQuickFilter('unassigned');
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>Unassigned</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#141820]">
          <div className="flex items-center space-x-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Support Engine Active</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="tabular-nums">v2.4</span>
          </div>
        </div>
      </aside>
    </>
  );
};
