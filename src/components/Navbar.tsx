import React, { useState, useEffect } from 'react';
import { THEME_SCHEMES } from '../data/portfolioData';
import { ThemeScheme } from '../types';
import { Sun, Moon, Palette, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  themeScheme: ThemeScheme;
  setThemeScheme: (scheme: ThemeScheme) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  themeScheme,
  setThemeScheme,
  isDark,
  toggleDarkMode,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'services', label: 'Services' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-base/90 backdrop-blur-md border-b border-divider py-3.5 shadow-sm'
          : 'bg-base/40 backdrop-blur-sm py-5'
      }`}
      style={{
        backgroundColor: isScrolled
          ? isDark ? 'rgba(15, 17, 21, 0.92)' : 'rgba(255, 255, 255, 0.92)'
          : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="group text-left focus:outline-none flex items-center space-x-2"
          >
            <span className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: 'var(--color-primary)' }}></span>
            <span className="font-extrabold tracking-tight text-xl uppercase font-['Poppins']">
              Creative<span className="font-light opacity-80">Agency</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all relative ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted hover:text-contrast'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons: Theme Picker, Dark Mode, Contact CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Palette Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className="p-2 rounded-full hover:bg-surface border border-divider text-muted hover:text-contrast transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Change Color Theme"
              >
                <Palette className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <span className="capitalize hidden lg:inline">{themeScheme}</span>
              </button>

              {isPaletteOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl bg-surface border border-divider shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  style={{ backgroundColor: isDark ? '#1a1f2c' : '#ffffff' }}
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider border-b border-divider">
                    Color Themes
                  </div>
                  <div className="py-1">
                    {THEME_SCHEMES.map((scheme) => (
                      <button
                        key={scheme.id}
                        onClick={() => {
                          setThemeScheme(scheme.id);
                          setIsPaletteOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                          themeScheme === scheme.id ? 'font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: scheme.primaryColor }}
                          />
                          <span>{scheme.label}</span>
                        </div>
                        {themeScheme === scheme.id && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--color-primary)' }}>Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface border border-divider text-muted hover:text-contrast transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-all hover:opacity-95 hover:shadow flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Let&apos;s talk</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-divider text-muted"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-divider text-contrast focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            className="sm:hidden mt-3 pt-3 pb-6 border-t border-divider rounded-2xl p-4 shadow-xl"
            style={{ backgroundColor: isDark ? '#161a22' : '#ffffff' }}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    currentTab === link.id
                      ? 'text-primary font-bold bg-surface'
                      : 'text-muted hover:text-contrast'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-divider">
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Color Theme
              </div>
              <div className="grid grid-cols-3 gap-2">
                {THEME_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => {
                      setThemeScheme(scheme.id);
                    }}
                    className={`p-2 text-xs rounded-lg border flex items-center justify-center space-x-1.5 ${
                      themeScheme === scheme.id
                        ? 'border-primary font-semibold'
                        : 'border-divider'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: scheme.primaryColor }}
                    />
                    <span className="capitalize">{scheme.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-lg text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Start a Project
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
