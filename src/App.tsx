import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { AppDetailModal } from './components/AppDetailModal';
import { BrandingModal } from './components/BrandingModal';
import { AccountDashboardModal } from './components/AccountDashboardModal';
import { APPLICATIONS_CATALOG } from './data/paperglowData';
import { BusinessApp, BrandingItem } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'applications' | 'application-detail'>('home');
  const [selectedAppId, setSelectedAppId] = useState<string>('paperglow-invoice');

  const [subscribedAppIds, setSubscribedAppIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('paperglow_subscribed_apps');
    return saved ? JSON.parse(saved) : ['paperglow-invoice', 'paperglow-crm'];
  });

  const [brandingInquiries, setBrandingInquiries] = useState<string[]>(() => {
    const saved = localStorage.getItem('paperglow_branding_inquiries');
    return saved ? JSON.parse(saved) : ['Custom Uniforms & Polos (50 units)'];
  });

  const [modalApp, setModalApp] = useState<BusinessApp | null>(null);
  const [selectedBrandingItem, setSelectedBrandingItem] = useState<BrandingItem | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('paperglow_theme_dark') === 'true';
  });

  // URL Hash Synchronizer for scalable deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('app/')) {
        const id = hash.replace('app/', '');
        if (APPLICATIONS_CATALOG.some((a) => a.id === id)) {
          setSelectedAppId(id);
          setCurrentView('application-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      if (hash === 'applications') {
        setCurrentView('applications');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'home' || hash === '') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    if (currentView !== 'home') {
      window.location.hash = 'home';
      setCurrentView('home');
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateHome = () => {
    window.location.hash = 'home';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateApplications = () => {
    window.location.hash = 'applications';
    setCurrentView('applications');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAppDetail = (appId: string) => {
    setSelectedAppId(appId);
    window.location.hash = `app/${appId}`;
    setCurrentView('application-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchApp = (app: BusinessApp) => {
    setIsAccountModalOpen(true);
  };

  const currentDetailApp =
    APPLICATIONS_CATALOG.find((a) => a.id === selectedAppId) || APPLICATIONS_CATALOG[0];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f1115] text-neutral-900 dark:text-neutral-100 transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        subscribedAppCount={subscribedAppIds.length}
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onNavigateHome={navigateHome}
        onNavigateApplications={navigateApplications}
        onNavigateSection={navigateToSection}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomePage
            subscribedAppIds={subscribedAppIds}
            onToggleSubscription={toggleSubscription}
            onViewAppDetail={(app) => setModalApp(app)}
            onSelectAppDetail={navigateToAppDetail}
            onViewBrandingDetail={(item) => setSelectedBrandingItem(item)}
            onOpenAccount={() => setIsAccountModalOpen(true)}
            onNavigateSection={navigateToSection}
            onNavigateToDirectory={navigateApplications}
          />
        )}

        {currentView === 'applications' && (
          <ApplicationsPage
            subscribedAppIds={subscribedAppIds}
            onToggleSubscription={toggleSubscription}
            onSelectAppDetail={navigateToAppDetail}
            onLaunchApp={handleLaunchApp}
            onNavigateHome={navigateHome}
          />
        )}

        {currentView === 'application-detail' && currentDetailApp && (
          <ApplicationDetailPage
            app={currentDetailApp}
            isSubscribed={subscribedAppIds.includes(currentDetailApp.id)}
            onToggleSubscription={toggleSubscription}
            onLaunchApp={handleLaunchApp}
            onBackToDirectory={navigateApplications}
            onOpenAccount={() => setIsAccountModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={navigateToSection}
        onOpenAccount={() => setIsAccountModalOpen(true)}
      />

      {/* Quick Preview Modal */}
      <AppDetailModal
        app={modalApp}
        isSubscribed={modalApp ? subscribedAppIds.includes(modalApp.id) : false}
        onToggleSubscription={toggleSubscription}
        onClose={() => setModalApp(null)}
      />

      {/* Merchandise Inquiry Modal */}
      <BrandingModal
        item={selectedBrandingItem}
        onClose={() => setSelectedBrandingItem(null)}
        onInquirySubmitted={handleInquirySubmitted}
      />

      {/* Central Account Dashboard Modal */}
      <AccountDashboardModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        apps={APPLICATIONS_CATALOG}
        subscribedAppIds={subscribedAppIds}
        onToggleSubscription={toggleSubscription}
        brandingInquiries={brandingInquiries}
        onExploreApps={navigateApplications}
      />
    </div>
  );
};

export default App;
