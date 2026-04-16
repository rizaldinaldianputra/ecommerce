import { apiClient } from './api.client';
import { AuthUser } from '@/types/auth';
export type { AuthUser } from '@/types/auth';

export const authService = {
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('shekza_token');
    return !!token && token !== 'undefined' && token !== 'null';
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('shekza_token');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  },

  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('shekza_user');
    return user ? JSON.parse(user) : null;
  },

  fetchMe: async (): Promise<AuthUser> => {
    const response = await apiClient.get<any>('/v1/auth/me');
    const data = response.data;

    // Merge with existing token if possible
    const existingUser = authService.getUser();
    const updatedUser = {
      ...data,
      token: authService.getToken() || (existingUser?.token || '')
    };

    localStorage.setItem('shekza_user', JSON.stringify(updatedUser));
    
    if (typeof document !== 'undefined') {
      const role = updatedUser.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
      document.cookie = `shekza_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    }

    window.dispatchEvent(new Event('auth-change'));
    return updatedUser;
  },

  isAdmin: (): boolean => {
    const user = authService.getUser();
    return !!user?.roles?.includes('ROLE_ADMIN');
  },

  login: async (credentials: any): Promise<AuthUser> => {
    const response = await apiClient.post<any>('/v1/auth/login', credentials);
    // extract data from ApiResponse wrapper
    const data = response.data;

    if (data.token) {
      localStorage.setItem('shekza_token', data.token);
      localStorage.setItem('shekza_user', JSON.stringify(data));

      // Set cookie for middleware (Next.js server-side)
      if (typeof document !== 'undefined') {
        document.cookie = `shekza_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        const role = data.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
        document.cookie = `shekza_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }

      window.dispatchEvent(new Event('auth-change'));
    }
    return data;
  },

  register: async (userData: any): Promise<AuthUser> => {
    const response = await apiClient.post<any>('/v1/auth/register', userData);
    const data = response.data;

    if (data.token) {
      localStorage.setItem('shekza_token', data.token);
      localStorage.setItem('shekza_user', JSON.stringify(data));

      if (typeof document !== 'undefined') {
        document.cookie = `shekza_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        const role = data.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
        document.cookie = `shekza_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }

      window.dispatchEvent(new Event('auth-change'));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('shekza_token');
    localStorage.removeItem('shekza_user');

    if (typeof document !== 'undefined') {
      document.cookie = 'shekza_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'shekza_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }

    window.dispatchEvent(new Event('auth-change'));
  },

  handleOAuthSuccess: async (token: string) => {
    localStorage.setItem('shekza_token', token);

    // Also set cookie for middleware support
    if (typeof document !== 'undefined') {
      document.cookie = `shekza_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }

    // Fetch user data immediately after success
    try {
      await authService.fetchMe();
    } catch (error) {
      console.error('Failed to fetch user data after OAuth success:', error);
    }

    window.dispatchEvent(new Event('auth-change'));
  },

  requestOtp: async (phoneNumber: string): Promise<void> => {
    await apiClient.post(`/v1/auth/otp/request?phoneNumber=${encodeURIComponent(phoneNumber)}`, {});
  },

  loginWithOtp: async (phoneNumber: string, code: string): Promise<AuthUser> => {
    const response = await apiClient.post<any>(`/v1/auth/otp/login?phoneNumber=${encodeURIComponent(phoneNumber)}&code=${encodeURIComponent(code)}`, {});
    const data = response.data;

    if (data.token) {
      localStorage.setItem('shekza_token', data.token);
      localStorage.setItem('shekza_user', JSON.stringify(data));

      if (typeof document !== 'undefined') {
        document.cookie = `shekza_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        const role = data.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
        document.cookie = `shekza_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }

      window.dispatchEvent(new Event('auth-change'));
    }
    return data;
  }
};
