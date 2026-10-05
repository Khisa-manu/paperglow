import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { AccountPage } from './pages/AccountPage';
import { BrandingPage } from './pages/BrandingPage';
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
  const [currentView, setCurrentView] = useState<'home' | 'applications' | 'application-detail' | 'account' | 'branding'>('home');
  const [selectedAppId, setSelectedAppId] = useState<string>('paperglow-invoice');

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
    return saved ? JSON.parse(saved) : ['paperglow-invoice', 'paperglow-crm'];
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

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('paperglow_theme_dark') === 'true';
  });

  // URL Hash Synchronizer for deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleUpdateProfile = (updated: Partial<CustomerProfile>) => {
    setCustomerProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Subscription Toggle Handler
  const toggleSubscription = (appId: string) => {
    const app = APPLICATIONS_CATALOG.find((a) => a.id === appId);
    if (subscribedAppIds.includes(appId)) {
      setSubscribedAppIds(subscribedAppIds.filter((id) => id !== appId));
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
          status: 'Paid',
        };
        setSoftwareOrders((prev) => [newOrder, ...prev]);
      }
    }
  };

  // Cart & Order Handlers
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [item, ...prev]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
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
      status: 'Proofing',
      estimatedDelivery: '7–10 business days (Pending proof approval)',
      artworkApproved: false,
    }));

    setMerchandiseOrders((prev) => [...newOrders, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    navigateAccount();
  };

  const handleApproveArtworkProof = (orderId: string) => {
    setMerchandiseOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, artworkApproved: true, status: 'In Production' }
          : ord
      )
    );
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

  const navigateBranding = () => {
    window.location.hash = 'branding';
    setCurrentView('branding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateAccount = () => {
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

  const currentDetailApp =
    APPLICATIONS_CATALOG.find((a) => a.id === selectedAppId) || APPLICATIONS_CATALOG[0];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f1115] text-neutral-900 dark:text-neutral-100 transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        isLoggedIn={isLoggedIn}
        userName={customerProfile.name}
        subscribedAppCount={subscribedAppIds.length}
        cartCount={cartItems.length}
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)}
        onOpenAccount={navigateAccount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={navigateHome}
        onNavigateApplications={navigateApplications}
        onNavigateBranding={navigateBranding}
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
            onLaunchApp={() => navigateAccount()}
            onNavigateHome={navigateHome}
          />
        )}

        {currentView === 'application-detail' && currentDetailApp && (
          <ApplicationDetailPage
            app={currentDetailApp}
            isSubscribed={subscribedAppIds.includes(currentDetailApp.id)}
            onToggleSubscription={toggleSubscription}
            onLaunchApp={() => navigateAccount()}
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

        {currentView === 'account' && (
          <AccountPage
            isLoggedIn={isLoggedIn}
            profile={customerProfile}
            apps={APPLICATIONS_CATALOG}
            subscribedAppIds={subscribedAppIds}
            softwareOrders={softwareOrders}
            merchandiseOrders={merchandiseOrders}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            onToggleSubscription={toggleSubscription}
            onApproveArtworkProof={handleApproveArtworkProof}
            onLaunchApp={() => navigateAccount()}
            onNavigateHome={navigateHome}
            onNavigateToDirectory={navigateApplications}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={navigateToSection}
        onOpenAccount={navigateAccount}
      />

      {/* Software Quick Preview Modal */}
      <AppDetailModal
        app={modalApp}
        isSubscribed={modalApp ? subscribedAppIds.includes(modalApp.id) : false}
        onToggleSubscription={toggleSubscription}
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
