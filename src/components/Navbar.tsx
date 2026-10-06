import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  FileSpreadsheet,
  Building2,
  Home,
  Pill,
  Landmark,
  Users,
  Ticket,
  CalendarCheck,
  Package,
  Scale,
  GraduationCap,
  Stethoscope,
  Search,
  ArrowRight,
  FileCheck,
  Kanban,
  Briefcase,
} from 'lucide-react';
import {
  APP_NAV_CATEGORIES,
  CATEGORIZED_NAV_APPS,
  AppViewType,
  NavAppItem,
} from '../data/appsNavigationConfig';

interface NavbarProps {
  currentView: AppViewType;
  onNavigate: (view: AppViewType) => void;
  onSelectAppDetail?: (appId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isLoggedIn: boolean;
  customerName: string;
  subscribedCount: number;
  onOpenAccountModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const getNavAppIcon = (id: string, className = 'w-4 h-4') => {
  switch (id) {
    case 'nav-business-manager':
      return <Building2 className={className} />;
    case 'nav-invoice':
      return <FileSpreadsheet className={className} />;
    case 'nav-crm':
      return <Briefcase className={className} />;
    case 'nav-inventory':
      return <Package className={className} />;
    case 'nav-property-manager':
      return <Home className={className} />;
    case 'nav-pharmacy-manager':
      return <Pill className={className} />;
    case 'nav-clinic-manager':
      return <Stethoscope className={className} />;
    case 'nav-chama-manager':
      return <Users className={className} />;
    case 'nav-organization-manager':
      return <Landmark className={className} />;
    case 'nav-legal-practice':
      return <Scale className={className} />;
    case 'nav-contracts':
      return <FileCheck className={className} />;
    case 'nav-school-manager':
      return <GraduationCap className={className} />;
    case 'nav-booking':
      return <CalendarCheck className={className} />;
    case 'nav-ticketing':
      return <Ticket className={className} />;
    case 'nav-team':
      return <Kanban className={className} />;
    default:
      return <LayoutGrid className={className} />;
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onSelectAppDetail,
  cartCount,
  onOpenCart,
  isLoggedIn,
  customerName,
  subscribedCount,
  onOpenAccountModal,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const [appsSearchQuery, setAppsSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [cartBadgeBump, setCartBadgeBump] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Subtle badge micro-interaction when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartBadgeBump(true);
      const timer = setTimeout(() => setCartBadgeBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Close Apps menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAppsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAppsMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-focus search input when opening Apps menu on desktop
  useEffect(() => {
    if (appsMenuOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    } else {
      setAppsSearchQuery('');
      setActiveCategoryFilter('All');
    }
  }, [appsMenuOpen]);

  const handleLaunchNavApp = (item: NavAppItem) => {
    setAppsMenuOpen(false);
    setMobileMenuOpen(false);
    if (item.view) {
      onNavigate(item.view);
    } else if (onSelectAppDetail) {
      onSelectAppDetail(item.catalogAppId);
    } else {
      window.location.hash = `#app/${item.catalogAppId}`;
      onNavigate('application-detail');
    }
  };

  const featuredApps = useMemo(
    () => CATEGORIZED_NAV_APPS.filter((app) => app.featured),
    []
  );

  const filteredApps = useMemo(() => {
    const q = appsSearchQuery.trim().toLowerCase();
    return CATEGORIZED_NAV_APPS.filter((app) => {
      const matchesCategory =
        activeCategoryFilter === 'All' || app.category === activeCategoryFilter;
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.shortDesc.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [appsSearchQuery, activeCategoryFilter]);

  const groupedByCategory = useMemo(() => {
    return APP_NAV_CATEGORIES.map((cat) => ({
      ...cat,
      apps: filteredApps.filter((app) => app.category === cat.id),
    })).filter((group) => group.apps.length > 0);
  }, [filteredApps]);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              setAppsMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-base shadow-xs group-hover:bg-red-700 transition-colors">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 leading-none">
                Paperglow<span className="text-red-600">.</span>
              </span>
              <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 tracking-wider uppercase mt-0.5">
                 Cloud &amp; Studio
              </span>
            </div>
          </button>

          {/* Clean Primary Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
              }`}
            >
              Home
            </button>

            {/* Clean "Apps" Mega-Menu Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAppsMenuOpen((prev) => !prev)}
                aria-expanded={appsMenuOpen}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  appsMenuOpen || currentView === 'applications' || currentView === 'application-detail'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Apps</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    appsMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Apps Mega-Menu Popover */}
              {appsMenuOpen && (
                <div className="absolute left-0 mt-2.5 w-[760px] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#14171d] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Top Bar: Search Input + Category Filter Pills */}
                  <div className="p-4 bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800 space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={appsSearchQuery}
                        onChange={(e) => setAppsSearchQuery(e.target.value)}
                        placeholder="Search apps (e.g. Business Manager, Invoice, Clinic, Chama, School)..."
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-[#0f1115] border border-neutral-200 dark:border-neutral-700/80 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                      />
                      {appsSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setAppsSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Category Filter Bar */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                      <button
                        type="button"
                        onClick={() => setActiveCategoryFilter('All')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          activeCategoryFilter === 'All'
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                            : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        All Categories
                      </button>
                      {APP_NAV_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategoryFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            activeCategoryFilter === cat.id
                              ? 'bg-red-600 text-white'
                              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Apps Body */}
                  <div className="max-h-[68vh] overflow-y-auto p-4 space-y-5">
                    {/* Priority Featured Apps (shown first when not filtering) */}
                    {!appsSearchQuery && activeCategoryFilter === 'All' && (
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            Most Popular Applications
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Click any app to open its workspace
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {featuredApps.map((app) => (
                            <button
                              key={`featured-${app.id}`}
                              type="button"
                              onClick={() => handleLaunchNavApp(app)}
                              className="flex items-start gap-2.5 p-2.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900/50 text-left transition-all group cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-600/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                {getNavAppIcon(app.id, 'w-4 h-4')}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 truncate">
                                    {app.name}
                                  </span>
                                  {app.badge && (
                                    <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                                      {app.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                                  {app.shortDesc}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categorized App Directory */}
                    {groupedByCategory.length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          No applications match &ldquo;{appsSearchQuery}&rdquo;
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setAppsSearchQuery('');
                            setActiveCategoryFilter('All');
                          }}
                          className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                          Reset search filter
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        {groupedByCategory.map((group) => (
                          <div key={group.id} className="space-y-2">
                            <div className="flex items-baseline justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-1">
                              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                {group.label}
                              </h4>
                              <span className="text-[10px] text-neutral-400">
                                {group.description}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {group.apps.map((app) => (
                                <button
                                  key={app.id}
                                  type="button"
                                  onClick={() => handleLaunchNavApp(app)}
                                  className="w-full flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 text-left transition-colors group cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-center shrink-0 transition-colors">
                                      {getNavAppIcon(app.id, 'w-3.5 h-3.5')}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-red-600 dark:group-hover:text-red-400 truncate">
                                        {app.name}
                                      </div>
                                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                                        {app.shortDesc}
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/80 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Unified single sign-on across all <strong>{subscribedCount}</strong> active workspaces
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppsMenuOpen(false);
                        onNavigate('applications');
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      <span>Explore Full Software Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('applications')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'applications'
                  ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
              }`}
            >
              Directory &amp; Pricing
            </button>

            <button
              type="button"
              onClick={() => onNavigate('branding')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'branding'
                  ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Branding &amp; Print</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('account')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'account'
                  ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
              }`}
            >
              My Account
            </button>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle color scheme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Customization Cart Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Open customization cart"
            title="Print & Merchandise Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center transition-transform duration-200 ${
                  cartBadgeBump ? 'scale-125' : 'scale-100'
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Workspace Pill */}
          <button
            type="button"
            onClick={onOpenAccountModal}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-red-600" />
            <span className="max-w-[120px] truncate">
              {isLoggedIn ? customerName.split(' ')[0] : 'Sign In'}
            </span>
            {isLoggedIn && subscribedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-red-600/10 text-red-600 dark:text-red-400 text-[10px] font-bold">
                {subscribedCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Search & Categorized Apps */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0f1115] px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Primary Pages */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2 ${
                currentView === 'home'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-red-600" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('applications');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2 ${
                currentView === 'applications'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-red-600" />
              <span>All Apps Directory</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('branding');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2 ${
                currentView === 'branding'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Branding &amp; Print</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('account');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2 ${
                currentView === 'account'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-red-600" />
              <span>My Account ({subscribedCount})</span>
            </button>
          </div>

          {/* Mobile Apps Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={appsSearchQuery}
              onChange={(e) => setAppsSearchQuery(e.target.value)}
              placeholder="Search Paperglow apps..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Categorized Mobile Apps List */}
          <div className="space-y-4">
            {groupedByCategory.map((group) => (
              <div key={`mob-${group.id}`} className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                  {group.label}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {group.apps.map((app) => (
                    <button
                      key={`mob-app-${app.id}`}
                      type="button"
                      onClick={() => handleLaunchNavApp(app)}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 text-left active:bg-red-50 dark:active:bg-red-950/30"
                    >
                      <div className="w-7 h-7 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                        {getNavAppIcon(app.id, 'w-4 h-4')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {app.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                          {app.shortDesc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
