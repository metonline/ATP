import { create } from 'zustand';
import axios from 'axios';

interface Farmer {
  id: number;
  email: string;
  username: string;
  full_name: string;
  region?: string;
  phone?: string;
  farm_size_hectares?: number;
  primary_crops?: string;
}

interface AuthStore {
  token: string | null;
  farmer: Farmer | null;
  loading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName: string, kvkkConsent: boolean) => Promise<any>;
  logout: () => void;
  setToken: (token: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('[REQ]', config.method?.toUpperCase(), config.url?.split('/').pop(), token ? 'âœ“ TOKEN' : 'âŒ NO TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors - token invalid/expired
api.interceptors.response.use(
  (response) => {
    console.log('[AXIOS RES]', response.status, response.config?.url);
    return response;
  },
  (error) => {
    console.log('[AXIOS ERR]', error.response?.status, error.config?.url, error.message);
    if (error.response?.status === 401) {
      console.log('[LOGOUT] 401 Unauthorized - logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('farmer_id');
      localStorage.removeItem('farmer');
      localStorage.setItem('lastLogoutReason', JSON.stringify({
        reason: '401 from ' + error.config?.url,
        timestamp: new Date().toISOString(),
      }));
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  farmer: null,
  loading: false,
  error: null,

  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const farmer = localStorage.getItem('farmer');
    if (token && farmer) {
      set({ token, farmer: JSON.parse(farmer) });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { access_token, farmer_id, username } = response.data;

      // Store token
      localStorage.setItem('token', access_token);
      localStorage.setItem('farmer_id', farmer_id.toString());

      // Set store state
      set({
        token: access_token,
        farmer: { id: farmer_id, email, username, full_name: username },
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  register: async (email: string, username: string, password: string, fullName: string, kvkkConsent: boolean) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/auth/register', {
        email,
        username,
        password,
        full_name: fullName,
    kvkk_consent: kvkkConsent,
      });
      const { access_token, farmer_id } = response.data;

      // Admin onayı bekleyen kayıtlarda backend token/farmer_id döndürmüyor
      // (henüz onaylanmamış birine token vermek mantıklı değil). Bu durumda
      // otomatik giriş yapmaya çalışmadan, sonucu olduğu gibi çağırana
      // döndürüyoruz — RegisterPage bu response.status'a bakıp
      // "onay bekliyor" mesajını gösteriyor. Bunu atlayıp farmer_id.toString()
      // çağırmak (farmer_id undefined olduğu için) sessizce patlıyordu ve
      // kayıt backend'de başarıyla tamamlanmış olsa bile kullanıcıya
      // "Registration failed" gösteriyordu.
      if (!access_token || !farmer_id) {
        set({ loading: false });
        return response.data;
      }

      // Store token
      localStorage.setItem('token', access_token);
      localStorage.setItem('farmer_id', farmer_id.toString());

      // Set store state
      set({
        token: access_token,
        farmer: { id: farmer_id, email, username, full_name: fullName },
        loading: false,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('farmer_id');
    localStorage.removeItem('farmer');
    set({ token: null, farmer: null, error: null });
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token });
  },
}));

export { api };

