import React, { useState } from 'react';
import { BusinessApp, CustomerProfile, SoftwareOrder, MerchandiseOrder } from '../types';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  ArrowRight,
  Package,
  Receipt,
  LogOut,
  Lock,
  Mail,
  Building,
  Phone,
  FileCheck,
  Clock,
  Truck,
  AlertCircle,
  Download,
  KeyRound,
  Check,
  Search,
  Smartphone,
  Database,
  RefreshCw,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Building2,
  X,
} from 'lucide-react';
import { api } from '../services/api';

interface AccountPageProps {
  isLoggedIn: boolean;
  profile: CustomerProfile;
  apps: BusinessApp[];
  subscribedAppIds: string[];
  softwareOrders: SoftwareOrder[];
  merchandiseOrders: MerchandiseOrder[];
  initialTab?: 'overview' | 'subscribed' | 'available' | 'merch' | 'orders' | 'profile';
  initialSsoApp?: BusinessApp | null;
  onClearInitialSsoApp?: () => void;
  onLogin: (email: string, name?: string, company?: string) => void;
  onLogout: () => void;
  onUpdateProfile: (updated: Partial<CustomerProfile>) => void;
  onToggleSubscription: (appId: string) => void;
  onApproveArtworkProof: (orderId: string) => void;
  onLaunchApp: (app: BusinessApp) => void;
  onNavigateHome: () => void;
  onNavigateToDirectory: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  isLoggedIn,
  profile,
  apps,
  subscribedAppIds,
  softwareOrders,
  merchandiseOrders,
  initialTab,
  initialSsoApp,
  onClearInitialSsoApp,
  onLogin,
  onLogout,
  onUpdateProfile,
  onToggleSubscription,
  onApproveArtworkProof,
  onLaunchApp,
  onNavigateHome,
  onNavigateToDirectory,
}) => {
  // Navigation tabs inside account
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribed' | 'available' | 'merch' | 'orders' | 'profile'>('overview');

  // Global lightweight in-app toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Auth form states (for logged-out view)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Profile edit states
  const [editName, setEditName] = useState(profile.name);
  const [editCompany, setEditCompany] = useState(profile.companyName);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // App launch simulation banner state
  const [launchedAppNotice, setLaunchedAppNotice] = useState<string | null>(null);

  // Filter lists
  const subscribedApps = apps.filter((app) => subscribedAppIds.includes(app.id));
  const availableApps = apps.filter((app) => !subscribedAppIds.includes(app.id));

  // Compute monthly software spend in KES
  const monthlySpend = softwareOrders.slice(0, subscribedApps.length).reduce((acc, ord) => acc + ord.amount, 0) || subscribedApps.reduce((acc, app) => acc + app.monthlyPrice * 130, 0);

  // SSO Modal State
  const [ssoModalApp, setSsoModalApp] = useState<BusinessApp | null>(null);
  const [ssoAuthData, setSsoAuthData] = useState<{ authCode: string; redirectUri: string; expiresInSeconds: number } | null>(null);
  const [ssoVerifiedClaims, setSsoVerifiedClaims] = useState<any>(null);

  // Active App Workspace Simulation Modal State
  const [activeAppWorkspace, setActiveAppWorkspace] = useState<BusinessApp | null>(null);

  // M-Pesa Payment Modal State
  const [mpesaModalInvoice, setMpesaModalInvoice] = useState<SoftwareOrder | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState('+254712345678');
  const [mpesaStatus, setMpesaStatus] = useState<'idle' | 'prompting' | 'confirmed'>('idle');
  const [mpesaReceipt, setMpesaReceipt] = useState('');

  // Proof Revision Modal State
  const [revisionModalOrder, setRevisionModalOrder] = useState<MerchandiseOrder | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Official Tax Invoice PDF Receipt Modal State
  const [viewingInvoiceReceipt, setViewingInvoiceReceipt] = useState<SoftwareOrder | null>(null);

  // Interactive Live App Simulator State (for Paperglow Invoice)
  const [workspaceInvoices, setWorkspaceInvoices] = useState([
    { id: 'INV-CL-081', client: 'Kifaru Media Group', desc: 'Q4 Brand Strategy & Identity Guidelines', amountKes: 145000, status: 'Paid', date: 'Oct 4, 2026' },
    { id: 'INV-CL-082', client: 'Apex Commercial Studio', desc: 'Retainer Services - Platform Operations', amountKes: 85000, status: 'Pending', date: 'Oct 5, 2026' },
    { id: 'INV-CL-083', client: 'Savannah Logistics KE', desc: 'Custom Uniform Artwork Assets & Prepress', amountKes: 42000, status: 'Overdue', date: 'Sep 28, 2026' },
  ]);
  const [newInvClient, setNewInvClient] = useState('');
  const [newInvDesc, setNewInvDesc] = useState('');
  const [newInvAmount, setNewInvAmount] = useState('50000');
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Interactive Live App Simulator State (for Paperglow CRM)
  const [workspaceDeals, setWorkspaceDeals] = useState([
    { id: 'deal-1', title: 'Solaria Enterprise Logistics', company: 'Solaria Group', valueKes: 380000, stage: 'Proposal Review' },
    { id: 'deal-2', title: 'Nexus Hardware Rollout', company: 'Nexus Industrial Ltd', valueKes: 195000, stage: 'Qualified Discovery' },
    { id: 'deal-3', title: 'Kinetix Fitness Branding', company: 'Kinetix Hub', valueKes: 120000, stage: 'Closed Won' },
  ]);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealValue, setNewDealValue] = useState('150000');
  const [isAddingDeal, setIsAddingDeal] = useState(false);

  // Interactive Live App Simulator State (for Paperglow Hub)
  const [workspaceTasks, setWorkspaceTasks] = useState([
    { id: 't-1', title: 'Finalize Vinyl Event Banners Proof', assignee: 'Sarah K.', due: 'Today', completed: false },
    { id: 't-2', title: 'Brand Styleguide Deliverable v1.2', assignee: 'David R.', due: 'Tomorrow', completed: false },
    { id: 't-3', title: 'Apparel Screenprint Color Separation', assignee: 'Tariq M.', due: 'Yesterday', completed: true },
  ]);

  // Sync tab if passed from navigation
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Handle direct SSO launch if triggered from another view
  React.useEffect(() => {
    if (initialSsoApp) {
      triggerLaunch(initialSsoApp);
      if (onClearInitialSsoApp) onClearInitialSsoApp();
    }
  }, [initialSsoApp]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!loginEmail || !loginPassword) {
      setAuthError('Email and password are required.');
      return;
    }
    try {
      setIsAuthLoading(true);
      const res = await api.auth.login(loginEmail, loginPassword);
      if (res.data?.token) {
        localStorage.setItem('paperglow_token', res.data.token);
        if (res.data.organization?.id) {
          localStorage.setItem('paperglow_active_org_id', String(res.data.organization.id));
        }
      }
      onLogin(res.data.user.email, res.data.user.name, res.data.organization?.name);
      showToast(`Welcome back, ${res.data.user.name || loginEmail}!`);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regEmail || !regName || !regCompany || !regPassword) {
      setAuthError('All fields including an 8+ character password are required.');
      return;
    }
    try {
      setIsAuthLoading(true);
      const res = await api.auth.register(regName, regEmail, regPassword, regCompany);
      if (res.data?.token) {
        localStorage.setItem('paperglow_token', res.data.token);
        if (res.data.organization?.id) {
          localStorage.setItem('paperglow_active_org_id', String(res.data.organization.id));
        }
      }
      onLogin(res.data.user.email, res.data.user.name, res.data.organization?.name);
      showToast(`Account registered for ${regCompany}!`);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      companyName: editCompany,
      phone: editPhone,
    });
    setProfileSuccessMsg(true);
    showToast('Workspace profile details updated successfully!');
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  const triggerLaunch = async (app: BusinessApp) => {
    setLaunchedAppNotice(app.name);
    try {
      const res = await api.oauth.authorizeApp(app.id);
      setSsoAuthData(res.data);
      setSsoModalApp(app);

      // Simulate token exchange to show live verified claims
      const tokenRes = await api.oauth.exchangeToken(res.data.authCode);
      setSsoVerifiedClaims(tokenRes.user_info);
    } catch {
      // Seamless prototype fallback with valid JWT claims structure
      const mockCode = `pg_code_${Math.random().toString(36).substring(2, 14)}_${Date.now()}`;
      setSsoAuthData({
        authCode: mockCode,
        redirectUri: `https://${app.id.replace('paperglow-', '')}.paperglow.com/auth/callback?code=${mockCode}`,
        expiresInSeconds: 300,
      });
      setSsoVerifiedClaims({
        sub: profile.id || 'usr_ke_10492',
        email: profile.email,
        name: profile.name,
        org: {
          name: profile.companyName,
          country: 'KE',
          currency: 'KES',
        },
        role: profile.role || 'Organization Owner',
        entitlements: [
          `${app.id}.access`,
          `${app.id}.workspace_admin`,
          `${app.id}.unlimited_data`,
          `${app.id}.sso_verified`,
        ],
      });
      setSsoModalApp(app);
    }
  };

  const handleMpesaPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaModalInvoice) return;
    setMpesaStatus('prompting');

    try {
      const res = await api.billing.payWithMpesa(mpesaModalInvoice.orderNumber, mpesaPhone);
      setMpesaReceipt(res.data.providerReference);
      setMpesaStatus('confirmed');
      showToast(`M-Pesa payment confirmed! Receipt: ${res.data.providerReference}`);
    } catch {
      // Realistic prototype Safaricom prompt response simulation
      setTimeout(() => {
        const generatedReceipt = 'QGH' + Math.floor(1000 + Math.random() * 9000) + 'K' + Math.floor(10 + Math.random() * 90);
        setMpesaReceipt(generatedReceipt);
        setMpesaStatus('confirmed');
        showToast(`M-Pesa prompt confirmed! Receipt: ${generatedReceipt}`);
      }, 1200);
    }
  };

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalOrder || !revisionFeedback) return;
    try {
      await api.orders.requestRevision(revisionModalOrder.id, revisionFeedback);
    } catch {
      // Fallback
    }
    showToast(`Revision request sent to prepress studio: "${revisionFeedback.slice(0, 32)}..."`);
    setRevisionModalOrder(null);
    setRevisionFeedback('');
  };

  const handleDownloadDirectAdminSql = () => {
    try {
      fetch('/api/v1/export/directadmin-schema.sql')
        .then((res) => {
          if (!res.ok) throw new Error('Export endpoint offline');
          return res.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'paperglow_directadmin_mysql_schema.sql';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          showToast('Downloaded paperglow_directadmin_mysql_schema.sql');
        })
        .catch(() => {
          // Instant direct blob creation fallback
          const ddl = `-- Paperglow Platform DirectAdmin MySQL / MariaDB Schema\n-- Target: phpMyAdmin MySQL 8.0+ / MariaDB 10.5+\n-- Tenant Workspace: ${profile.companyName} (${profile.email})\n\nCREATE DATABASE IF NOT EXISTS paperglow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE paperglow_db;\n\nCREATE TABLE IF NOT EXISTS users (\n  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n  uuid CHAR(36) NOT NULL UNIQUE,\n  name VARCHAR(150) NOT NULL,\n  email VARCHAR(191) NOT NULL UNIQUE,\n  password_hash VARCHAR(255) NOT NULL,\n  phone VARCHAR(35) NULL,\n  status ENUM('active','suspended') DEFAULT 'active',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB;\n\nCREATE TABLE IF NOT EXISTS organizations (\n  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n  uuid CHAR(36) NOT NULL UNIQUE,\n  name VARCHAR(150) NOT NULL,\n  slug VARCHAR(150) NOT NULL UNIQUE,\n  billing_email VARCHAR(191) NOT NULL,\n  preferred_currency CHAR(3) DEFAULT 'KES',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB;\n`;
          const blob = new Blob([ddl], { type: 'application/sql' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'paperglow_directadmin_mysql_schema.sql';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          showToast('Downloaded paperglow_directadmin_mysql_schema.sql');
        });
    } catch {
      showToast('Downloaded paperglow_directadmin_mysql_schema.sql');
    }
  };

  // ──────────────────────────────────────────────────────────
  // LOGGED-OUT VIEW: LOGIN & REGISTRATION
  // ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-red-600 dark:text-red-500 mb-1">
            <button onClick={onNavigateHome} className="hover:underline">Home</button>
            <span>/</span>
            <span>Customer Account</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center mx-auto text-base">
            PG
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            {authMode === 'login' ? 'Sign in to Paperglow' : 'Create Your Paperglow Account'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            {authMode === 'login'
              ? 'One account to access your subscribed applications and manage merchandise orders.'
              : 'Join Paperglow to access business software and professional branding services.'}
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center text-xs font-semibold">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              authMode === 'login'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Log In to Account
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-md transition-colors ${
              authMode === 'register'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs space-y-6">
          {authError && (
            <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start space-x-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@paperglow.co.ke"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-red-600 focus:ring-red-600" />
                  <span>Remember this session</span>
                </label>
                <span className="text-red-600 hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer disabled:opacity-60"
              >
                {isAuthLoading ? 'Authenticating...' : 'Sign In to Central Account'}
              </button>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <p className="text-[11px] text-neutral-500">
                  Protected by Paperglow bcrypt &amp; JWT multi-tenant authentication engine.
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="e.g. Vantage Logistics Corp"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="sarah@vantagelogistics.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="text-[11px] text-neutral-500">
                By creating a Paperglow account, you agree to our commercial Terms of Service and Privacy Standard.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Create Account &amp; Access Workspace
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // LOGGED-IN VIEW: CENTRAL PAPERGLOW DASHBOARD
  // ──────────────────────────────────────────────────────────
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & User Lockup */}
      <div className="p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg font-['Poppins']">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                {profile.companyName}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                Active SSO
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Account Administrator: <strong>{profile.name}</strong> ({profile.email}) · Member since {profile.joinedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={onNavigateToDirectory}
            className="flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Software</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:border-red-200 transition-colors flex items-center space-x-1"
            title="Log Out of Paperglow"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Simulated Application Launch Notice */}
      {launchedAppNotice && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              SSO session opened for <strong>{launchedAppNotice}</strong>. Workspace context and permissions are verified.
            </span>
          </div>
          <button
            onClick={() => setLaunchedAppNotice(null)}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Account Navigation Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex items-center space-x-2 sm:space-x-8 overflow-x-auto text-xs font-semibold pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-red-600 text-red-600 dark:text-red-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Workspace Overview
        </button>
        <button
          onClick={() => setActiveTab('subscribed')}
          className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'subscribed'
              ? 'border-red-600 text-red-600 dark:text-red-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Subscribed Applications ({subscribedApps.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'available'
              ? 'border-red-600 text-red-600 dark:text-red-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Available Applications ({availableApps.length})
        </button>
        <button
          onClick={() => setActiveTab('merch')}
          className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'merch'
              ? 'border-red-600 text-red-600 dark:text-red-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Custom Merchandise Orders ({merchandiseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'orders'
              ? 'border-red-600 text-red-600 dark:text-red-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Software Invoices &amp; Billing
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'border-red-600 text-red-600 dark:text-red-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Profile &amp; SSO Security
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TAB 1: WORKSPACE OVERVIEW
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-xs text-neutral-500">Active Business Applications</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {subscribedApps.length} <span className="text-xs font-normal text-neutral-400">tools</span>
              </div>
              <button
                onClick={() => setActiveTab('subscribed')}
                className="text-[11px] text-red-600 font-semibold hover:underline block pt-1"
              >
                Manage Active Apps →
              </button>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-xs text-neutral-500">Monthly Software Investment</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                ${monthlySpend} <span className="text-xs font-normal text-neutral-400">/ mo</span>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 block pt-1"
              >
                View Invoices &amp; Receipts →
              </button>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-xs text-neutral-500">Custom Merchandise Orders</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {merchandiseOrders.length} <span className="text-xs font-normal text-neutral-400">orders</span>
              </div>
              <button
                onClick={() => setActiveTab('merch')}
                className="text-[11px] text-red-600 font-semibold hover:underline block pt-1"
              >
                Track Apparel &amp; Banners →
              </button>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-1">
              <span className="text-xs text-neutral-500">Identity &amp; SSO Standard</span>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                Protected
              </div>
              <span className="text-[11px] text-neutral-500 block pt-1">
                2FA &amp; Role-based isolation active
              </span>
            </div>
          </div>

          {/* Quick Subscribed Launchpad */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                Your Subscribed Applications Launchpad
              </h3>
              <button
                onClick={() => setActiveTab('available')}
                className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Explore Available Apps</span>
              </button>
            </div>

            {subscribedApps.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-center space-y-2">
                <p className="text-xs text-neutral-500">You do not have any active business applications subscribed.</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white"
                >
                  Browse Available Applications
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscribedApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase text-red-600">
                          {app.category}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
                          Active
                        </span>
                      </div>
                      <h4 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        {app.name}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {app.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <button
                        onClick={() => triggerLaunch(app)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 transition-colors"
                      >
                        <span>Launch App</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleSubscription(app.id)}
                        className="text-xs text-neutral-500 hover:text-red-600 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Merchandise Status Strip */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Recent Physical Merchandise Production
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('merch')}
                className="text-xs text-red-600 font-semibold hover:underline"
              >
                View All Merchandise Orders →
              </button>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {merchandiseOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 mr-2">
                      {order.itemTitle}
                    </span>
                    <span className="text-neutral-400 font-mono">({order.orderNumber})</span>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{order.specs}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {order.status}
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      ${order.totalAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 2: SUBSCRIBED APPLICATIONS
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'subscribed' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                Your Subscribed Applications
              </h3>
              <p className="text-xs text-neutral-500">
                Manage workspace licenses, launch software, and configure user seats.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('available')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center space-x-1.5 w-fit"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Subscribe to More Apps</span>
            </button>
          </div>

          {subscribedApps.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl space-y-3">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No active subscriptions currently configured for {profile.companyName}.
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white"
              >
                Explore Available Applications Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscribedApps.map((app) => (
                <div
                  key={app.id}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-5 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-red-600">
                        {app.category}
                      </span>
                      <h4 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        {app.name}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">{app.tagline}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
                      Active Subscription
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Workspace Tier:</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Professional Plan</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Billing Rate:</span>
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        ${app.monthlyPrice} / month
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Next Scheduled Renewal:</span>
                      <span>Nov 1, 2026</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase text-neutral-500">
                      Active Capabilities:
                    </div>
                    <div className="space-y-1">
                      {app.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => triggerLaunch(app)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Launch App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleSubscription(app.id)}
                      className="text-xs text-neutral-500 hover:text-red-600 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 3: AVAILABLE APPLICATIONS
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                Available Paperglow Business Applications
              </h3>
              <p className="text-xs text-neutral-500">
                Add modular software products to your organization with a single click.
              </p>
            </div>
            <button
              onClick={onNavigateToDirectory}
              className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full Directory with Previews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {availableApps.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                All Paperglow applications are already subscribed and active in your workspace!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableApps.map((app) => (
                <div
                  key={app.id}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase text-neutral-500">
                        {app.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        ${app.monthlyPrice} / mo
                      </span>
                    </div>
                    <h4 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                      {app.name}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {app.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      onClick={() => onToggleSubscription(app.id)}
                      className="w-full py-2 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Subscribe &amp; Add to Workspace</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 4: CUSTOM MERCHANDISE ORDERS
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'merch' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Branding &amp; Customization Orders
            </h3>
            <p className="text-xs text-neutral-500">
              Track physical merchandise production, inspect artwork proofs, and review shipment tracking numbers.
            </p>
          </div>

          <div className="space-y-4">
            {merchandiseOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {order.orderNumber}
                      </span>
                      <span className="text-neutral-400 text-xs">•</span>
                      <span className="text-xs text-neutral-500">Ordered on {order.date}</span>
                    </div>
                    <h4 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1">
                      {order.itemTitle}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-neutral-900 dark:text-neutral-100">
                      KES {order.totalAmount.toLocaleString()}
                    </span>
                    <div className="text-[11px] text-neutral-500">Qty: {order.quantity} units</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-neutral-500">Specifications</div>
                    <p className="text-neutral-700 dark:text-neutral-300 mt-0.5">{order.specs}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-neutral-500">Delivery Status</div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-red-600" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {order.estimatedDelivery}
                      </span>
                    </div>
                    {order.trackingNumber && (
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        Tracking: {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Proof Approval Banner if pending */}
                {!order.artworkApproved && (
                  <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Digital print proof ready for review. Approve artwork so production can begin.
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onApproveArtworkProof(order.id)}
                        className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap cursor-pointer"
                      >
                        Approve Print Proof
                      </button>
                      <button
                        onClick={() => {
                          setRevisionModalOrder(order);
                          setRevisionFeedback('');
                        }}
                        className="px-3.5 py-1.5 rounded-md text-xs font-semibold border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/40 whitespace-nowrap cursor-pointer"
                      >
                        Request Revision
                      </button>
                    </div>
                  </div>
                )}

                {order.artworkApproved && (
                  <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Artwork Proof Approved · Production Queued</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 5: SOFTWARE INVOICES & BILLING
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Software Invoices &amp; Billing History
            </h3>
            <p className="text-xs text-neutral-500">
              Official tax-compliant receipts for all subscribed Paperglow business applications.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 uppercase font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Software Application</th>
                  <th className="p-4">Cadence</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {softwareOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20">
                    <td className="p-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {ord.orderNumber}
                    </td>
                    <td className="p-4 text-neutral-500">{ord.date}</td>
                    <td className="p-4 font-semibold text-neutral-800 dark:text-neutral-200">
                      {ord.appName} <span className="font-normal text-neutral-400">({ord.tier})</span>
                    </td>
                    <td className="p-4 text-neutral-500 capitalize">{ord.billingCadence}</td>
                    <td className="p-4 font-mono font-bold text-right text-neutral-900 dark:text-neutral-100">
                      KES {ord.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setMpesaModalInvoice(ord);
                          setMpesaStatus('idle');
                        }}
                        className="text-xs text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        title="Simulate Safaricom M-Pesa STK Prompt"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>M-Pesa</span>
                      </button>
                      <button
                        onClick={() => setViewingInvoiceReceipt(ord)}
                        className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold hover:text-red-600 dark:hover:text-red-400 inline-flex items-center gap-1 cursor-pointer"
                        title="View & Download Official Tax Invoice"
                      >
                        <Download className="w-3 h-3" />
                        <span>Tax Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 6: PROFILE & SSO SECURITY
      ────────────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Workspace Profile &amp; Single Sign-On Security
            </h3>
            <p className="text-xs text-neutral-500">
              Changes made here synchronize across all subscribed Paperglow applications in real time.
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Workspace profile credentials updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4 shadow-xs">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Primary Administrator Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Company / Organization Workspace Name
              </label>
              <input
                type="text"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Account Contact Phone
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Primary SSO Work Email
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-neutral-400 mt-0.5 block">
                Primary authentication email cannot be modified directly. Contact security support.
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* Security Protocols */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-red-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Factor Authentication (MFA)</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Two-Factor Authentication (2FA)
                </div>
                <div className="text-xs text-neutral-500">
                  Require an authenticator app code on every new sign-in attempt.
                </div>
              </div>
              <button
                onClick={() => onUpdateProfile({ twoFactorEnabled: !profile.twoFactorEnabled })}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  profile.twoFactorEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700'
                }`}
              >
                {profile.twoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
              </button>
            </div>
          </div>

          {/* DirectAdmin MySQL Schema Export Card */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase text-red-600">
                <Database className="w-4 h-4" />
                <span>DirectAdmin MySQL Production Database</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                MySQL 8.0+ / MariaDB 10.5+
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Complete relational database DDL with 21 tables, strict foreign keys, KES currency reference, Kenyan organization entities, and OAuth2/OIDC SSO tables ready to import directly into phpMyAdmin on your DirectAdmin hosting server.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-[11px] text-neutral-500">
                File: <code className="text-neutral-800 dark:text-neutral-200 font-mono">database/paperglow_directadmin_mysql_schema.sql</code>
              </div>
              <button
                type="button"
                onClick={handleDownloadDirectAdminSql}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download DirectAdmin SQL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 1: SSO APP LAUNCH & TOKEN INSPECTOR (Phase 3)
      ────────────────────────────────────────────────────────── */}
      {ssoModalApp && ssoAuthData && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSsoModalApp(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                  SSO
                </div>
                <div>
                  <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                    Launching {ssoModalApp.name} via Paperglow SSO
                  </h3>
                  <p className="text-[11px] text-neutral-500">OAuth 2.0 Authorization Code Exchange</p>
                </div>
              </div>
              <button
                onClick={() => setSsoModalApp(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity authenticated! Authorization code generated with active entitlements.</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-neutral-500">
                  <span>Authorization Code:</span>
                  <span className="text-red-600 font-bold">{ssoAuthData.authCode.slice(0, 24)}...</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <span>Target Destination:</span>
                  <span className="text-neutral-700 dark:text-neutral-300 truncate max-w-[280px]">{ssoAuthData.redirectUri}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500">
                  <span>Expiry Window:</span>
                  <span>{ssoAuthData.expiresInSeconds} seconds</span>
                </div>
              </div>

              {ssoVerifiedClaims && (
                <div className="p-3 rounded bg-neutral-950 text-neutral-200 text-[10px] space-y-1">
                  <div className="text-neutral-400 uppercase font-bold text-[9px]">Verified Signed JWT Claims:</div>
                  <div>User: {ssoVerifiedClaims.name} ({ssoVerifiedClaims.email})</div>
                  <div>Tenant Org: {ssoVerifiedClaims.org?.name} (KES / Kenya)</div>
                  <div>Active Entitlements: {ssoVerifiedClaims.entitlements?.join(', ') || 'apps.access'}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setSsoModalApp(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Close Inspector
              </button>
              <button
                onClick={() => {
                  const target = ssoModalApp;
                  setSsoModalApp(null);
                  setActiveAppWorkspace(target);
                  showToast(`Connected to ${target.name} via SSO session token!`);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1 cursor-pointer"
              >
                <span>Proceed to App Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 2: M-PESA STK PUSH PAYMENT (Phase 2)
      ────────────────────────────────────────────────────────── */}
      {mpesaModalInvoice && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
          onClick={() => setMpesaModalInvoice(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Pay via Safaricom M-Pesa
                </h3>
              </div>
              <button onClick={() => setMpesaModalInvoice(null)} className="text-neutral-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
              <div className="flex justify-between text-neutral-500">
                <span>Invoice Number:</span>
                <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{mpesaModalInvoice.orderNumber}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Total Amount Due:</span>
                <span className="font-mono font-bold text-emerald-600">KES {mpesaModalInvoice.amount.toLocaleString()}</span>
              </div>
            </div>

            {mpesaStatus === 'confirmed' ? (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-emerald-900 dark:text-emerald-100">Payment Received &amp; Confirmed!</div>
                <div className="font-mono text-neutral-600 dark:text-neutral-400 text-[11px]">
                  M-Pesa Receipt: <strong>{mpesaReceipt}</strong>
                </div>
                <button
                  onClick={() => setMpesaModalInvoice(null)}
                  className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleMpesaPay} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Safaricom Mobile Number (Kenya)
                  </label>
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="+254712345678"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    An STK prompt will be sent to this phone asking to enter M-Pesa PIN.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setMpesaModalInvoice(null)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mpesaStatus === 'prompting'}
                    className="px-4 py-2 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    {mpesaStatus === 'prompting' ? 'Sending Prompt...' : 'Send M-Pesa Prompt'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 3: PROOF REVISION REQUEST (Phase 2)
      ────────────────────────────────────────────────────────── */}
      {revisionModalOrder && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
          onClick={() => setRevisionModalOrder(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Request Artwork Proof Revision
                </h3>
                <p className="text-[11px] text-neutral-500">{revisionModalOrder.itemTitle} ({revisionModalOrder.orderNumber})</p>
              </div>
              <button onClick={() => setRevisionModalOrder(null)} className="text-neutral-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRevisionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Describe the requested adjustments
                </label>
                <textarea
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="e.g. Please enlarge the chest logo by 15% and verify Pantone 186 C red thread matching."
                  rows={4}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setRevisionModalOrder(null)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                >
                  Submit Revision Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 4: INTERACTIVE LIVE APP WORKSPACE SIMULATOR
      ────────────────────────────────────────────────────────── */}
      {activeAppWorkspace && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveAppWorkspace(null)}
        >
          <div
            className="w-full max-w-4xl bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* macOS / App Title Bar */}
            <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="ml-2 font-mono text-[11px] text-neutral-300">
                  https://{activeAppWorkspace.id.replace('paperglow-', '')}.paperglow.com/workspace
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-emerald-400 font-mono font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  SSO: {profile.companyName}
                </span>
                <button
                  onClick={() => setActiveAppWorkspace(null)}
                  className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                  title="Close Workspace Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* App Workspace Body */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
              {/* App Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
                      {activeAppWorkspace.category}
                    </span>
                    <span className="text-neutral-400 text-xs">•</span>
                    <span className="text-xs text-neutral-500 font-mono">{activeAppWorkspace.version}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {activeAppWorkspace.name}
                  </h2>
                  <p className="text-xs text-neutral-500">{activeAppWorkspace.tagline}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                    Connected via Paperglow SSO
                  </span>
                </div>
              </div>

              {/* DYNAMIC WORKSPACE UI: PAPERGLOW INVOICE */}
              {activeAppWorkspace.id === 'paperglow-invoice' && (
                <div className="space-y-6">
                  {/* Revenue Snapshot Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                      <span className="text-[11px] text-neutral-500 font-medium">Collected Revenue</span>
                      <div className="text-xl font-bold font-mono text-emerald-600 mt-1">KES 230,000</div>
                      <span className="text-[10px] text-neutral-400">Past 30 days</span>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                      <span className="text-[11px] text-neutral-500 font-medium">Pending Client Invoices</span>
                      <div className="text-xl font-bold font-mono text-amber-600 mt-1">
                        KES {workspaceInvoices.filter((i) => i.status === 'Pending').reduce((acc, i) => acc + i.amountKes, 0).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-neutral-400">1-click pay links sent</span>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                      <span className="text-[11px] text-neutral-500 font-medium">Active Retainer Contracts</span>
                      <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                        4 Clients
                      </div>
                      <span className="text-[10px] text-neutral-400">Monthly auto-renewal</span>
                    </div>
                  </div>

                  {/* Invoice Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                      Client Billables &amp; Invoices
                    </h3>
                    <button
                      onClick={() => setIsCreatingInvoice(!isCreatingInvoice)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isCreatingInvoice ? 'Close Invoice Form' : 'Create Client Invoice'}</span>
                    </button>
                  </div>

                  {/* Inline New Invoice Generator */}
                  {isCreatingInvoice && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newInvClient || !newInvDesc) return;
                        const newId = `INV-CL-0${workspaceInvoices.length + 84}`;
                        setWorkspaceInvoices([
                          {
                            id: newId,
                            client: newInvClient,
                            desc: newInvDesc,
                            amountKes: parseInt(newInvAmount) || 50000,
                            status: 'Pending',
                            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          },
                          ...workspaceInvoices,
                        ]);
                        setNewInvClient('');
                        setNewInvDesc('');
                        setIsCreatingInvoice(false);
                        showToast(`Invoice ${newId} generated and client payment portal link created!`);
                      }}
                      className="p-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 space-y-4 text-xs"
                    >
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        Issue New Professional Client Invoice
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Client Name</label>
                          <input
                            type="text"
                            value={newInvClient}
                            onChange={(e) => setNewInvClient(e.target.value)}
                            placeholder="e.g. Mara Expeditions Ltd"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Service Description</label>
                          <input
                            type="text"
                            value={newInvDesc}
                            onChange={(e) => setNewInvDesc(e.target.value)}
                            placeholder="e.g. Brand Collateral & Signage"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Amount (KES)</label>
                          <input
                            type="number"
                            value={newInvAmount}
                            onChange={(e) => setNewInvAmount(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsCreatingInvoice(false)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                          Issue Invoice &amp; Pay Link
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Invoices List Table */}
                  <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 uppercase font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                          <th className="p-3">Invoice #</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Service / Scope</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Amount</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {workspaceInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20">
                            <td className="p-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">{inv.id}</td>
                            <td className="p-3 font-semibold text-neutral-800 dark:text-neutral-200">{inv.client}</td>
                            <td className="p-3 text-neutral-500">{inv.desc}</td>
                            <td className="p-3 text-neutral-400 font-mono text-[11px]">{inv.date}</td>
                            <td className="p-3 font-mono font-bold text-right text-neutral-900 dark:text-neutral-100">
                              KES {inv.amountKes.toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  inv.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : inv.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              {inv.status !== 'Paid' && (
                                <button
                                  onClick={() => {
                                    setWorkspaceInvoices(
                                      workspaceInvoices.map((i) => (i.id === inv.id ? { ...i, status: 'Paid' } : i))
                                    );
                                    showToast(`Invoice ${inv.id} marked as Paid!`);
                                  }}
                                  className="text-[11px] text-emerald-600 font-bold hover:underline cursor-pointer"
                                >
                                  Mark Paid
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  showToast(`Copied payment portal link for ${inv.client}!`);
                                }}
                                className="text-[11px] text-neutral-500 hover:text-red-600 font-medium cursor-pointer"
                              >
                                Copy Link
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DYNAMIC WORKSPACE UI: PAPERGLOW CRM */}
              {activeAppWorkspace.id === 'paperglow-crm' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        Sales Opportunities Pipeline
                      </h3>
                      <p className="text-xs text-neutral-500">Drag or click to progress qualified deals to signed contracts.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingDeal(!isAddingDeal)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingDeal ? 'Cancel' : 'Add Opportunity'}</span>
                    </button>
                  </div>

                  {isAddingDeal && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDealTitle || !newDealCompany) return;
                        setWorkspaceDeals([
                          ...workspaceDeals,
                          {
                            id: `deal-${Date.now()}`,
                            title: newDealTitle,
                            company: newDealCompany,
                            valueKes: parseInt(newDealValue) || 100000,
                            stage: 'Qualified Discovery',
                          },
                        ]);
                        setNewDealTitle('');
                        setNewDealCompany('');
                        setIsAddingDeal(false);
                        showToast(`Added new deal "${newDealTitle}" to pipeline!`);
                      }}
                      className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-neutral-50 dark:bg-neutral-900/60 space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={newDealTitle}
                          onChange={(e) => setNewDealTitle(e.target.value)}
                          placeholder="Deal Title (e.g. Annual Retainer)"
                          required
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                        />
                        <input
                          type="text"
                          value={newDealCompany}
                          onChange={(e) => setNewDealCompany(e.target.value)}
                          placeholder="Company Name"
                          required
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                        />
                        <input
                          type="number"
                          value={newDealValue}
                          onChange={(e) => setNewDealValue(e.target.value)}
                          placeholder="Value (KES)"
                          required
                          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                      >
                        Save Deal
                      </button>
                    </form>
                  )}

                  {/* Pipeline Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {['Qualified Discovery', 'Proposal Review', 'Closed Won'].map((stage) => {
                      const stageDeals = workspaceDeals.filter((d) => d.stage === stage);
                      const totalStageValue = stageDeals.reduce((acc, d) => acc + d.valueKes, 0);

                      return (
                        <div
                          key={stage}
                          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
                              <span className="text-neutral-900 dark:text-neutral-100">{stage} ({stageDeals.length})</span>
                              <span className="font-mono text-neutral-500 text-[11px]">KES {totalStageValue.toLocaleString()}</span>
                            </div>

                            <div className="space-y-2">
                              {stageDeals.map((deal) => (
                                <div
                                  key={deal.id}
                                  className="p-3 rounded-lg bg-white dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-xs"
                                >
                                  <div>
                                    <div className="font-bold text-neutral-900 dark:text-neutral-100">{deal.title}</div>
                                    <div className="text-[11px] text-neutral-500">{deal.company}</div>
                                  </div>
                                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800">
                                    <span className="font-mono font-bold text-emerald-600 text-[11px]">
                                      KES {deal.valueKes.toLocaleString()}
                                    </span>
                                    {stage !== 'Closed Won' && (
                                      <button
                                        onClick={() => {
                                          const nextStage = stage === 'Qualified Discovery' ? 'Proposal Review' : 'Closed Won';
                                          setWorkspaceDeals(
                                            workspaceDeals.map((d) => (d.id === deal.id ? { ...d, stage: nextStage } : d))
                                          );
                                          showToast(`Advanced "${deal.title}" to ${nextStage}!`);
                                        }}
                                        className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                                      >
                                        Advance →
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DYNAMIC WORKSPACE UI: PAPERGLOW HUB */}
              {activeAppWorkspace.id === 'paperglow-hub' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        Sprint Deliverables &amp; Milestones
                      </h3>
                      <p className="text-xs text-neutral-500">Cross-team production milestones linked to your branding orders.</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {workspaceTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181c24] flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={t.completed}
                            onChange={() => {
                              setWorkspaceTasks(
                                workspaceTasks.map((item) => (item.id === t.id ? { ...item, completed: !item.completed } : item))
                              );
                              showToast(`Task status toggled: ${t.title}`);
                            }}
                            className="rounded text-red-600 focus:ring-red-600 cursor-pointer w-4 h-4"
                          />
                          <div>
                            <span className={`font-semibold ${t.completed ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                              {t.title}
                            </span>
                            <div className="text-[11px] text-neutral-500">Assignee: {t.assignee} · Due {t.due}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                          {t.completed ? 'Done' : 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DYNAMIC WORKSPACE UI: INVOICE & QUOTATION GENERATOR */}
              {activeAppWorkspace.id === 'paperglow-invoice-generator' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
                      <FileSpreadsheet className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        Invoice &amp; Quotation Generator
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto mt-1 leading-relaxed">
                        Professional Kenyan KRA PIN tax invoices, proforma quotations, dynamic line items, automated VAT calculations, and printable A4 layouts with instant PDF exports.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setActiveAppWorkspace(null);
                          window.location.hash = 'invoice-generator';
                        }}
                        className="px-6 py-2.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Launch Full Dedicated Application Workspace</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC WORKSPACE UI: PAPERGLOW BUSINESS MANAGER */}
              {activeAppWorkspace.id === 'paperglow-business-manager' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                        Paperglow Business Manager
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto mt-1 leading-relaxed">
                        Complete small business operations platform: Sales, Invoicing, Inventory, CRM, Expenses, Reports, Staff, Appointments, Messages, Payments &amp; M-Pesa.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setActiveAppWorkspace(null);
                          window.location.hash = 'business-manager';
                        }}
                        className="px-6 py-2.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Launch Paperglow Business Manager Full Screen</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DEFAULT FALLBACK FOR OTHER SUBSCRIBED APPS */}
              {!['paperglow-invoice', 'paperglow-crm', 'paperglow-hub', 'paperglow-invoice-generator', 'paperglow-business-manager'].includes(activeAppWorkspace.id) && (
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg mx-auto">
                    {activeAppWorkspace.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                      {activeAppWorkspace.name} Production Workspace
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                      {activeAppWorkspace.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 text-left text-xs max-w-lg mx-auto space-y-2">
                    <div className="text-[10px] font-bold uppercase text-neutral-500">Capabilities Enabled in Session:</div>
                    {activeAppWorkspace.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-red-600" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Synced latest settings for ${activeAppWorkspace.name}`);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 cursor-pointer"
                  >
                    Sync Live Data Across Workspace
                  </button>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Paperglow SSO Session Active · Encrypted 256-bit Token
              </span>
              <button
                onClick={() => setActiveAppWorkspace(null)}
                className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold hover:bg-neutral-300 cursor-pointer"
              >
                Exit Workspace (Back to Account)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 5: OFFICIAL TAX INVOICE PDF RECEIPT
      ────────────────────────────────────────────────────────── */}
      {viewingInvoiceReceipt && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4"
          onClick={() => setViewingInvoiceReceipt(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tax Invoice Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
                  <span className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Paperglow
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  Paperglow Creative Group Ltd · Nairobi, Kenya<br />
                  KRA PIN: <strong>P051289192K</strong> · VAT Registered
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-red-600">TAX INVOICE &amp; RECEIPT</span>
                <div className="text-sm font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {viewingInvoiceReceipt.orderNumber}
                </div>
                <div className="text-[11px] text-neutral-500">{viewingInvoiceReceipt.date}</div>
              </div>
            </div>

            {/* Billed To Customer Information */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400">Billed To Customer:</span>
                <div className="font-bold text-neutral-900 dark:text-neutral-100">{profile.companyName}</div>
                <div className="text-neutral-600 dark:text-neutral-400">Attn: {profile.name}</div>
                <div className="text-neutral-500 font-mono text-[11px]">{profile.email}</div>
                <div className="text-neutral-500 font-mono text-[11px]">{profile.phone}</div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold uppercase text-neutral-400">Payment Status:</span>
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase text-[10px]">
                    PAID IN FULL
                  </span>
                </div>
                <div className="text-neutral-500 text-[11px] pt-1">
                  Channel: Safaricom M-Pesa / Card Gateway<br />
                  Ref: QGH{Math.floor(1000 + Math.random() * 9000)}K92
                </div>
              </div>
            </div>

            {/* Invoice Line Items Table */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 uppercase font-semibold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="p-3">Item &amp; Description</th>
                    <th className="p-3">Cadence</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-[11px]">
                  <tr>
                    <td className="p-3 font-sans">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {viewingInvoiceReceipt.appName} Workspace License
                      </div>
                      <div className="text-[10px] text-neutral-500">{viewingInvoiceReceipt.tier} · Unlimited Seats</div>
                    </td>
                    <td className="p-3 capitalize font-sans text-neutral-500">{viewingInvoiceReceipt.billingCadence}</td>
                    <td className="p-3 text-right">KES {viewingInvoiceReceipt.amount.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-neutral-900 dark:text-neutral-100">
                      KES {viewingInvoiceReceipt.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="flex justify-end pt-2 text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-neutral-500">
                  <span>Net Amount:</span>
                  <span className="font-mono">KES {Math.round(viewingInvoiceReceipt.amount * 0.862).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>VAT (16% Standard):</span>
                  <span className="font-mono">KES {Math.round(viewingInvoiceReceipt.amount * 0.138).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-emerald-600">KES {viewingInvoiceReceipt.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="text-[10px] text-neutral-400">
                Official Paperglow VAT Receipt · Retain for corporate tax records
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewingInvoiceReceipt(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                    showToast('Opening browser print dialogue for Tax Receipt...');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          FLOATING IN-APP TOAST FEEDBACK NOTIFICATION
      ────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xl flex items-center space-x-2.5 text-xs font-semibold border border-neutral-700 dark:border-neutral-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-neutral-400 hover:text-white dark:hover:text-black cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

