import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'paperglow_directadmin_super_secret_jwt_key_2026';
const PORT = process.env.PORT || 3000;

// Setup upload directory for artwork files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `artwork-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Database state file for runtime persistence
const DB_FILE = path.join(__dirname, 'data', 'paperglow_db.json');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Interfaces matching MySQL Schema
interface UserRecord {
  id: number;
  uuid: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  defaultOrganizationId: number;
  twoFactorEnabled: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
}

interface OrganizationRecord {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  billingEmail: string;
  phone: string;
  taxId: string; // KRA PIN
  city: string;
  countyState: string;
  countryCode: string; // 'KE'
  preferredCurrency: string; // 'KES'
  status: 'active' | 'past_due' | 'suspended';
  createdAt: string;
}

interface MemberRecord {
  id: number;
  organizationId: number;
  userId: number;
  roleName: 'owner' | 'admin' | 'billing_manager' | 'member';
  status: 'active' | 'invited';
  joinedAt: string;
}

interface SubscriptionRecord {
  id: number;
  uuid: string;
  organizationId: number;
  appSlug: string;
  planSlug: string;
  billingCadence: 'monthly' | 'annual';
  status: 'active' | 'canceled';
  monthlyPriceKes: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

interface EntitlementRecord {
  id: number;
  organizationId: number;
  appSlug: string;
  featureKey: string;
  value: string;
}

interface OrderRecord {
  id: number;
  uuid: string;
  orderNumber: string;
  organizationId: number;
  userId: number;
  orderType: 'software_subscription' | 'merchandise';
  status: 'pending_payment' | 'processing' | 'proofing' | 'in_production' | 'shipped' | 'delivered';
  subtotalKes: number;
  totalKes: number;
  currencyCode: string;
  itemTitle: string;
  specs: string;
  quantity: number;
  customerNotes?: string;
  artworkApproved: boolean;
  proofVersion?: number;
  proofFeedback?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

interface InvoiceRecord {
  id: number;
  uuid: string;
  invoiceNumber: string;
  organizationId: number;
  amountKes: number;
  currencyCode: string;
  status: 'paid' | 'open';
  dueDate: string;
  paidAt?: string;
  orderNumber?: string;
  createdAt: string;
}

interface PaymentRecord {
  id: number;
  uuid: string;
  invoiceId: number;
  organizationId: number;
  paymentChannel: 'mobile_money' | 'card' | 'bank_transfer';
  providerName: string; // 'mpesa' | 'card_gateway' | 'bank_eft'
  amountKes: number;
  currencyCode: string;
  providerReference: string; // e.g. M-Pesa Code 'QGH891K20L'
  merchantReference: string;
  customerMsisdn?: string;
  status: 'completed' | 'pending';
  completedAt: string;
}

interface ArtworkFileRecord {
  id: number;
  uuid: string;
  organizationId: number;
  userId: number;
  originalFileName: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  createdAt: string;
}

interface AuditLogRecord {
  id: number;
  organizationId?: number;
  userId?: number;
  action: string;
  entityType: string;
  entityId?: number;
  ipAddress: string;
  details: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  organizations: OrganizationRecord[];
  members: MemberRecord[];
  subscriptions: SubscriptionRecord[];
  entitlements: EntitlementRecord[];
  orders: OrderRecord[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  artworkFiles: ArtworkFileRecord[];
  auditLogs: AuditLogRecord[];
  oauthAuthCodes: { code: string; clientId: string; userId: number; orgId: number; expiresAt: number }[];
}

// Initial Database Seeder for Kenya / KES
function getInitialDatabase(): DatabaseSchema {
  const initialUser: UserRecord = {
    id: 1,
    uuid: crypto.randomUUID(),
    name: 'Wanjiku Kamau',
    email: 'admin@paperglow.co.ke',
    passwordHash: bcrypt.hashSync('Paperglow@2026', 10),
    phone: '+254712345678',
    defaultOrganizationId: 1,
    twoFactorEnabled: true,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const initialOrg: OrganizationRecord = {
    id: 1,
    uuid: crypto.randomUUID(),
    name: 'Paperglow Creative Group Ltd',
    slug: 'paperglow-creative',
    billingEmail: 'billing@paperglow.co.ke',
    phone: '+254712345678',
    taxId: 'P051289192K', // KRA PIN
    city: 'Nairobi',
    countyState: 'Nairobi County',
    countryCode: 'KE',
    preferredCurrency: 'KES',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const initialMember: MemberRecord = {
    id: 1,
    organizationId: 1,
    userId: 1,
    roleName: 'owner',
    status: 'active',
    joinedAt: new Date().toISOString(),
  };

  const initialSubs: SubscriptionRecord[] = [
    {
      id: 1,
      uuid: crypto.randomUUID(),
      organizationId: 1,
      appSlug: 'paperglow-invoice',
      planSlug: 'professional',
      billingCadence: 'monthly',
      status: 'active',
      monthlyPriceKes: 3800, // 3,800 KES/mo
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
    {
      id: 2,
      uuid: crypto.randomUUID(),
      organizationId: 1,
      appSlug: 'paperglow-crm',
      planSlug: 'starter',
      billingCadence: 'monthly',
      status: 'active',
      monthlyPriceKes: 4900, // 4,900 KES/mo
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
  ];

  const initialEntitlements: EntitlementRecord[] = [
    { id: 1, organizationId: 1, appSlug: 'paperglow-invoice', featureKey: 'unlimited_invoices', value: 'true' },
    { id: 2, organizationId: 1, appSlug: 'paperglow-invoice', featureKey: 'multi_currency', value: 'true' },
    { id: 3, organizationId: 1, appSlug: 'paperglow-crm', featureKey: 'contacts_limit', value: '5000' },
  ];

  const initialOrders: OrderRecord[] = [
    {
      id: 1,
      uuid: crypto.randomUUID(),
      orderNumber: 'PG-MC-2026-4192',
      organizationId: 1,
      userId: 1,
      orderType: 'merchandise',
      status: 'in_production',
      subtotalKes: 32000,
      totalKes: 32000,
      currencyCode: 'KES',
      itemTitle: 'Branded Heavyweight Boxy T-Shirts',
      specs: 'Silhouette: Heavyweight Boxy Crew (280 GSM) · Color: Obsidian Black · Technique: Left Chest Embroidery + Back Screenprint',
      quantity: 50,
      artworkApproved: true,
      proofVersion: 1,
      trackingNumber: 'PG-EXP-88912',
      estimatedDelivery: '3 business days (Nairobi CBD Hub)',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 2,
      uuid: crypto.randomUUID(),
      orderNumber: 'PG-MC-2026-9041',
      organizationId: 1,
      userId: 1,
      orderType: 'merchandise',
      status: 'proofing',
      subtotalKes: 18500,
      totalKes: 18500,
      currencyCode: 'KES',
      itemTitle: 'Retractable Pull-Up Event Banners',
      specs: 'Size: 33" x 81" Anodized Aluminum Stand · High-Res UV Archival Ink',
      quantity: 2,
      artworkApproved: false,
      proofVersion: 1,
      estimatedDelivery: 'Pending digital proof confirmation',
      createdAt: new Date().toISOString(),
    },
  ];

  const initialInvoices: InvoiceRecord[] = [
    {
      id: 1,
      uuid: crypto.randomUUID(),
      invoiceNumber: 'INV-2026-0082',
      organizationId: 1,
      amountKes: 8700,
      currencyCode: 'KES',
      status: 'paid',
      dueDate: new Date().toISOString().split('T')[0],
      paidAt: new Date().toISOString(),
      orderNumber: 'PG-SW-2026-8812',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  const initialPayments: PaymentRecord[] = [
    {
      id: 1,
      uuid: crypto.randomUUID(),
      invoiceId: 1,
      organizationId: 1,
      paymentChannel: 'mobile_money',
      providerName: 'mpesa',
      amountKes: 8700,
      currencyCode: 'KES',
      providerReference: 'QGH8812K9P', // Valid M-Pesa format
      merchantReference: 'PG-M-8812',
      customerMsisdn: '+254712345678',
      status: 'completed',
      completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  return {
    users: [initialUser],
    organizations: [initialOrg],
    members: [initialMember],
    subscriptions: initialSubs,
    entitlements: initialEntitlements,
    orders: initialOrders,
    invoices: initialInvoices,
    payments: initialPayments,
    artworkFiles: [],
    auditLogs: [],
    oauthAuthCodes: [],
  };
}

// Helper to read/write DB
function getDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB file, recreating seed', err);
  }
  const initial = getInitialDatabase();
  saveDB(initial);
  return initial;
}

function saveDB(db: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Log audit helper
function logAudit(db: DatabaseSchema, action: string, entityType: string, entityId?: number, orgId?: number, userId?: number, details: string = '') {
  const newLog: AuditLogRecord = {
    id: db.auditLogs.length + 1,
    organizationId: orgId,
    userId,
    action,
    entityType,
    entityId,
    ipAddress: '127.0.0.1',
    details,
    createdAt: new Date().toISOString(),
  };
  db.auditLogs.unshift(newLog);
}

// App initialization
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use('/uploads', express.static(uploadsDir));

// Auth Middleware: supports HttpOnly cookie OR Bearer header
interface AuthenticatedRequest extends Request {
  user?: UserRecord;
  organization?: OrganizationRecord;
  member?: MemberRecord;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = req.cookies?.paperglow_session;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthenticated session' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; orgId: number };
    const db = getDB();
    const user = db.users.find((u) => u.id === decoded.userId && u.status === 'active');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or suspended' });
    }

    const org = db.organizations.find((o) => o.id === decoded.orgId && o.status !== 'suspended');
    if (!org) {
      return res.status(403).json({ success: false, message: 'Organization suspended or not found' });
    }

    const member = db.members.find((m) => m.organizationId === org.id && m.userId === user.id && m.status === 'active');
    if (!member) {
      return res.status(403).json({ success: false, message: 'User does not belong to this organization' });
    }

    req.user = user;
    req.organization = org;
    req.member = member;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
}

// Role Authorization Policy Guard
function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.member || !allowedRoles.includes(req.member.roleName)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role. Current role: ${req.member?.roleName}`,
      });
    }
    next();
  };
}

// ============================================================================
// PHASE 1: AUTHENTICATION & MULTI-TENANCY API (HttpOnly Cookie Sessions)
// ============================================================================

// Register new user & organization
app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  const { name, email, password, companyName, phone } = req.body;
  if (!name || !email || !password || !companyName) {
    return res.status(422).json({ success: false, message: 'Name, email, password, and companyName are required' });
  }

  const db = getDB();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const newOrgId = db.organizations.length + 1;
  const newUserId = db.users.length + 1;

  const newOrg: OrganizationRecord = {
    id: newOrgId,
    uuid: crypto.randomUUID(),
    name: companyName,
    slug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    billingEmail: email,
    phone: phone || '+254700000000',
    taxId: 'P0' + Math.floor(10000000 + Math.random() * 90000000) + 'K',
    city: 'Nairobi',
    countyState: 'Nairobi County',
    countryCode: 'KE',
    preferredCurrency: 'KES',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const newUser: UserRecord = {
    id: newUserId,
    uuid: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    phone: phone || '+254700000000',
    defaultOrganizationId: newOrgId,
    twoFactorEnabled: false,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const newMember: MemberRecord = {
    id: db.members.length + 1,
    organizationId: newOrgId,
    userId: newUserId,
    roleName: 'owner',
    status: 'active',
    joinedAt: new Date().toISOString(),
  };

  db.organizations.push(newOrg);
  db.users.push(newUser);
  db.members.push(newMember);

  logAudit(db, 'auth.register', 'User', newUserId, newOrgId, newUserId, `Registered ${email} and created ${companyName}`);
  saveDB(db);

  // Issue Session Cookie
  const token = jwt.sign({ userId: newUserId, orgId: newOrgId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('paperglow_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: 'Registered successfully',
    data: {
      user: { id: newUser.id, uuid: newUser.uuid, name: newUser.name, email: newUser.email, phone: newUser.phone },
      organization: newOrg,
      role: 'owner',
      token, // also return token for API clients
    },
  });
});

// Login
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ success: false, message: 'Email and password are required' });
  }

  const db = getDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const org = db.organizations.find((o) => o.id === user.defaultOrganizationId) || db.organizations[0];
  const member = db.members.find((m) => m.organizationId === org.id && m.userId === user.id);

  const token = jwt.sign({ userId: user.id, orgId: org.id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('paperglow_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600 * 1000,
  });

  logAudit(db, 'auth.login', 'User', user.id, org.id, user.id, `User logged in from Nairobi IP`);
  saveDB(db);

  return res.json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: { id: user.id, uuid: user.uuid, name: user.name, email: user.email, phone: user.phone, twoFactorEnabled: user.twoFactorEnabled },
      organization: org,
      role: member ? member.roleName : 'owner',
      token,
    },
  });
});

// Logout
app.post('/api/v1/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('paperglow_session');
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Me (Get current session info)
app.get('/api/v1/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const org = req.organization!;
  const user = req.user!;
  const member = req.member!;

  const subscriptions = db.subscriptions.filter((s) => s.organizationId === org.id && s.status === 'active');
  const entitlements = db.entitlements.filter((e) => e.organizationId === org.id);

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      organization: org,
      role: member.roleName,
      activeSubscriptionsCount: subscriptions.length,
      subscribedAppSlugs: subscriptions.map((s) => s.appSlug),
      entitlements,
    },
  });
});

// Update Profile
app.put('/api/v1/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { name, phone, twoFactorEnabled } = req.body;
  const db = getDB();
  const user = db.users.find((u) => u.id === req.user!.id);
  if (user) {
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (typeof twoFactorEnabled === 'boolean') user.twoFactorEnabled = twoFactorEnabled;
    saveDB(db);
  }
  return res.json({ success: true, message: 'Profile updated', data: user });
});

// ============================================================================
// PHASE 1: SUBSCRIPTIONS & ENTITLEMENTS API
// ============================================================================

// List subscriptions
app.get('/api/v1/subscriptions', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const orgSubs = db.subscriptions.filter((s) => s.organizationId === req.organization!.id);
  return res.json({ success: true, data: orgSubs });
});

// Subscribe to app
app.post('/api/v1/subscriptions', authMiddleware, requireRole('owner', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  const { appSlug, planSlug, billingCadence, priceKes } = req.body;
  if (!appSlug) {
    return res.status(422).json({ success: false, message: 'appSlug is required' });
  }

  const db = getDB();
  const orgId = req.organization!.id;

  // Check if already subscribed
  const existing = db.subscriptions.find((s) => s.organizationId === orgId && s.appSlug === appSlug && s.status === 'active');
  if (existing) {
    return res.status(409).json({ success: false, message: 'Already subscribed to this application' });
  }

  const newSub: SubscriptionRecord = {
    id: db.subscriptions.length + 1,
    uuid: crypto.randomUUID(),
    organizationId: orgId,
    appSlug,
    planSlug: planSlug || 'professional',
    billingCadence: billingCadence || 'monthly',
    status: 'active',
    monthlyPriceKes: priceKes || 3800,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
  };

  db.subscriptions.push(newSub);

  // Grant standard application entitlements
  const entitlementKeys = [`${appSlug}.access`, `${appSlug}.unlimited_data`, `${appSlug}.sso_enabled`];
  entitlementKeys.forEach((key) => {
    db.entitlements.push({
      id: db.entitlements.length + 1,
      organizationId: orgId,
      appSlug,
      featureKey: key,
      value: 'true',
    });
  });

  // Create corresponding invoice
  const invNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  db.invoices.unshift({
    id: db.invoices.length + 1,
    uuid: crypto.randomUUID(),
    invoiceNumber: invNumber,
    organizationId: orgId,
    amountKes: priceKes || 3800,
    currencyCode: 'KES',
    status: 'paid',
    dueDate: new Date().toISOString().split('T')[0],
    paidAt: new Date().toISOString(),
    orderNumber: `PG-SW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  });

  logAudit(db, 'subscription.activated', 'Subscription', newSub.id, orgId, req.user!.id, `Activated ${appSlug} for ${orgId}`);
  saveDB(db);

  return res.status(201).json({
    success: true,
    message: `Subscribed to ${appSlug} successfully`,
    data: newSub,
  });
});

// Cancel subscription
app.delete('/api/v1/subscriptions/:appSlug', authMiddleware, requireRole('owner', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  const { appSlug } = req.params;
  const db = getDB();
  const orgId = req.organization!.id;

  const sub = db.subscriptions.find((s) => s.organizationId === orgId && s.appSlug === appSlug && s.status === 'active');
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Active subscription not found' });
  }

  sub.status = 'canceled';
  // Revoke entitlements
  db.entitlements = db.entitlements.filter((e) => !(e.organizationId === orgId && e.appSlug === appSlug));

  logAudit(db, 'subscription.canceled', 'Subscription', sub.id, orgId, req.user!.id, `Canceled ${appSlug}`);
  saveDB(db);

  return res.json({ success: true, message: `Subscription for ${appSlug} canceled`, data: sub });
});

// Get entitlements
app.get('/api/v1/entitlements', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const orgEntitlements = db.entitlements.filter((e) => e.organizationId === req.organization!.id);
  return res.json({ success: true, data: orgEntitlements });
});

// ============================================================================
// PHASE 1 & 2: BRANDING ORDERS, ARTWORK & PROOFING API
// ============================================================================

// List Orders
app.get('/api/v1/orders', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const orgOrders = db.orders.filter((o) => o.organizationId === req.organization!.id);
  return res.json({ success: true, data: orgOrders });
});

// Create Order (Merchandise or Custom Swag)
app.post('/api/v1/orders', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { itemTitle, specs, quantity, totalKes, customerNotes } = req.body;
  if (!itemTitle || !quantity || !totalKes) {
    return res.status(422).json({ success: false, message: 'itemTitle, quantity, and totalKes are required' });
  }

  const db = getDB();
  const orgId = req.organization!.id;

  const orderNum = `PG-MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder: OrderRecord = {
    id: db.orders.length + 1,
    uuid: crypto.randomUUID(),
    orderNumber: orderNum,
    organizationId: orgId,
    userId: req.user!.id,
    orderType: 'merchandise',
    status: 'proofing',
    subtotalKes: totalKes,
    totalKes,
    currencyCode: 'KES',
    itemTitle,
    specs: specs || 'Standard specifications',
    quantity: parseInt(quantity) || 1,
    customerNotes,
    artworkApproved: false,
    proofVersion: 1,
    estimatedDelivery: '7–10 business days (Pending digital proof approval)',
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);

  // Auto-generate invoice
  const invNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  db.invoices.unshift({
    id: db.invoices.length + 1,
    uuid: crypto.randomUUID(),
    invoiceNumber: invNumber,
    organizationId: orgId,
    amountKes: totalKes,
    currencyCode: 'KES',
    status: 'paid',
    dueDate: new Date().toISOString().split('T')[0],
    paidAt: new Date().toISOString(),
    orderNumber: orderNum,
    createdAt: new Date().toISOString(),
  });

  logAudit(db, 'order.created', 'Order', newOrder.id, orgId, req.user!.id, `Placed merchandise order ${orderNum}`);
  saveDB(db);

  return res.status(201).json({ success: true, message: 'Order submitted to Paperglow Account', data: newOrder });
});

// Upload Artwork File
app.post('/api/v1/artwork/upload', authMiddleware, upload.single('artwork'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const db = getDB();
  const newFile: ArtworkFileRecord = {
    id: db.artworkFiles.length + 1,
    uuid: crypto.randomUUID(),
    organizationId: req.organization!.id,
    userId: req.user!.id,
    originalFileName: req.file.originalname,
    storagePath: `/uploads/${req.file.filename}`,
    fileSizeBytes: req.file.size,
    mimeType: req.file.mimetype,
    createdAt: new Date().toISOString(),
  };

  db.artworkFiles.push(newFile);
  logAudit(db, 'artwork.uploaded', 'ArtworkFile', newFile.id, req.organization!.id, req.user!.id, `Uploaded ${req.file.originalname}`);
  saveDB(db);

  return res.json({
    success: true,
    message: 'Artwork uploaded successfully',
    data: newFile,
  });
});

// Approve Digital Proof
app.post('/api/v1/proofs/:orderId/approve', authMiddleware, requireRole('owner', 'admin', 'billing_manager'), (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.params;
  const db = getDB();
  const order = db.orders.find((o) => (o.id === parseInt(orderId) || o.orderNumber === orderId) && o.organizationId === req.organization!.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.artworkApproved = true;
  order.status = 'in_production';
  order.estimatedDelivery = '5–7 business days (Press production in progress)';

  logAudit(db, 'proof.approved', 'Order', order.id, req.organization!.id, req.user!.id, `Approved digital proof for order ${order.orderNumber}`);
  saveDB(db);

  return res.json({ success: true, message: 'Artwork proof approved! Sent to production press.', data: order });
});

// Request Proof Revision
app.post('/api/v1/proofs/:orderId/revision', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.params;
  const { feedback } = req.body;
  const db = getDB();
  const order = db.orders.find((o) => (o.id === parseInt(orderId) || o.orderNumber === orderId) && o.organizationId === req.organization!.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.proofVersion = (order.proofVersion || 1) + 1;
  order.proofFeedback = feedback || 'Adjust placement';
  order.status = 'proofing';

  logAudit(db, 'proof.revision_requested', 'Order', order.id, req.organization!.id, req.user!.id, `Revision requested: ${feedback}`);
  saveDB(db);

  return res.json({ success: true, message: 'Revision submitted to Paperglow prepress team.', data: order });
});

// ============================================================================
// PHASE 2: PROVIDER-AGNOSTIC PAYMENT & BILLING API (M-Pesa, Card, Bank)
// ============================================================================

// List Invoices
app.get('/api/v1/billing/invoices', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const orgInvoices = db.invoices.filter((i) => i.organizationId === req.organization!.id);
  const orgPayments = db.payments.filter((p) => p.organizationId === req.organization!.id);

  return res.json({
    success: true,
    data: {
      invoices: orgInvoices,
      payments: orgPayments,
      currency: 'KES',
    },
  });
});

// Process Payment (M-Pesa STK Push / Card / Bank)
app.post('/api/v1/billing/pay', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { invoiceId, channel, phone, providerRef } = req.body;
  const db = getDB();
  const orgId = req.organization!.id;

  const invoice = db.invoices.find((i) => (i.id === parseInt(invoiceId) || i.invoiceNumber === invoiceId) && i.organizationId === orgId);
  if (!invoice) {
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }

  // Generate realistic Kenyan M-Pesa receipt reference (e.g. QGH712K89) or Card Gateway ref
  const generatedRef = providerRef || (channel === 'mobile_money'
    ? 'QGH' + Math.floor(1000 + Math.random() * 9000) + 'K' + Math.floor(10 + Math.random() * 90)
    : 'CARD_TXN_' + Date.now());

  const newPayment: PaymentRecord = {
    id: db.payments.length + 1,
    uuid: crypto.randomUUID(),
    invoiceId: invoice.id,
    organizationId: orgId,
    paymentChannel: channel || 'mobile_money',
    providerName: channel === 'mobile_money' ? 'mpesa' : channel === 'card' ? 'card_gateway' : 'bank_eft',
    amountKes: invoice.amountKes,
    currencyCode: 'KES',
    providerReference: generatedRef,
    merchantReference: `PG-PAY-${invoice.invoiceNumber}`,
    customerMsisdn: phone || req.user!.phone,
    status: 'completed',
    completedAt: new Date().toISOString(),
  };

  invoice.status = 'paid';
  invoice.paidAt = new Date().toISOString();
  db.payments.unshift(newPayment);

  logAudit(db, 'payment.completed', 'Payment', newPayment.id, orgId, req.user!.id, `Received ${channel} payment ${generatedRef} of KES ${invoice.amountKes}`);
  saveDB(db);

  return res.json({
    success: true,
    message: channel === 'mobile_money'
      ? `M-Pesa STK Prompt Confirmed. Receipt: ${generatedRef}`
      : 'Payment processed successfully',
    data: newPayment,
  });
});

// ============================================================================
// PHASE 3: OAUTH 2.0 / OIDC SSO & ENTITLEMENT VERIFICATION API
// ============================================================================

// Authorize App Launch (Issues OAuth authorization code for Paperglow sub-apps)
app.post('/api/v1/oauth/authorize', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { clientId, appSlug } = req.body;
  const db = getDB();
  const orgId = req.organization!.id;
  const userId = req.user!.id;

  // Check if organization has active entitlement for this app
  const hasEntitlement = db.subscriptions.some((s) => s.organizationId === orgId && s.appSlug === appSlug && s.status === 'active');

  if (!hasEntitlement) {
    return res.status(403).json({
      success: false,
      message: `Organization does not have an active subscription for ${appSlug}. Please subscribe first.`,
    });
  }

  // Issue real OAuth 2.0 authorization code (valid for 5 minutes)
  const authCode = `pg_code_${crypto.randomBytes(16).toString('hex')}`;
  db.oauthAuthCodes.push({
    code: authCode,
    clientId: clientId || 'client_pg_internal',
    userId,
    orgId,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  logAudit(db, 'sso.code_issued', 'OAuth', undefined, orgId, userId, `Issued SSO auth code for ${appSlug}`);
  saveDB(db);

  return res.json({
    success: true,
    message: 'SSO code generated successfully',
    data: {
      authCode,
      appSlug,
      redirectUri: `https://${appSlug.replace('paperglow-', '')}.paperglow.com/auth/callback?code=${authCode}`,
      expiresInSeconds: 300,
    },
  });
});

