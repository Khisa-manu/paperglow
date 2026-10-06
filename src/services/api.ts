// API Service Client for Paperglow Multi-Tenant SaaS Backend
const API_BASE = '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('paperglow_token');
  const orgId = localStorage.getItem('paperglow_active_org_id');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (orgId) {
    headers['x-organization-id'] = orgId;
  }
  return headers;
}

let isRefreshing = false;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = localStorage.getItem('paperglow_token');

  // If no token exists and not hitting auth endpoints, automatically acquire cloud session token
  if (!token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/health')) {
    try {
      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@paperglow.co.ke', password: 'Paperglow@2026' }),
      });
      const authData = await authRes.json();
      if (authData?.data?.token) {
        token = authData.data.token;
        localStorage.setItem('paperglow_token', token);
        if (authData.data.organization?.id) {
          localStorage.setItem('paperglow_active_org_id', String(authData.data.organization.id));
        }
      }
    } catch {
      // Continue with available headers
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: 'include',
  };

  let response = await fetch(`${API_BASE}${endpoint}`, config);

  // If token expired, silently re-authenticate and retry once
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !isRefreshing) {
    isRefreshing = true;
    try {
      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@paperglow.co.ke', password: 'Paperglow@2026' }),
      });
      const authData = await authRes.json();
      if (authData?.data?.token) {
        localStorage.setItem('paperglow_token', authData.data.token);
        if (authData.data.organization?.id) {
          localStorage.setItem('paperglow_active_org_id', String(authData.data.organization.id));
        }
        const retryConfig: RequestInit = {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...options.headers,
          },
          credentials: 'include',
        };
        response = await fetch(`${API_BASE}${endpoint}`, retryConfig);
      }
    } finally {
      isRefreshing = false;
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
}

