import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  MapPin,
  ChevronDown,
  User,
  ShieldCheck,
  Calendar,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { PartyModule, PartyBranch } from '../../types/partyManager';

interface PartyHeaderProps {
  currentModule: PartyModule;
  onOpenMobileMenu: () => void;
  branches: PartyBranch[];
  selectedBranchId: string;
  onSelectBranchId: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickAddMember: () => void;
  onQuickScheduleEvent: () => void;
  onQuickRecordFinance: () => void;
}

export const PartyHeader: React.FC<PartyHeaderProps> = ({
  currentModule,
  onOpenMobileMenu,
  branches,
  selectedBranchId,
  onSelectBranchId,
  searchQuery,
  onSearchChange,
  onQuickAddMember,
  onQuickScheduleEvent,
  onQuickRecordFinance,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getModuleTitle = (mod: PartyModule) => {
    switch (mod) {
      case 'dashboard':
        return { title: 'Executive Operations Dashboard', subtitle: 'National secretariat overview, membership health, and statutory calendar' };
      case 'organization':
        return { title: 'Organization Profile & Organs', subtitle: 'Registrar of Political Parties details, National Executive Committee, and charters' };
      case 'members':
        return { title: 'Member Registry & Roll', subtitle: 'Certified party members, delegate accreditations, and dues records' };
      case 'branches':
        return { title: 'Regional Branches & Hubs', subtitle: '47-county representation, regional secretariats, and coordinator oversight' };
      case 'events':
        return { title: 'Events, Meetings & Assemblies', subtitle: 'Statutory AGMs, National Delegates Conferences, agendas, and minutes' };
      case 'tasks':
        return { title: 'Tasks & Secretariat Workflows', subtitle: 'Administrative assignments, compliance deadlines, and accountability tracking' };
      case 'communications':
        return { title: 'Circulars, Memos & Broadcasts', subtitle: 'Official notices, executive instructions, and multi-channel delivery' };
      case 'documents':
        return { title: 'Statutory Document Vault', subtitle: 'Party constitution, ORPP compliance returns, audited accounts, and policy papers' };
      case 'finance':
        return { title: 'Treasury & Financial Ledger', subtitle: 'Annual membership subscriptions, M-Pesa Paybill #522522 reconciliation, and grants' };
      case 'reports':
        return { title: 'Statutory & Analytics Reports', subtitle: 'ORPP compliance filings, county representation quotas, and fiscal summaries' };
      case 'admin':
        return { title: 'Administration & Governance', subtitle: 'System user access roles, immutable audit trail, and party registry configuration' };
    }
  };

  const { title, subtitle } = getModuleTitle(currentModule);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate flex items-center gap-2">
              <span>{title}</span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                UCA-K Operations
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate">{subtitle}</p>
          </div>
        </div>

        {/* Center/Right: Branch Filter, Search, Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Branch Switcher Dropdown */}
          <div className="relative hidden md:block">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <select
                value={selectedBranchId}
                onChange={(e) => onSelectBranchId(e.target.value)}
                className="bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-hidden cursor-pointer pr-1"
              >
                <option value="all">All Regional Secretariats</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.county})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative hidden lg:block w-48 xl:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search registry, ID, reference..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 border border-slate-200 focus:border-red-500 focus:bg-white focus:outline-hidden rounded-lg text-xs text-slate-800 placeholder-slate-400 transition-colors"
            />
          </div>

          {/* Quick Action Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Action</span>
              <ChevronDown className="w-3 h-3 text-red-200" />
            </button>

            {showQuickMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowQuickMenu(false)}
              >
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Create
                </div>
                <button
                  onClick={onQuickAddMember}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-50 hover:text-red-700 text-left transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-red-600" />
                  <span>Register New Member</span>
                </button>
                <button
                  onClick={onQuickScheduleEvent}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-50 hover:text-red-700 text-left transition-colors"
                >
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>Schedule Meeting / Assembly</span>
                </button>
                <button
                  onClick={onQuickRecordFinance}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-50 hover:text-red-700 text-left transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Record Dues / Contribution</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Statutory alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 text-xs animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-semibold text-slate-900">Statutory & Internal Alerts</span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    ORPP Active
                  </span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="font-medium text-emerald-900 text-[11px]">
                      ORPP Annual Filing Acknowledged
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">
                      Statutory compliance certificate issued for 2024/2025.
                    </p>
                  </div>
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="font-medium text-amber-900 text-[11px]">
                      Coast Regional AGM in 10 Days
                    </p>
                    <p className="text-[10px] text-amber-700 mt-0.5">
                      165 delegates confirmed for March 22 session at PrideInn.
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="font-medium text-slate-800 text-[11px]">
                      Q1 M-Pesa Paybill Reconciled
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      KES 144,000 processed from 60 renewal transactions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-red-100">
              KO
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">Adv. K. Otieno</div>
              <div className="text-[10px] text-slate-500 font-medium">Secretary General</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
