import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '../config/constants'; // Le chemin est déjà bon, mais c'est pour l'exemple
import type { User } from '../types/domain';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Gère la connexion après une validation réussie
      login: (user: User, tokens: { access: string; refresh: string }) => {
        set({
          user,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          isAuthenticated: true,
        });
        // Nettoyage du token temporaire qui n'est plus nécessaire
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PHONE);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_CODE);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.MASKED_PHONE);
      },

      logout: () => {
        // On vide l'état du store
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        // Et on s'assure de nettoyer complètement le localStorage
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_STATE);
      },
    }),
    { name: LOCAL_STORAGE_KEYS.AUTH_STATE }
  )
);
export const useIsAuthenticated = () => {
  const auth = useAuth();
  return auth.isAuthenticated;
};
