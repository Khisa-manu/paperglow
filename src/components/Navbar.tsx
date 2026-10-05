import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  subscribedAppCount: number;
  isDark: boolean;
  toggleDarkMode: () => void;
  onOpenAccount: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  subscribedAppCount,
  isDark,
  toggleDarkMode,
  onOpenAccount,
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

  const navLinks = [
    { id: 'hero', label: 'Overview' },
    { id: 'applications', label: 'Business Applications' },
    { id: 'account', label: 'One Account' },
    { id: 'branding', label: 'Branding & Customization' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'why-paperglow', label: 'Why Paperglow' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setIsMobileMenuOpen(false);
  };

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
            onClick={() => handleLinkClick('hero')}
            className="flex items-center space-x-2 text-left group focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
            <span className="text-xl font-bold tracking-tight font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Paperglow
            </span>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
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

            {/* Paperglow Account Button */}
            <button
              onClick={onOpenAccount}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>
                {subscribedAppCount > 0 ? `My Account (${subscribedAppCount} Apps)` : 'My Account'}
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
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="text-left px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-red-600 text-white"
                >
                  Access Paperglow Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
