import api from '@/lib/axios';
import { User, AuthResponse } from '@/types/user';

export const authService = {
  register: async (name: string, email: string, password: string): Promise<User> => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return res.data.data;
  },

  login: async (email: string, password: string): Promise<User> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<AuthResponse>('/auth/me');
    return res.data.data;
  },
};
