import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '../config/constants'; // Le chemin est déjà bon, mais c'est pour l'exemple
import type { User, Agent } from '../types/domain';
import { cleanupAuthLocalStorage } from '../utils/localStorageCleanup';

export interface AuthState {
  agent: Agent | null;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
}

// Vérifie s'il y a un état d'authentification dans le localStorage au démarrage.
const getInitialIsAuthenticated = (): boolean => {
  const authState = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_STATE);
  if (!authState) return false;
  try {
    const { state } = JSON.parse(authState);
    return !!state?.accessToken; // L'utilisateur est considéré comme authentifié s'il y a un token.
  } catch {
    return false;
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      agent: null,
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: getInitialIsAuthenticated(),

      // Gère la connexion après une validation réussie
      login: (user: User, tokens: { access: string; refresh: string }) => {
        try {
          set({
            user,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
          });
          // Nettoyage du token temporaire qui n'est plus nécessaire
          cleanupAuthLocalStorage();
        } catch (error) {
          console.error("Login error:", error);
          // Optionally, handle the error (e.g., show a notification)
        }
      },

      logout: () => {
        try {
          // On vide l'état du store
          set({ agent: null, user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
          // Et on s'assure de nettoyer complètement le localStorage
          cleanupAuthLocalStorage();
        } catch (error) {
          console.error("Logout error:", error);
          // Optionally, handle the error (e.g., show a notification)
        }
      },
    }),
    { name: LOCAL_STORAGE_KEYS.AUTH_STATE }
  )
);

export const useIsAuthenticated = () => {
  const auth = useAuth();
  return auth.isAuthenticated;
};
