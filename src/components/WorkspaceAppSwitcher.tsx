import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Search,
  X,
  ArrowRight,
  Home,
} from 'lucide-react';
import {
  APP_NAV_CATEGORIES,
  CATEGORIZED_NAV_APPS,
  AppViewType,
  NavAppItem,
} from '../data/appsNavigationConfig';
import { getNavAppIcon } from './Navbar';

interface WorkspaceAppSwitcherProps {
  currentView: AppViewType;
  onNavigate: (view: AppViewType) => void;
  onSelectAppDetail: (appId: string) => void;
}

export const WorkspaceAppSwitcher: React.FC<WorkspaceAppSwitcherProps> = ({
  currentView,
  onNavigate,
  onSelectAppDetail,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  const currentAppMeta = useMemo(
    () => CATEGORIZED_NAV_APPS.find((a) => a.view === currentView),
    [currentView]
  );

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CATEGORIZED_NAV_APPS.filter((app) => {
      const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.shortDesc.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    return APP_NAV_CATEGORIES.map((cat) => ({
      ...cat,
      apps: filteredApps.filter((a) => a.category === cat.id),
    })).filter((g) => g.apps.length > 0);
  }, [filteredApps]);

  const handleSelectApp = (item: NavAppItem) => {
    setIsOpen(false);
    if (item.view) {
      onNavigate(item.view);
    } else {
      onSelectAppDetail(item.catalogAppId);
    }
  };

  return (
    <>
      {/* Subtle floating bottom-left Apps Switcher Pill inside standalone SaaS Workspaces */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900/95 dark:bg-neutral-100/95 hover:bg-red-600 dark:hover:bg-red-600 text-white dark:text-neutral-900 dark:hover:text-white text-xs font-semibold shadow-lg border border-neutral-700/60 dark:border-neutral-300 transition-all duration-150 cursor-pointer"
          title="Switch Paperglow Application"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-red-500 dark:text-red-600 group-hover:text-white" />
          <span>Apps</span>
          {currentAppMeta && (
            <span className="hidden sm:inline-block pl-1.5 border-l border-neutral-700 dark:border-neutral-300 text-[11px] font-normal opacity-80">
              {currentAppMeta.name}
            </span>
          )}
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 px-4 print:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-white dark:bg-[#14171d] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Search */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    P
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Switch Paperglow Application
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate('home');
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-red-600" />
                    <span>Paperglow Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applications by name or category..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0f1115] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  All
                </button>
                {APP_NAV_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-red-600 text-white'
                        : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-4 max-h-[60vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupedByCategory.map((group) => (
                <div key={group.id} className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 pb-1">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.apps.map((app) => {
                      const isCurrent = app.view === currentView;
                      return (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => handleSelectApp(app)}
                          className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? 'bg-red-600 text-white'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                              }`}
                            >
                              {getNavAppIcon(app.id, 'w-3.5 h-3.5')}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                  {app.name}
                                </span>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-red-600 text-white">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                                {app.shortDesc}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
