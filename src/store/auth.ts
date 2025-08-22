import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/domain';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginWithOtp: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Login avec OTP validé
      loginWithOtp: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'crm-auth' }
  )
);
export const useIsAuthenticated = () => {
  const auth = useAuth();
  return auth.isAuthenticated;
};