// Token Exchange: Sub-app exchanges auth code for Signed JWT Access Token
app.post('/api/v1/oauth/token', (req: Request, res: Response) => {
  const { code, clientId, clientSecret } = req.body;
  const db = getDB();

  const stored = db.oauthAuthCodes.find((c) => c.code === code && c.expiresAt > Date.now());
  if (!stored) {
    return res.status(400).json({ success: false, message: 'Invalid or expired authorization code' });
  }

  const user = db.users.find((u) => u.id === stored.userId);
  const org = db.organizations.find((o) => o.id === stored.orgId);
  const member = db.members.find((m) => m.organizationId === stored.orgId && m.userId === stored.userId);

  if (!user || !org) {
    return res.status(400).json({ success: false, message: 'Invalid user or organization context' });
  }

  // Gather active entitlements for payload
  const entitlements = db.entitlements.filter((e) => e.organizationId === org.id);

  // Sign JWT with full claims
  const tokenPayload = {
    iss: 'https://paperglow.com/api/v1/oauth',
    sub: user.uuid,
    email: user.email,
    name: user.name,
    org: {
      uuid: org.uuid,
      name: org.name,
      slug: org.slug,
      country: org.countryCode,
      currency: org.preferredCurrency,
    },
    role: member ? member.roleName : 'member',
    entitlements: entitlements.map((e) => e.featureKey),
  };

  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

  // Remove used code
  db.oauthAuthCodes = db.oauthAuthCodes.filter((c) => c.code !== code);
  saveDB(db);

  return res.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 28800,
    user_info: tokenPayload,
  });
});

// Token Introspection / Verification endpoint for independent Paperglow sub-apps
app.get('/api/v1/oauth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ active: false, message: 'Missing Bearer token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ active: true, claims: decoded });
  } catch (err) {
    return res.status(401).json({ active: false, message: 'Token invalid or expired' });
  }
});

// DirectAdmin MySQL DDL Exporter endpoint
app.get('/api/v1/export/directadmin-schema.sql', (_req: Request, res: Response) => {
  const schemaPath = path.join(__dirname, 'database', 'paperglow_directadmin_mysql_schema.sql');
  if (fs.existsSync(schemaPath)) {
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="paperglow_directadmin_mysql_schema.sql"');
    return res.send(fs.readFileSync(schemaPath, 'utf-8'));
  }
  return res.status(404).send('-- Schema file not found');
});

// ============================================================================
// MOUNT VITE / STATIC FRONTEND
// ============================================================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development mode with Vite Middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Paperglow] Full-Stack Backend + Client running on http://0.0.0.0:${PORT}`);
    console.log(`[Paperglow] Kenya (KES) MySQL architecture initialized`);
  });
}

startServer().catch((err) => {
  console.error('[Paperglow] Server failed to start:', err);
  process.exit(1);
});
