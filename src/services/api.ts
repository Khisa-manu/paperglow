// API Service Client for Paperglow Backend (Phases 1, 2, and 3)
const API_BASE = '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Automatically sends and receives HttpOnly cookies
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ success: boolean; data: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string, companyName: string, phone?: string) =>
      request<{ success: boolean; data: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, companyName, phone }),
      }),

    logout: () =>
      request<{ success: boolean }>('/auth/logout', {
        method: 'POST',
      }),

    me: () =>
      request<{ success: boolean; data: any }>('/auth/me'),

    updateProfile: (profileData: { name?: string; phone?: string; twoFactorEnabled?: boolean }) =>
      request<{ success: boolean; data: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  subscriptions: {
    list: () =>
      request<{ success: boolean; data: any[] }>('/subscriptions'),

    subscribe: (appSlug: string, planSlug: string = 'professional', priceKes: number = 3800) =>
      request<{ success: boolean; data: any }>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify({ appSlug, planSlug, priceKes }),
      }),

    cancel: (appSlug: string) =>
      request<{ success: boolean; data: any }>(`/subscriptions/${appSlug}`, {
        method: 'DELETE',
      }),

    getEntitlements: () =>
      request<{ success: boolean; data: any[] }>('/entitlements'),
  },

  orders: {
    list: () =>
      request<{ success: boolean; data: any[] }>('/orders'),

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
};
