import {
  User,
  Package,
  Prediction,
  Payment,
  Subscription,
  Advertisement,
  AppNotification,
  AppSettings,
  AdminStats,
} from '../types';

const USER_TOKEN_KEY = 'washindi_user_token';
const ADMIN_TOKEN_KEY = 'washindi_admin_token';

export const authStorage = {
  getUserToken: () => localStorage.getItem(USER_TOKEN_KEY),
  setUserToken: (t: string) => localStorage.setItem(USER_TOKEN_KEY, t),
  removeUserToken: () => localStorage.removeItem(USER_TOKEN_KEY),

  getAdminToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  setAdminToken: (t: string) => localStorage.setItem(ADMIN_TOKEN_KEY, t),
  removeAdminToken: () => localStorage.removeItem(ADMIN_TOKEN_KEY),
};

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Kuna hitilafu imetokea. Tafadhali jaribu tena.');
  }
  return data;
}

export const api = {
  // Public
  async getSettings(): Promise<AppSettings> {
    return fetchJson<AppSettings>('/api/settings');
  },

  async getPackages(): Promise<Package[]> {
    return fetchJson<Package[]>('/api/packages');
  },

  async getBanners(): Promise<Advertisement[]> {
    return fetchJson<Advertisement[]>('/api/banners');
  },

  async getPredictions(): Promise<Prediction[]> {
    const token = authStorage.getUserToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetchJson<Prediction[]>('/api/predictions', { headers });
  },

  // User Auth
  async register(phone: string, password: string, name?: string): Promise<{ token: string; user: User }> {
    const res = await fetchJson<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password, name }),
    });
    authStorage.setUserToken(res.token);
    return res;
  },

  async login(phone: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetchJson<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    authStorage.setUserToken(res.token);
    return res;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = authStorage.getUserToken();
    if (!token) return null;
    try {
      return await fetchJson<User>('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      authStorage.removeUserToken();
      return null;
    }
  },

  async getMe(): Promise<{ user: User; activeSubscriptions: Subscription[] } | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;
    const subs = await this.getMySubscriptions();
    return { user, activeSubscriptions: subs };
  },

  async logout() {
    this.logoutUser();
  },

  async updateProfile(name: string): Promise<User> {
    const token = authStorage.getUserToken();
    return fetchJson<User>('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
  },

  async logoutUser() {
    authStorage.removeUserToken();
  },

  // User Payments & Subscriptions
  async submitPayment(
    packageId: string,
    transactionId: string,
    phone: string,
    paymentMethod?: string
  ): Promise<{ success: boolean; message: string; payment: Payment }> {
    const token = authStorage.getUserToken();
    return fetchJson<{ success: boolean; message: string; payment: Payment }>('/api/payments/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ packageId, transactionId, phone, paymentMethod }),
    });
  },

  async getMyPayments(): Promise<Payment[]> {
    const token = authStorage.getUserToken();
    if (!token) return [];
    return fetchJson<Payment[]>('/api/payments/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getMySubscriptions(): Promise<Subscription[]> {
    const token = authStorage.getUserToken();
    if (!token) return [];
    return fetchJson<Subscription[]>('/api/subscriptions/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getMyNotifications(): Promise<AppNotification[]> {
    const token = authStorage.getUserToken();
    if (!token) return [];
    return fetchJson<AppNotification[]>('/api/notifications/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getNotifications(): Promise<AppNotification[]> {
    return this.getMyNotifications();
  },

  async markNotificationsRead(): Promise<void> {
    const token = authStorage.getUserToken();
    if (!token) return;
    await fetchJson('/api/notifications/mark-read', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // ============ ADMIN API ============
  async adminLogin(username: string, password: string): Promise<{ token: string; admin: { username: string } }> {
    const res = await fetchJson<{ token: string; admin: { username: string } }>('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    authStorage.setAdminToken(res.token);
    return res;
  },

  async getAdminMe(): Promise<{ username: string } | null> {
    const token = authStorage.getAdminToken();
    if (!token) return null;
    try {
      return await fetchJson<{ username: string }>('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      authStorage.removeAdminToken();
      return null;
    }
  },

  async adminLogout() {
    authStorage.removeAdminToken();
  },

  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const token = authStorage.getAdminToken();
    return fetchJson('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async getAdminStats(): Promise<AdminStats> {
    const token = authStorage.getAdminToken();
    return fetchJson<AdminStats>('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminPayments(): Promise<Payment[]> {
    const token = authStorage.getAdminToken();
    return fetchJson<Payment[]>('/api/admin/payments', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async approvePayment(id: string): Promise<{ success: boolean; payment: Payment; subscription: Subscription }> {
    const token = authStorage.getAdminToken();
    return fetchJson(`/api/admin/payments/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async rejectPayment(id: string, reason?: string): Promise<{ success: boolean; payment: Payment }> {
    const token = authStorage.getAdminToken();
    return fetchJson(`/api/admin/payments/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
  },

  async getAdminSubscriptions(): Promise<Subscription[]> {
    const token = authStorage.getAdminToken();
    return fetchJson<Subscription[]>('/api/admin/subscriptions', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminUsers(): Promise<any[]> {
    const token = authStorage.getAdminToken();
    return fetchJson<any[]>('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin Predictions
  async getAdminPredictions(): Promise<Prediction[]> {
    const token = authStorage.getAdminToken();
    return fetchJson<Prediction[]>('/api/admin/predictions', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createPrediction(pred: Partial<Prediction>): Promise<Prediction> {
    const token = authStorage.getAdminToken();
    return fetchJson<Prediction>('/api/admin/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pred),
    });
  },

  async updatePrediction(id: string, pred: Partial<Prediction>): Promise<Prediction> {
    const token = authStorage.getAdminToken();
    return fetchJson<Prediction>(`/api/admin/predictions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pred),
    });
  },

  async deletePrediction(id: string): Promise<{ success: boolean }> {
    const token = authStorage.getAdminToken();
    return fetchJson(`/api/admin/predictions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin Banners
  async getAdminBanners(): Promise<Advertisement[]> {
    const token = authStorage.getAdminToken();
    return fetchJson<Advertisement[]>('/api/admin/banners', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createBanner(banner: Partial<Advertisement>): Promise<Advertisement> {
    const token = authStorage.getAdminToken();
    return fetchJson<Advertisement>('/api/admin/banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(banner),
    });
  },

  async updateBanner(id: string, banner: Partial<Advertisement>): Promise<Advertisement> {
    const token = authStorage.getAdminToken();
    return fetchJson<Advertisement>(`/api/admin/banners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(banner),
    });
  },

  async deleteBanner(id: string): Promise<{ success: boolean }> {
    const token = authStorage.getAdminToken();
    return fetchJson(`/api/admin/banners/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin Packages
  async updatePackage(id: string, pkg: Partial<Package>): Promise<Package> {
    const token = authStorage.getAdminToken();
    return fetchJson<Package>(`/api/admin/packages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pkg),
    });
  },

  // Admin Settings
  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const token = authStorage.getAdminToken();
    return fetchJson<AppSettings>('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
  },
};
