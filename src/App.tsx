import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AppDetailModal } from './components/AppDetailModal';
import { BrandingModal } from './components/BrandingModal';
import { AccountDashboardModal } from './components/AccountDashboardModal';
import { FEATURED_APPLICATIONS } from './data/paperglowData';
import { BusinessApp, BrandingItem } from './types';

export const App: React.FC = () => {
  const [subscribedAppIds, setSubscribedAppIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('paperglow_subscribed_apps');
    return saved ? JSON.parse(saved) : ['paperglow-invoice', 'paperglow-crm'];
  });

  const [brandingInquiries, setBrandingInquiries] = useState<string[]>(() => {
    const saved = localStorage.getItem('paperglow_branding_inquiries');
    return saved ? JSON.parse(saved) : ['Custom Uniforms & Polos (50 units)'];
  });

  const [selectedApp, setSelectedApp] = useState<BusinessApp | null>(null);
  const [selectedBrandingItem, setSelectedBrandingItem] = useState<BrandingItem | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('paperglow_theme_dark') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('paperglow_theme_dark', isDark ? 'true' : 'false');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('paperglow_subscribed_apps', JSON.stringify(subscribedAppIds));
  }, [subscribedAppIds]);

  useEffect(() => {
    localStorage.setItem('paperglow_branding_inquiries', JSON.stringify(brandingInquiries));
  }, [brandingInquiries]);

  const toggleSubscription = (appId: string) => {
    if (subscribedAppIds.includes(appId)) {
      setSubscribedAppIds(subscribedAppIds.filter((id) => id !== appId));
    } else {
      setSubscribedAppIds([...subscribedAppIds, appId]);
    }
  };

  const handleInquirySubmitted = (itemName: string) => {
    setBrandingInquiries((prev) => [`${itemName} Quote Request`, ...prev]);
    setSelectedBrandingItem(null);
  };

  const navigateToSection = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f1115] text-neutral-900 dark:text-neutral-100 transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        subscribedAppCount={subscribedAppIds.length}
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onNavigateSection={navigateToSection}
      />

      {/* Main Content Area: Paperglow Homepage */}
      <main className="flex-grow">
        <HomePage
          subscribedAppIds={subscribedAppIds}
          onToggleSubscription={toggleSubscription}
          onViewAppDetail={(app) => setSelectedApp(app)}
          onViewBrandingDetail={(item) => setSelectedBrandingItem(item)}
          onOpenAccount={() => setIsAccountModalOpen(true)}
          onNavigateSection={navigateToSection}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={navigateToSection}
        onOpenAccount={() => setIsAccountModalOpen(true)}
      />

      {/* Modals */}
      <AppDetailModal
        app={selectedApp}
        isSubscribed={selectedApp ? subscribedAppIds.includes(selectedApp.id) : false}
        onToggleSubscription={toggleSubscription}
        onClose={() => setSelectedApp(null)}
      />

      <BrandingModal
        item={selectedBrandingItem}
        onClose={() => setSelectedBrandingItem(null)}
        onInquirySubmitted={handleInquirySubmitted}
      />

      <AccountDashboardModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        apps={FEATURED_APPLICATIONS}
        subscribedAppIds={subscribedAppIds}
        onToggleSubscription={toggleSubscription}
        brandingInquiries={brandingInquiries}
        onExploreApps={() => navigateToSection('applications')}
      />
    </div>
  );
};

export default App;
