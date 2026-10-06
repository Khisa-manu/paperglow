import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WorkspaceAppSwitcher } from './components/WorkspaceAppSwitcher';
import { WORKSPACE_VIEWS, AppViewType } from './data/appsNavigationConfig';
import { HomePage } from './pages/HomePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { AccountPage } from './pages/AccountPage';
import { BrandingPage } from './pages/BrandingPage';
import { InvoiceGeneratorPage } from './pages/InvoiceGeneratorPage';
import { BusinessManagerPage } from './pages/BusinessManagerPage';
import { PropertyManagerPage } from './pages/PropertyManagerPage';
import { PharmacyManagerPage } from './pages/PharmacyManagerPage';
import { PartyManagerPage } from './pages/PartyManagerPage';
import { TicketingPage } from './pages/TicketingPage';
import { BookingPage } from './pages/BookingPage';
import { StockInventoryPage } from './pages/StockInventoryPage';
import { LegalPracticePage } from './pages/LegalPracticePage';
import { SchoolManagerPage } from './pages/SchoolManagerPage';
import { ChamaManagerPage } from './pages/ChamaManagerPage';
import { ClinicManagerPage } from './pages/ClinicManagerPage';
import { AppDetailModal } from './components/AppDetailModal';
import { ProductConfiguratorModal } from './components/ProductConfiguratorModal';
import { CartDrawer } from './components/CartDrawer';
import { AccountDashboardModal } from './components/AccountDashboardModal';
import {
  APPLICATIONS_CATALOG,
  BRANDING_PRODUCTS,
  DEFAULT_CUSTOMER_PROFILE,
  DEFAULT_SOFTWARE_ORDERS,
  DEFAULT_MERCHANDISE_ORDERS,
} from './data/paperglowData';
import {
  BusinessApp,
  BrandingProduct,
  CustomerProfile,
  SoftwareOrder,
  MerchandiseOrder,
  CartItem,
} from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'applications' | 'application-detail' | 'account' | 'branding' | 'invoice-generator' | 'business-manager' | 'property-manager' | 'pharmacy-manager' | 'party-manager' | 'ticketing' | 'booking' | 'stock-inventory' | 'legal-practice' | 'school-manager' | 'chama-manager' | 'clinic-manager'>('home');
  const [selectedAppId, setSelectedAppId] = useState<string>('paperglow-business-manager');

  // Customer Account & Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('paperglow_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('paperglow_customer_profile');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER_PROFILE;
  });

  const [subscribedAppIds, setSubscribedAppIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('paperglow_subscribed_apps');
    return saved ? JSON.parse(saved) : ['paperglow-business-manager', 'paperglow-property-manager', 'paperglow-pharmacy-manager', 'paperglow-party-manager', 'paperglow-ticketing', 'paperglow-booking', 'paperglow-stock-inventory', 'paperglow-legal-practice', 'paperglow-school-manager', 'paperglow-chama-manager', 'paperglow-clinic-manager', 'paperglow-invoice-generator', 'paperglow-invoice', 'paperglow-crm'];
  });

  const [softwareOrders, setSoftwareOrders] = useState<SoftwareOrder[]>(() => {
    const saved = localStorage.getItem('paperglow_software_orders');
    return saved ? JSON.parse(saved) : DEFAULT_SOFTWARE_ORDERS;
  });

  const [merchandiseOrders, setMerchandiseOrders] = useState<MerchandiseOrder[]>(() => {
    const saved = localStorage.getItem('paperglow_merchandise_orders');
    return saved ? JSON.parse(saved) : DEFAULT_MERCHANDISE_ORDERS;
  });

  // Shopping Cart & Product Customizer State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('paperglow_customization_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedConfigProduct, setSelectedConfigProduct] = useState<BrandingProduct | null>(null);
  const [modalApp, setModalApp] = useState<BusinessApp | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'overview' | 'subscribed' | 'available' | 'merch' | 'orders' | 'profile'>('overview');
  const [ssoTargetApp, setSsoTargetApp] = useState<BusinessApp | null>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('paperglow_theme_dark') === 'true';
  });

  // URL Hash Synchronizer for deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'business-manager' || hash === 'biz' || hash === 'manager') {
        setCurrentView('business-manager');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'property-manager' || hash === 'properties' || hash === 'pm' || hash === 'rent') {
        setCurrentView('property-manager');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'pharmacy-manager' || hash === 'pharmacy' || hash === 'chemist') {
        setCurrentView('pharmacy-manager');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'party-manager' || hash === 'political-party' || hash === 'party') {
        setCurrentView('party-manager');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'invoice-generator' || hash === 'invoice' || hash === 'quotation') {
        setCurrentView('invoice-generator');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'ticketing' || hash === 'tickets' || hash === 'support') {
        setCurrentView('ticketing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'booking' || hash === 'appointments' || hash === 'book') {
        setCurrentView('booking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'stock-inventory' || hash === 'inventory' || hash === 'stock') {
        setCurrentView('stock-inventory');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'legal-practice' || hash === 'legal' || hash === 'law' || hash === 'advocate' || hash === 'advocates') {
        setCurrentView('legal-practice');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'school-manager' || hash === 'school' || hash === 'academy' || hash === 'shule') {
        setCurrentView('school-manager');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'chama-manager' || hash === 'chama' || hash === 'ushirika' || hash === 'sacco') {
        setCurrentView('chama-manager');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'clinic-manager' || hash === 'clinic' || hash === 'medical' || hash === 'opd') {
        setCurrentView('clinic-manager');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'branding') {
        setCurrentView('branding');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === 'account') {
        setCurrentView('account');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
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

  // Sync to local storage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('paperglow_theme_dark', isDark ? 'true' : 'false');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('paperglow_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('paperglow_customer_profile', JSON.stringify(customerProfile));
  }, [customerProfile]);

  useEffect(() => {
    localStorage.setItem('paperglow_subscribed_apps', JSON.stringify(subscribedAppIds));
  }, [subscribedAppIds]);

  useEffect(() => {
    localStorage.setItem('paperglow_software_orders', JSON.stringify(softwareOrders));
  }, [softwareOrders]);

  useEffect(() => {
    localStorage.setItem('paperglow_merchandise_orders', JSON.stringify(merchandiseOrders));
  }, [merchandiseOrders]);

  useEffect(() => {
    localStorage.setItem('paperglow_customization_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Auth Handlers
  const [appToast, setAppToast] = useState<string | null>(null);

  const triggerAppToast = (msg: string) => {
    setAppToast(msg);
    setTimeout(() => {
      setAppToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleLogin = (email: string, name?: string, company?: string) => {
    setIsLoggedIn(true);
    if (name || company) {
      setCustomerProfile((prev) => ({
        ...prev,
        name: name || prev.name,
        companyName: company || prev.companyName,
        email: email,
      }));
    }
    triggerAppToast(`Signed in as ${name || email}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    triggerAppToast('Signed out of Paperglow account');
  };

  const handleUpdateProfile = (updated: Partial<CustomerProfile>) => {
    setCustomerProfile((prev) => ({
      ...prev,
      ...updated,
    }));
    triggerAppToast('Account profile settings saved');
  };

  // Subscription Toggle Handler
  const toggleSubscription = (appId: string) => {
    const app = APPLICATIONS_CATALOG.find((a) => a.id === appId);
    if (subscribedAppIds.includes(appId)) {
      setSubscribedAppIds(subscribedAppIds.filter((id) => id !== appId));
      if (app) triggerAppToast(`${app.name} removed from active subscriptions`);
    } else {
      setSubscribedAppIds([...subscribedAppIds, appId]);
      if (app) {
        const newOrder: SoftwareOrder = {
          id: `ord_sw_${Date.now()}`,
          orderNumber: `PG-SW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          appName: app.name,
          tier: 'Professional Workspace',
          billingCadence: 'monthly',
          amount: app.monthlyPrice,
          currency: 'KES',
          status: 'Paid',
        };
        setSoftwareOrders((prev) => [newOrder, ...prev]);
        triggerAppToast(`Subscribed to ${app.name} workspace`);
      }
    }
  };

  // Cart & Order Handlers
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [item, ...prev]);
    setIsCartOpen(true);
    triggerAppToast(`Added "${item.title}" (${item.quantity} units) to cart`);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    triggerAppToast('Item removed from customization cart');
  };

  const handleCheckoutCart = () => {
    // Convert cart items into official MerchandiseOrder records
    const newOrders: MerchandiseOrder[] = cartItems.map((item, idx) => ({
      id: `ord_mc_${Date.now()}_${idx}`,
      orderNumber: `PG-MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      itemTitle: item.title,
      category: item.category,
      quantity: item.quantity,
      specs: `${Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(' · ')} (${item.customInstructions})`,
      totalAmount: item.totalPrice,
      currency: 'KES',
      status: 'Proofing',
      estimatedDelivery: '7–10 business days (Pending proof approval)',
      artworkApproved: false,
    }));

    setMerchandiseOrders((prev) => [...newOrders, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    navigateAccount('merch');
    triggerAppToast(`Order submitted! ${newOrders.length} print job(s) queued for proofing.`);
  };

  const handleApproveArtworkProof = (orderId: string) => {
    setMerchandiseOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, artworkApproved: true, status: 'In Production' }
          : ord
      )
    );
    triggerAppToast('Artwork proof approved and moved to production');
  };

  // Navigation Handlers
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

  const navigateInvoiceGenerator = () => {
    window.location.hash = 'invoice-generator';
    setCurrentView('invoice-generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBusinessManager = () => {
    window.location.hash = 'business-manager';
    setCurrentView('business-manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigatePropertyManager = () => {
    window.location.hash = 'property-manager';
    setCurrentView('property-manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigatePharmacyManager = () => {
    window.location.hash = 'pharmacy-manager';
    setCurrentView('pharmacy-manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigatePartyManager = () => {
    window.location.hash = 'party-manager';
    setCurrentView('party-manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTicketing = () => {
    window.location.hash = 'ticketing';
    setCurrentView('ticketing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBooking = () => {
    window.location.hash = 'booking';
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateStockInventory = () => {
    window.location.hash = 'stock-inventory';
    setCurrentView('stock-inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateLegalPractice = () => {
    window.location.hash = 'legal-practice';
    setCurrentView('legal-practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateSchoolManager = () => {
    window.location.hash = 'school-manager';
    setCurrentView('school-manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateChamaManager = () => {
    window.location.hash = 'chama-manager';
    setCurrentView('chama-manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateClinicManager = () => {
    window.location.hash = 'clinic-manager';
    setCurrentView('clinic-manager');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBranding = () => {
    window.location.hash = 'branding';
    setCurrentView('branding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateAccount = (tab?: 'overview' | 'subscribed' | 'available' | 'merch' | 'orders' | 'profile') => {
    if (tab) setAccountTab(tab);
    window.location.hash = 'account';
    setCurrentView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAppDetail = (appId: string) => {
    setSelectedAppId(appId);
    window.location.hash = `app/${appId}`;
    setCurrentView('application-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (view: AppViewType) => {
    switch (view) {
      case 'home':
        return navigateHome();
      case 'applications':
        return navigateApplications();
      case 'branding':
        return navigateBranding();
      case 'account':
        return navigateAccount();
      case 'invoice-generator':
        return navigateInvoiceGenerator();
      case 'business-manager':
        return navigateBusinessManager();
      case 'property-manager':
        return navigatePropertyManager();
      case 'pharmacy-manager':
        return navigatePharmacyManager();
      case 'party-manager':
        return navigatePartyManager();
      case 'ticketing':
        return navigateTicketing();
      case 'booking':
        return navigateBooking();
      case 'stock-inventory':
        return navigateStockInventory();
      case 'legal-practice':
        return navigateLegalPractice();
      case 'school-manager':
        return navigateSchoolManager();
      case 'chama-manager':
        return navigateChamaManager();
      case 'clinic-manager':
        return navigateClinicManager();
      default:
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentDetailApp =
    APPLICATIONS_CATALOG.find((a) => a.id === selectedAppId) || APPLICATIONS_CATALOG[0];

  const isWorkspaceView = WORKSPACE_VIEWS.includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f1115] text-neutral-900 dark:text-neutral-100 transition-colors duration-150">
      {/* Subtle Global Micro-interaction Toast */}
      {appToast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold shadow-xl border border-neutral-700/80 dark:border-neutral-300 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
          <span>{appToast}</span>
        </div>
      )}

      {/* Top Navbar (Shown on Portal/Directory/Branding/Account pages; hidden inside standalone SaaS Workspaces so each app uses its own clean sidebar) */}
      {!isWorkspaceView && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigateView}
          onSelectAppDetail={navigateToAppDetail}
          isLoggedIn={isLoggedIn}
          customerName={customerProfile.name}
          subscribedCount={subscribedAppIds.length}
          cartCount={cartItems.length}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Compact App Switcher inside standalone SaaS Workspaces */}
      {isWorkspaceView && (
        <WorkspaceAppSwitcher
          currentView={currentView}
          onNavigate={handleNavigateView}
          onSelectAppDetail={navigateToAppDetail}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomePage
            subscribedAppIds={subscribedAppIds}
            onToggleSubscription={toggleSubscription}
            onViewAppDetail={(app) => setModalApp(app)}
            onSelectAppDetail={navigateToAppDetail}
            onViewBrandingDetail={(item) => setSelectedConfigProduct(item)}
            onOpenAccount={navigateAccount}
            onNavigateSection={navigateToSection}
            onNavigateToDirectory={navigateApplications}
            onNavigateToBranding={navigateBranding}
          />
        )}

        {currentView === 'applications' && (
          <ApplicationsPage
            subscribedAppIds={subscribedAppIds}
            onToggleSubscription={toggleSubscription}
            onSelectAppDetail={navigateToAppDetail}
            onLaunchApp={(app) => {
              if (app.id === 'paperglow-business-manager') {
                navigateBusinessManager();
              } else if (app.id === 'paperglow-property-manager') {
                navigatePropertyManager();
              } else if (app.id === 'paperglow-pharmacy-manager') {
                navigatePharmacyManager();
              } else if (app.id === 'paperglow-party-manager') {
                navigatePartyManager();
              } else if (app.id === 'paperglow-ticketing') {
                navigateTicketing();
              } else if (app.id === 'paperglow-booking') {
                navigateBooking();
              } else if (app.id === 'paperglow-stock-inventory') {
                navigateStockInventory();
              } else if (app.id === 'paperglow-legal-practice') {
                navigateLegalPractice();
              } else if (app.id === 'paperglow-school-manager') {
                navigateSchoolManager();
              } else if (app.id === 'paperglow-chama-manager') {
                navigateChamaManager();
              } else if (app.id === 'paperglow-clinic-manager') {
                navigateClinicManager();
              } else if (app.id === 'paperglow-invoice-generator') {
                navigateInvoiceGenerator();
              } else {
                setSsoTargetApp(app);
                navigateAccount('subscribed');
              }
            }}
            onNavigateHome={navigateHome}
          />
        )}

        {currentView === 'application-detail' && currentDetailApp && (
          <ApplicationDetailPage
            app={currentDetailApp}
            isSubscribed={subscribedAppIds.includes(currentDetailApp.id)}
            onToggleSubscription={toggleSubscription}
            onLaunchApp={(app) => {
              if (app.id === 'paperglow-business-manager') {
                navigateBusinessManager();
              } else if (app.id === 'paperglow-property-manager') {
                navigatePropertyManager();
              } else if (app.id === 'paperglow-pharmacy-manager') {
                navigatePharmacyManager();
              } else if (app.id === 'paperglow-party-manager') {
                navigatePartyManager();
              } else if (app.id === 'paperglow-ticketing') {
                navigateTicketing();
              } else if (app.id === 'paperglow-booking') {
                navigateBooking();
              } else if (app.id === 'paperglow-stock-inventory') {
                navigateStockInventory();
              } else if (app.id === 'paperglow-legal-practice') {
                navigateLegalPractice();
              } else if (app.id === 'paperglow-school-manager') {
                navigateSchoolManager();
              } else if (app.id === 'paperglow-chama-manager') {
                navigateChamaManager();
              } else if (app.id === 'paperglow-clinic-manager') {
                navigateClinicManager();
              } else if (app.id === 'paperglow-invoice-generator') {
                navigateInvoiceGenerator();
              } else {
                setSsoTargetApp(app);
                navigateAccount('subscribed');
              }
            }}
            onBackToDirectory={navigateApplications}
            onOpenAccount={navigateAccount}
          />
        )}

        {currentView === 'branding' && (
          <BrandingPage
            cartCount={cartItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            onSelectProduct={(product) => setSelectedConfigProduct(product)}
            onNavigateHome={navigateHome}
          />
        )}

        {currentView === 'business-manager' && (
          <BusinessManagerPage
            onNavigateHome={navigateHome}
            onBackToDirectory={navigateApplications}
            onOpenAccount={navigateAccount}
          />
        )}

        {currentView === 'property-manager' && (
          <PropertyManagerPage
            onNavigateHome={navigateHome}
            onBackToDirectory={navigateApplications}
            onOpenAccount={navigateAccount}
          />
        )}

        {currentView === 'pharmacy-manager' && (
          <PharmacyManagerPage
            onNavigateHome={navigateHome}
            onBackToDirectory={navigateApplications}
          />
        )}

        {currentView === 'party-manager' && (
          <PartyManagerPage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'ticketing' && (
          <TicketingPage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'booking' && (
          <BookingPage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'stock-inventory' && (
          <StockInventoryPage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'legal-practice' && (
          <LegalPracticePage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'school-manager' && (
          <SchoolManagerPage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'chama-manager' && (
          <ChamaManagerPage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'clinic-manager' && (
          <ClinicManagerPage
            onBackToPaperglow={navigateHome}
          />
        )}

        {currentView === 'invoice-generator' && (
          <InvoiceGeneratorPage
            onBackToDirectory={navigateApplications}
            onNavigateHome={navigateHome}
            onOpenAccount={navigateAccount}
          />
        )}

        {currentView === 'account' && (
          <AccountPage
            isLoggedIn={isLoggedIn}
            profile={customerProfile}
            apps={APPLICATIONS_CATALOG}
            subscribedAppIds={subscribedAppIds}
            softwareOrders={softwareOrders}
            merchandiseOrders={merchandiseOrders}
            initialTab={accountTab}
            initialSsoApp={ssoTargetApp}
            onClearInitialSsoApp={() => setSsoTargetApp(null)}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            onToggleSubscription={toggleSubscription}
            onApproveArtworkProof={handleApproveArtworkProof}
            onLaunchApp={(app) => {
              if (app.id === 'paperglow-business-manager') {
                navigateBusinessManager();
              } else if (app.id === 'paperglow-property-manager') {
                navigatePropertyManager();
              } else if (app.id === 'paperglow-pharmacy-manager') {
                navigatePharmacyManager();
              } else if (app.id === 'paperglow-party-manager') {
                navigatePartyManager();
              } else if (app.id === 'paperglow-ticketing') {
                navigateTicketing();
              } else if (app.id === 'paperglow-booking') {
                navigateBooking();
              } else if (app.id === 'paperglow-stock-inventory') {
                navigateStockInventory();
              } else if (app.id === 'paperglow-legal-practice') {
                navigateLegalPractice();
              } else if (app.id === 'paperglow-school-manager') {
                navigateSchoolManager();
              } else if (app.id === 'paperglow-chama-manager') {
                navigateChamaManager();
              } else if (app.id === 'paperglow-clinic-manager') {
                navigateClinicManager();
              } else if (app.id === 'paperglow-invoice-generator') {
                navigateInvoiceGenerator();
              } else {
                setSsoTargetApp(app);
                navigateAccount('subscribed');
              }
            }}
            onNavigateHome={navigateHome}
            onNavigateToDirectory={navigateApplications}
          />
        )}
      </main>

      {/* Footer */}
      {!isWorkspaceView && (
        <Footer
          onNavigateSection={navigateToSection}
          onOpenAccount={navigateAccount}
        />
      )}

      {/* Software Quick Preview Modal */}
      <AppDetailModal
        app={modalApp}
        isSubscribed={modalApp ? subscribedAppIds.includes(modalApp.id) : false}
        onToggleSubscription={toggleSubscription}
        onViewFullDetail={(appId) => {
          setModalApp(null);
          navigateToAppDetail(appId);
        }}
        onClose={() => setModalApp(null)}
      />

      {/* Merchandise Product Configurator Modal */}
      <ProductConfiguratorModal
        product={selectedConfigProduct}
        onClose={() => setSelectedConfigProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Customization Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutCart}
      />

      {/* Central Account Dashboard Modal */}
      <AccountDashboardModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        apps={APPLICATIONS_CATALOG}
        subscribedAppIds={subscribedAppIds}
        onToggleSubscription={toggleSubscription}
        brandingInquiries={merchandiseOrders.map((o) => `${o.itemTitle} (${o.quantity} units)`)}
        onExploreApps={navigateApplications}
      />
    </div>
  );
};

export default App;
