import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  GitBranch,
  Calendar,
  CheckSquare,
  Megaphone,
  FileText,
  DollarSign,
  BarChart3,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { PartyModule } from '../../types/partyManager';

interface PartySidebarProps {
  currentModule: PartyModule;
  onSelectModule: (module: PartyModule) => void;
  onBackToPaperglow: () => void;
  memberCount: number;
  openTasksCount: number;
  upcomingEventsCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const PartySidebar: React.FC<PartySidebarProps> = ({
  currentModule,
  onSelectModule,
  onBackToPaperglow,
  memberCount,
  openTasksCount,
  upcomingEventsCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: Array<{
    id: PartyModule;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'organization',
      label: 'Organization & Organs',
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: 'members',
      label: 'Member Registry',
      icon: <Users className="w-4 h-4" />,
      badge: memberCount > 0 ? memberCount.toLocaleString() : undefined,
    },
    {
      id: 'branches',
      label: 'Branches & Regions',
      icon: <GitBranch className="w-4 h-4" />,
      badge: '6 Hubs',
    },
    {
      id: 'events',
      label: 'Events & Assemblies',
      icon: <Calendar className="w-4 h-4" />,
      badge: upcomingEventsCount > 0 ? upcomingEventsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'tasks',
      label: 'Workflows & Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: openTasksCount > 0 ? openTasksCount : undefined,
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      id: 'communications',
      label: 'Circulars & Notices',
      icon: <Megaphone className="w-4 h-4" />,
    },
    {
      id: 'documents',
      label: 'Constitutional Vault',
      icon: <FileText className="w-4 h-4" />,
      badge: 'ORPP',
    },
    {
      id: 'finance',
      label: 'Dues & Treasury',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Statutory Reports',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'admin',
      label: 'Governance & Admin',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <button
          onClick={onBackToPaperglow}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-3 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit to Paperglow Suite</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-900/30 ring-1 ring-white/20">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm tracking-tight truncate">
                Paperglow Party
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-red-500/20 text-red-300 rounded border border-red-500/30">
                KENYA
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">Civic & Org Manager</p>
          </div>
        </div>

        {/* Current Active Party Pill */}
        <div className="mt-3 p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-300 truncate">UCA-K Secretariat</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ORPP Fully Compliant
            </div>
          </div>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            CAP 7D
          </span>
        </div>
      </div>

      {/* Navigation Modules */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Operating Modules
        </div>
        {navItems.map((item) => {
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectModule(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-950/40'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                    item.badgeColor ||
                    (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-xs">
        <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
          <span>Currency Default</span>
          <span className="font-mono text-slate-200 font-semibold">KES (Shillings)</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Internal operations & registry protocol. Free of political persuasion or voter targeting.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
