import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, User, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'applications' | 'application-detail' | 'account' | 'branding' | 'invoice-generator' | 'business-manager' | 'property-manager' | 'pharmacy-manager' | 'party-manager' | 'ticketing' | 'booking' | 'stock-inventory';
  isLoggedIn: boolean;
  userName?: string;
  subscribedAppCount: number;
  cartCount: number;
  isDark: boolean;
  toggleDarkMode: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  onNavigateApplications: () => void;
  onNavigateBranding: () => void;
  onNavigateInvoiceGenerator?: () => void;
  onNavigateBusinessManager?: () => void;
  onNavigatePropertyManager?: () => void;
  onNavigatePharmacyManager?: () => void;
  onNavigatePartyManager?: () => void;
  onNavigateTicketing?: () => void;
  onNavigateBooking?: () => void;
  onNavigateStockInventory?: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  isLoggedIn,
  userName,
  subscribedAppCount,
  cartCount,
  isDark,
  toggleDarkMode,
  onOpenAccount,
  onOpenCart,
  onNavigateHome,
  onNavigateApplications,
  onNavigateBranding,
  onNavigateInvoiceGenerator,
  onNavigateBusinessManager,
  onNavigatePropertyManager,
  onNavigatePharmacyManager,
  onNavigatePartyManager,
  onNavigateTicketing,
  onNavigateBooking,
  onNavigateStockInventory,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-150 border-b ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0f1115]/95 border-neutral-200 dark:border-neutral-800 shadow-xs'
          : 'bg-white dark:bg-[#0f1115] border-neutral-200 dark:border-neutral-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-2 text-left group focus:outline-none cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
            <span className="text-xl font-bold tracking-tight font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Paperglow
            </span>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <button
              onClick={onNavigateHome}
              className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-red-600 dark:text-red-500 font-semibold' : ''
              }`}
            >
              Overview
            </button>
            <button
              onClick={onNavigateApplications}
              className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer ${
                currentView === 'applications' || currentView === 'application-detail'
                  ? 'text-red-600 dark:text-red-500 font-semibold'
                  : ''
              }`}
            >
              Applications Directory
            </button>
            {onNavigateBusinessManager && (
              <button
                onClick={onNavigateBusinessManager}
                className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  currentView === 'business-manager'
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : ''
                }`}
              >
                <span>Business Manager</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                  Biz Ops
                </span>
              </button>
            )}
            {onNavigatePropertyManager && (
              <button
                onClick={onNavigatePropertyManager}
                className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  (currentView as string) === 'property-manager'
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : ''
                }`}
              >
                <span>Property Manager</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
                  Real Estate
                </span>
              </button>
            )}
            {onNavigatePharmacyManager && (
              <button
                onClick={onNavigatePharmacyManager}
                className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  (currentView as string) === 'pharmacy-manager'
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : ''
                }`}
              >
                <span>Pharmacy Manager</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  Rx
                </span>
              </button>
            )}
            {onNavigatePartyManager && (
              <button
                onClick={onNavigatePartyManager}
                className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  (currentView as string) === 'party-manager'
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : ''
                }`}
              >
                <span>Party Manager</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
                  Civic
                </span>
              </button>
            )}
            {onNavigateTicketing && (
              <button
                onClick={onNavigateTicketing}
                className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  (currentView as string) === 'ticketing'
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : ''
                }`}
              >
                <span>Ticketing</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                  Support
                </span>
              </button>
            )}
            {onNavigateBooking && (
              <button
                onClick={onNavigateBooking}
                className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  (currentView as string) === 'booking'
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : ''
                }`}
              >
                <span>Booking</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  Appointments
                </span>
              </button>
            )}
            {onNavigateStockInventory && (
              <button
                onClick={onNavigateStockInventory}
                className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  (currentView as string) === 'stock-inventory'
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : ''
                }`}
              >
                <span>Inventory</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                  Stock
                </span>
              </button>
            )}
            <button
              onClick={onNavigateBranding}
              className={`hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer ${
                currentView === 'branding' ? 'text-red-600 dark:text-red-500 font-semibold' : ''
              }`}
            >
              Branding &amp; Customization
            </button>
            <button
              onClick={() => onNavigateSection('account')}
              className="hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
            >
              One Account
            </button>
            <button
              onClick={() => onNavigateSection('how-it-works')}
              className="hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigateSection('why-paperglow')}
              className="hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
            >
              Why Paperglow
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="View Customization Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Paperglow Customer Account Button */}
            <button
              onClick={onOpenAccount}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                currentView === 'account'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>
                {isLoggedIn
                  ? `Account (${subscribedAppCount} Apps)`
                  : 'Sign In / Account'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0f1115]">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  onNavigateHome();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
              >
                Overview
              </button>
              <button
                onClick={() => {
                  onNavigateApplications();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
              >
                Applications Directory
              </button>
              {onNavigateBusinessManager && (
                <button
                  onClick={() => {
                    onNavigateBusinessManager();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-between"
                >
                  <span>Paperglow Business Manager</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">Biz Ops</span>
                </button>
              )}
              {onNavigateInvoiceGenerator && (
                <button
                  onClick={() => {
                    onNavigateInvoiceGenerator();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  Invoice &amp; Quotation Generator
                </button>
              )}
              {onNavigatePropertyManager && (
                <button
                  onClick={() => {
                    onNavigatePropertyManager();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-between"
                >
                  <span>Paperglow Property Manager</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
                    Real Estate
                  </span>
                </button>
              )}
              {onNavigatePharmacyManager && (
                <button
                  onClick={() => {
                    onNavigatePharmacyManager();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-between"
                >
                  <span>Paperglow Pharmacy Manager</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">
                    Rx
                  </span>
                </button>
              )}
              {onNavigatePartyManager && (
                <button
                  onClick={() => {
                    onNavigatePartyManager();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-between"
                >
                  <span>Paperglow Party Manager</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
                    Civic
                  </span>
                </button>
              )}
              {onNavigateTicketing && (
                <button
                  onClick={() => {
                    onNavigateTicketing();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-between"
                >
                  <span>Paperglow Ticketing</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">
                    Support
                  </span>
                </button>
              )}
              {onNavigateBooking && (
                <button
                  onClick={() => {
                    onNavigateBooking();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-between"
                >
                  <span>Paperglow Booking</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                    Appointments
                  </span>
                </button>
              )}
              {onNavigateStockInventory && (
                <button
                  onClick={() => {
                    onNavigateStockInventory();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md flex items-center justify-between"
                >
                  <span>Paperglow Stock Inventory</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">
                    Stock
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  onNavigateBranding();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
              >
                Branding &amp; Customization
              </button>
              <button
                onClick={() => {
                  onNavigateSection('how-it-works');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
              >
                How It Works
              </button>
              <div className="pt-2 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCart();
                  }}
                  className="w-full py-2 text-center text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center space-x-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Customization Cart ({cartCount})</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-red-600 text-white"
                >
                  {isLoggedIn ? 'Manage Paperglow Account' : 'Sign In / Register'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
