import React from 'react';
import { ChamaModule } from '../../types/chamaManager';
import {
  LayoutDashboard,
  Building,
  Users,
  Award,
  CreditCard,
  Banknote,
  HeartHandshake,
  CalendarDays,
  Receipt,
  Landmark,
  BarChart3,
  Bell,
  ShieldCheck,
} from 'lucide-react';

interface ChamaSidebarProps {
  currentModule: ChamaModule;
  onSelectModule: (module: ChamaModule) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  counts: {
    totalMembers: number;
    activeLoansCount: number;
    pendingWelfareCount: number;
    pendingLoanApplicationsCount: number;
    unreadNotifications: number;
  };
}

export const ChamaSidebar: React.FC<ChamaSidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  counts,
}) => {
  const navSections: {
    title: string;
    items: {
      id: ChamaModule;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeVariant?: 'red' | 'amber' | 'neutral';
    }[];
  }[] = [
    {
      title: 'Overview & Group',
      items: [
        {
          id: 'dashboard',
          label: 'Chama Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          id: 'group',
          label: 'Group Profile & Bylaws',
          icon: <Building className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Membership & Credentials',
      items: [
        {
          id: 'members',
          label: 'Members Directory',
          icon: <Users className="w-4 h-4" />,
          badge: counts.totalMembers,
        },
        {
          id: 'documents',
          label: 'Certificates & ID Cards',
          icon: <Award className="w-4 h-4" />,
          badge: 'PDF / Print',
          badgeVariant: 'red',
        },
      ],
    },
    {
      title: 'Financial Portfolios',
      items: [
        {
          id: 'contributions',
          label: 'Monthly Contributions',
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          id: 'loans',
          label: 'Loans & Credit Facility',
          icon: <Banknote className="w-4 h-4" />,
          badge: counts.pendingLoanApplicationsCount > 0 ? `${counts.pendingLoanApplicationsCount} pending` : counts.activeLoansCount,
          badgeVariant: counts.pendingLoanApplicationsCount > 0 ? 'amber' : 'neutral',
        },
        {
          id: 'welfare',
          label: 'Welfare & Benevolent Fund',
          icon: <HeartHandshake className="w-4 h-4" />,
          badge: counts.pendingWelfareCount > 0 ? `${counts.pendingWelfareCount} claim` : undefined,
          badgeVariant: 'amber',
        },
        {
          id: 'finance',
          label: 'Income & Expense Ledger',
          icon: <Receipt className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Governance & Assets',
      items: [
        {
          id: 'meetings',
          label: 'Meetings & Minutes',
          icon: <CalendarDays className="w-4 h-4" />,
        },
        {
          id: 'assets',
          label: 'Group Land & Assets',
          icon: <Landmark className="w-4 h-4" />,
        },
        {
          id: 'reports',
          label: 'Financial Statements',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Settings & Security',
      items: [
        {
          id: 'notifications',
          label: 'Reminders & Circulars',
          icon: <Bell className="w-4 h-4" />,
          badge: counts.unreadNotifications > 0 ? counts.unreadNotifications : undefined,
          badgeVariant: 'red',
        },
        {
          id: 'roles',
          label: 'Roles & Permissions',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleSelect = (module: ChamaModule) => {
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-red-600 text-white font-semibold shadow-xs'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
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
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeVariant === 'red'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                            : item.badgeVariant === 'amber'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
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

        {/* Bottom Chama Info Footnote */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/20 m-2 rounded-lg">
          <div className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Ushirika Bora Chama
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
            Co-op Bank &amp; M-Pesa KES Ledger
          </div>
        </div>
      </aside>
    </>
  );
};