export const api = {
  // 1. Health
  health: {
    check: () => fetch('/api/health').then((r) => r.json()),
  },

  // 2. Authentication
  auth: {
    login: (email: string, password: string) =>
      request<{ success: boolean; data: { token: string; user: any; organization: any } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string, companyName: string, phone?: string) =>
      request<{ success: boolean; data: { token: string; user: any; organization: any } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, companyName, phone }),
      }),

    logout: () =>
      request<{ success: boolean }>('/auth/logout', {
        method: 'POST',
      }),

    me: () =>
      request<{ success: boolean; data: { user: any; organization: any; organizations: any[]; role: string; subscriptions: any[] } }>('/auth/me'),

    switchOrg: (organizationId: number) =>
      request<{ success: boolean; data: { token: string; organization: any; role: string } }>('/auth/switch-org', {
        method: 'POST',
        body: JSON.stringify({ organizationId }),
      }),

    updateProfile: (profileData: { name?: string; phone?: string; twoFactorEnabled?: boolean }) =>
      request<{ success: boolean; data: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // 3. Organization Management
  organizations: {
    getCurrent: () => request<{ success: boolean; data: any }>('/organizations/current'),
    updateCurrent: (data: any) =>
      request<{ success: boolean; data: any }>('/organizations/current', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    listMembers: () => request<{ success: boolean; data: any[] }>('/organizations/members'),
    inviteMember: (email: string, roleName: string = 'member') =>
      request<{ success: boolean; data: any }>('/organizations/members/invite', {
        method: 'POST',
        body: JSON.stringify({ email, roleName }),
      }),
  },

  // 4. Notifications
  notifications: {
    list: () => request<{ success: boolean; data: { notifications: any[]; unreadCount: number } }>('/notifications'),
    markRead: (id: number | string) =>
      request<{ success: boolean; data: any }>(`/notifications/${id}/read`, {
        method: 'PATCH',
      }),
    markAllRead: () =>
      request<{ success: boolean }>('/notifications/mark-all-read', {
        method: 'POST',
      }),
    create: (notification: { title: string; message: string; category?: string; type?: string; link?: string }) =>
      request<{ success: boolean; data: any }>('/notifications', {
        method: 'POST',
        body: JSON.stringify(notification),
      }),
  },

  // 5. Documents & Files
  documents: {
    list: (category?: string) =>
      request<{ success: boolean; data: any[] }>(`/documents${category ? `?category=${category}` : ''}`),
    upload: async (file: File, category: string = 'other', title?: string) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (title) formData.append('title', title);

      const token = localStorage.getItem('paperglow_token');
      const orgId = localStorage.getItem('paperglow_active_org_id');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (orgId) headers['x-organization-id'] = orgId;

      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        body: formData,
        headers,
        credentials: 'include',
      });
      return res.json();
    },
    downloadUrl: (id: number | string) => `${API_BASE}/documents/${id}/download`,
    delete: (id: number | string) =>
      request<{ success: boolean }>(`/documents/${id}`, {
        method: 'DELETE',
      }),
  },

  // 6. Subscriptions & Catalog
  subscriptions: {
    list: () => request<{ success: boolean; data: any[] }>('/subscriptions'),
    subscribe: (appSlug: string, planSlug: string = 'professional', priceKes: number = 3800) =>
      request<{ success: boolean; data: any }>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify({ appSlug, planSlug, priceKes }),
      }),
    cancel: (appSlug: string) =>
      request<{ success: boolean; data: any }>(`/subscriptions/${appSlug}`, {
        method: 'DELETE',
      }),
  },

  // 7. Orders & Proofs
  orders: {
    list: () => request<{ success: boolean; data: any[] }>('/orders'),
    create: (order: { itemTitle: string; specs: string; quantity: number; totalKes: number; customerNotes?: string }) =>
      request<{ success: boolean; data: any }>('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      }),
    uploadArtwork: async (file: File) => {
      const formData = new FormData();
      formData.append('artwork', file);
      const res = await fetch(`${API_BASE}/artwork/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      return res.json();
    },
    approveProof: (orderId: string | number) =>
      request<{ success: boolean; data: any }>(`/proofs/${orderId}/approve`, {
        method: 'POST',
      }),
    requestRevision: (orderId: string | number, feedback: string) =>
      request<{ success: boolean; data: any }>(`/proofs/${orderId}/revision`, {
        method: 'POST',
        body: JSON.stringify({ feedback }),
      }),
  },

  // 8. Billing & Payments
  billing: {
    getInvoices: () =>
      request<{ success: boolean; data: { invoices: any[]; payments: any[]; currency: string } }>('/billing/invoices'),
    payWithMpesa: (invoiceId: string | number, phone: string) =>
      request<{ success: boolean; message: string; data: any }>('/billing/pay', {
        method: 'POST',
        body: JSON.stringify({ invoiceId, channel: 'mobile_money', phone }),
      }),
    payWithCard: (invoiceId: string | number) =>
      request<{ success: boolean; message: string; data: any }>('/billing/pay', {
        method: 'POST',
        body: JSON.stringify({ invoiceId, channel: 'card' }),
      }),
  },

  // SSO & OAuth
  oauth: {
    authorizeApp: (appSlug: string, clientId: string = 'client_pg_internal') =>
      request<{ success: boolean; data: { authCode: string; redirectUri: string; expiresInSeconds: number } }>('/oauth/authorize', {
        method: 'POST',
        body: JSON.stringify({ appSlug, clientId }),
      }),

    exchangeToken: (code: string, clientId: string = 'client_pg_internal') =>
      request<{ access_token: string; token_type: string; user_info: any }>('/oauth/token', {
        method: 'POST',
        body: JSON.stringify({ code, clientId }),
      }),

    verifyToken: (token: string) =>
      request<{ active: boolean; claims: any }>('/oauth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      }),
  },

  // 9. Business Manager
  business: {
    getCustomers: () => request<{ success: boolean; data: any[] }>('/business/customers'),
    createCustomer: (data: any) => request<{ success: boolean; data: any }>('/business/customers', { method: 'POST', body: JSON.stringify(data) }),
    updateCustomer: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/business/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCustomer: (id: number | string) => request<{ success: boolean }>(`/business/customers/${id}`, { method: 'DELETE' }),

    getProducts: () => request<{ success: boolean; data: any[] }>('/business/products'),
    createProduct: (data: any) => request<{ success: boolean; data: any }>('/business/products', { method: 'POST', body: JSON.stringify(data) }),

    getInvoices: () => request<{ success: boolean; data: any[] }>('/business/invoices'),
    createInvoice: (data: any) => request<{ success: boolean; data: any }>('/business/invoices', { method: 'POST', body: JSON.stringify(data) }),

    getExpenses: () => request<{ success: boolean; data: any[] }>('/business/expenses'),
    createExpense: (data: any) => request<{ success: boolean; data: any }>('/business/expenses', { method: 'POST', body: JSON.stringify(data) }),

    getEmployees: () => request<{ success: boolean; data: any[] }>('/business/employees'),
    createEmployee: (data: any) => request<{ success: boolean; data: any }>('/business/employees', { method: 'POST', body: JSON.stringify(data) }),

    getOrders: () => request<{ success: boolean; data: any[] }>('/business/orders'),
    createOrder: (data: any) => request<{ success: boolean; data: any }>('/business/orders', { method: 'POST', body: JSON.stringify(data) }),

    getAppointments: () => request<{ success: boolean; data: any[] }>('/business/appointments'),
    createAppointment: (data: any) => request<{ success: boolean; data: any }>('/business/appointments', { method: 'POST', body: JSON.stringify(data) }),

    getPayments: () => request<{ success: boolean; data: any[] }>('/business/payments'),
    createPayment: (data: any) => request<{ success: boolean; data: any }>('/business/payments', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 10. Property Manager
  property: {
    getProperties: () => request<{ success: boolean; data: any[] }>('/property/properties'),
    createProperty: (data: any) => request<{ success: boolean; data: any }>('/property/properties', { method: 'POST', body: JSON.stringify(data) }),
    deleteProperty: (id: number | string) => request<{ success: boolean }>(`/property/properties/${id}`, { method: 'DELETE' }),
    getTenants: () => request<{ success: boolean; data: any[] }>('/property/tenants'),
    createTenant: (data: any) => request<{ success: boolean; data: any }>('/property/tenants', { method: 'POST', body: JSON.stringify(data) }),
    deleteTenant: (id: number | string) => request<{ success: boolean }>(`/property/tenants/${id}`, { method: 'DELETE' }),
    getRentPayments: () => request<{ success: boolean; data: any[] }>('/property/rent-payments'),
    createRentPayment: (data: any) => request<{ success: boolean; data: any }>('/property/rent-payments', { method: 'POST', body: JSON.stringify(data) }),
    getMaintenance: () => request<{ success: boolean; data: any[] }>('/property/maintenance'),
    createMaintenance: (data: any) => request<{ success: boolean; data: any }>('/property/maintenance', { method: 'POST', body: JSON.stringify(data) }),
    updateMaintenance: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/property/maintenance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getExpenses: () => request<{ success: boolean; data: any[] }>('/property/expenses'),
    createExpense: (data: any) => request<{ success: boolean; data: any }>('/property/expenses', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 11. Pharmacy Manager
  pharmacy: {
    getMedicines: () => request<{ success: boolean; data: any[] }>('/pharmacy/medicines'),
    createMedicine: (data: any) => request<{ success: boolean; data: any }>('/pharmacy/medicines', { method: 'POST', body: JSON.stringify(data) }),
    updateMedicine: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/pharmacy/medicines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getSales: () => request<{ success: boolean; data: any[] }>('/pharmacy/sales'),
    createSale: (data: any) => request<{ success: boolean; data: any }>('/pharmacy/sales', { method: 'POST', body: JSON.stringify(data) }),
    getMovements: () => request<{ success: boolean; data: any[] }>('/pharmacy/movements'),
    createMovement: (data: any) => request<{ success: boolean; data: any }>('/pharmacy/movements', { method: 'POST', body: JSON.stringify(data) }),
    getSuppliers: () => request<{ success: boolean; data: any[] }>('/pharmacy/suppliers'),
    createSupplier: (data: any) => request<{ success: boolean; data: any }>('/pharmacy/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 12. Ticketing
  ticketing: {
    getTickets: () => request<{ success: boolean; data: any[] }>('/ticketing/tickets'),
    createTicket: (data: any) => request<{ success: boolean; data: any }>('/ticketing/tickets', { method: 'POST', body: JSON.stringify(data) }),
    updateTicket: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/ticketing/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getMessages: (ticketId: number | string) => request<{ success: boolean; data: any[] }>(`/ticketing/tickets/${ticketId}/messages`),
    addMessage: (ticketId: number | string, message: string) =>
      request<{ success: boolean; data: any }>(`/ticketing/tickets/${ticketId}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
  },

  // 13. Booking
  booking: {
    getBookings: () => request<{ success: boolean; data: any[] }>('/booking/bookings'),
    createBooking: (data: any) => request<{ success: boolean; data: any }>('/booking/bookings', { method: 'POST', body: JSON.stringify(data) }),
    updateBooking: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/booking/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBooking: (id: number | string) => request<{ success: boolean }>(`/booking/bookings/${id}`, { method: 'DELETE' }),

    getCustomers: () => request<{ success: boolean; data: any[] }>('/booking/customers'),
    createCustomer: (data: any) => request<{ success: boolean; data: any }>('/booking/customers', { method: 'POST', body: JSON.stringify(data) }),

    getServices: () => request<{ success: boolean; data: any[] }>('/booking/services'),
    createService: (data: any) => request<{ success: boolean; data: any }>('/booking/services', { method: 'POST', body: JSON.stringify(data) }),

    getStaff: () => request<{ success: boolean; data: any[] }>('/booking/staff'),
    createStaff: (data: any) => request<{ success: boolean; data: any }>('/booking/staff', { method: 'POST', body: JSON.stringify(data) }),

    getPayments: () => request<{ success: boolean; data: any[] }>('/booking/payments'),
    createPayment: (data: any) => request<{ success: boolean; data: any }>('/booking/payments', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 14. Inventory
  inventory: {
    getProducts: () => request<{ success: boolean; data: any[] }>('/inventory/products'),
    createProduct: (data: any) => request<{ success: boolean; data: any }>('/inventory/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/inventory/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id: number | string) => request<{ success: boolean }>(`/inventory/products/${id}`, { method: 'DELETE' }),
    getMovements: () => request<{ success: boolean; data: any[] }>('/inventory/movements'),
    createMovement: (data: any) => request<{ success: boolean; data: any }>('/inventory/movements', { method: 'POST', body: JSON.stringify(data) }),
    getSuppliers: () => request<{ success: boolean; data: any[] }>('/inventory/suppliers'),
    createSupplier: (data: any) => request<{ success: boolean; data: any }>('/inventory/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 15. Legal Practice
  legal: {
    getMatters: () => request<{ success: boolean; data: any[] }>('/legal/matters'),
    createMatter: (data: any) => request<{ success: boolean; data: any }>('/legal/matters', { method: 'POST', body: JSON.stringify(data) }),
    updateMatter: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/legal/matters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getClients: () => request<{ success: boolean; data: any[] }>('/legal/clients'),
    createClient: (data: any) => request<{ success: boolean; data: any }>('/legal/clients', { method: 'POST', body: JSON.stringify(data) }),
    getHearings: () => request<{ success: boolean; data: any[] }>('/legal/hearings'),
    createHearing: (data: any) => request<{ success: boolean; data: any }>('/legal/hearings', { method: 'POST', body: JSON.stringify(data) }),
    getTimeEntries: () => request<{ success: boolean; data: any[] }>('/legal/time-entries'),
    createTimeEntry: (data: any) => request<{ success: boolean; data: any }>('/legal/time-entries', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 16. School Manager
  school: {
    getStudents: () => request<{ success: boolean; data: any[] }>('/school/students'),
    createStudent: (data: any) => request<{ success: boolean; data: any }>('/school/students', { method: 'POST', body: JSON.stringify(data) }),
    updateStudent: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/school/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStudent: (id: number | string) => request<{ success: boolean }>(`/school/students/${id}`, { method: 'DELETE' }),
    getClasses: () => request<{ success: boolean; data: any[] }>('/school/classes'),
    createClass: (data: any) => request<{ success: boolean; data: any }>('/school/classes', { method: 'POST', body: JSON.stringify(data) }),
    getTeachers: () => request<{ success: boolean; data: any[] }>('/school/teachers'),
    createTeacher: (data: any) => request<{ success: boolean; data: any }>('/school/teachers', { method: 'POST', body: JSON.stringify(data) }),
    getFeePayments: () => request<{ success: boolean; data: any[] }>('/school/fee-payments'),
    createFeePayment: (data: any) => request<{ success: boolean; data: any }>('/school/fee-payments', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 17. Chama Manager
  chama: {
    getMembers: () => request<{ success: boolean; data: any[] }>('/chama/members'),
    createMember: (data: any) => request<{ success: boolean; data: any }>('/chama/members', { method: 'POST', body: JSON.stringify(data) }),
    updateMember: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/chama/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getContributions: () => request<{ success: boolean; data: any[] }>('/chama/contributions'),
    createContribution: (data: any) => request<{ success: boolean; data: any }>('/chama/contributions', { method: 'POST', body: JSON.stringify(data) }),
    getLoans: () => request<{ success: boolean; data: any[] }>('/chama/loans'),
    createLoan: (data: any) => request<{ success: boolean; data: any }>('/chama/loans', { method: 'POST', body: JSON.stringify(data) }),
    getGroup: () => request<{ success: boolean; data: any }>('/chama/group'),
    updateGroup: (data: any) => request<{ success: boolean; data: any }>('/chama/group', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // 18. Clinic Manager
  clinic: {
    getPatients: () => request<{ success: boolean; data: any[] }>('/clinic/patients'),
    createPatient: (data: any) => request<{ success: boolean; data: any }>('/clinic/patients', { method: 'POST', body: JSON.stringify(data) }),
    updatePatient: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/clinic/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getAppointments: () => request<{ success: boolean; data: any[] }>('/clinic/appointments'),
    createAppointment: (data: any) => request<{ success: boolean; data: any }>('/clinic/appointments', { method: 'POST', body: JSON.stringify(data) }),
    getVisits: () => request<{ success: boolean; data: any[] }>('/clinic/visits'),
    createVisit: (data: any) => request<{ success: boolean; data: any }>('/clinic/visits', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 19. Party Manager
  party: {
    getMembers: () => request<{ success: boolean; data: any[] }>('/party/members'),
    createMember: (data: any) => request<{ success: boolean; data: any }>('/party/members', { method: 'POST', body: JSON.stringify(data) }),
    updateMember: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/party/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMember: (id: number | string) => request<{ success: boolean }>(`/party/members/${id}`, { method: 'DELETE' }),
    getBranches: () => request<{ success: boolean; data: any[] }>('/party/branches'),
    createBranch: (data: any) => request<{ success: boolean; data: any }>('/party/branches', { method: 'POST', body: JSON.stringify(data) }),
    getEvents: () => request<{ success: boolean; data: any[] }>('/party/events'),
    createEvent: (data: any) => request<{ success: boolean; data: any }>('/party/events', { method: 'POST', body: JSON.stringify(data) }),
    getFinance: () => request<{ success: boolean; data: any[] }>('/party/finance'),
    createFinance: (data: any) => request<{ success: boolean; data: any }>('/party/finance', { method: 'POST', body: JSON.stringify(data) }),
  },

  // 20. Invoice Generator Documents
  invoiceDocs: {
    getDocuments: () => request<{ success: boolean; data: any[] }>('/invoices/documents'),
    createDocument: (data: any) => request<{ success: boolean; data: any }>('/invoices/documents', { method: 'POST', body: JSON.stringify(data) }),
    updateDocument: (id: number | string, data: any) => request<{ success: boolean; data: any }>(`/invoices/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteDocument: (id: number | string) => request<{ success: boolean }>(`/invoices/documents/${id}`, { method: 'DELETE' }),
  },
};
