import React from 'react';
import {
  Scale,
  Search,
  Plus,
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Gavel,
  Clock,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { LegalModule } from '../../types/legalPractice';
import { CloudSyncIndicator } from '../ui/CloudSyncIndicator';

interface LegalPracticeHeaderProps {
  currentModule: LegalModule;
  onOpenCreateMatter: () => void;
  onBackToPaperglow: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  upcomingCourtCount: number;
  urgentDeadlinesCount: number;
  overdueInvoicesCount: number;
  firmName: string;
  isCloudSyncing?: boolean;
  isCloudOnline?: boolean;
  onManualSync?: () => void;
}

export const LegalPracticeHeader: React.FC<LegalPracticeHeaderProps> = ({
  currentModule,
  onOpenCreateMatter,
  onBackToPaperglow,
  isDark,
  toggleDarkMode,
  upcomingCourtCount,
  urgentDeadlinesCount,
  overdueInvoicesCount,
  firmName,
  isCloudSyncing,
  isCloudOnline,
  onManualSync,
}) => {
  const getModuleTitle = (mod: LegalModule) => {
    switch (mod) {
      case 'dashboard':
        return 'Practice Operations Cockpit';
      case 'matters':
        return 'Matters & Case Files Registry';
      case 'clients':
        return 'Client Directory & Dossiers';
      case 'court_deadlines':
        return 'Court Diary & Statutory Deadlines';
      case 'documents':
        return 'Legal Documents & Pleadings Archive';
      case 'tasks':
        return 'Firm Tasks & Action Items';
      case 'time_tracking':
        return 'Advocate Billable Time & Activities';
      case 'billing':
        return 'Fee Notes, Trust Ledger & Invoicing (KES)';
      case 'calendar':
        return 'Court, Hearing & Conference Calendar';
      case 'communications':
        return 'Client Communications & Consultations';
      case 'reports':
        return 'Practice Analytics & Financial Reports';
      case 'team':
        return 'Roll of Advocates, Clerks & Permissions';
      case 'settings':
        return 'Law Firm Profile & Practice Policies';
      default:
        return 'Paperglow Legal Practice Manager';
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

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

        <div className="flex items-center space-x-2.5 truncate">
          <div className="p-1.5 rounded-lg bg-red-600 text-white shrink-0 shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] tracking-tight truncate">
              {getModuleTitle(currentModule)}
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-[10px] text-neutral-400 font-medium">
              <span>{firmName}</span>
              <span>•</span>
              <span className="text-red-600 dark:text-red-400 font-semibold">LSK Accredited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        <CloudSyncIndicator
          appName="Legal Practice"
          isSyncing={isCloudSyncing}
          isOnline={isCloudOnline}
          onManualSync={onManualSync}
        />

        {/* Indicators */}
        {upcomingCourtCount > 0 && (
          <span className="hidden lg:inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
            <Gavel className="w-3.5 h-3.5 text-red-600" />
            <span>{upcomingCourtCount} Court Dates</span>
          </span>
        )}

        {urgentDeadlinesCount > 0 && (
          <span className="hidden xl:inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{urgentDeadlinesCount} Deadlines Due</span>
          </span>
        )}

        {/* Quick Matter Button */}
        <button
          onClick={onOpenCreateMatter}
          className="px-3.5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Matter</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
