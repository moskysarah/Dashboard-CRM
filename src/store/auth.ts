import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import type { User } from "../types/domain";
import { cleanupAuthLocalStorage } from "../utils/localStorageCleanup";

export interface AuthState {
  user: User | null;
  role: string | null; //  je  garde le rôle
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
}

// pour Vérifié si l’utilisateur est déjà authentifié au démarrage
const getInitialIsAuthenticated = (): boolean => {
  const authState = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_STATE);
  if (!authState) return false;
  try {
    const { state } = JSON.parse(authState);
    return !!state?.accessToken;
  } catch {
    return false;
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: getInitialIsAuthenticated(),

      login: (user: User, tokens: { access: string; refresh: string }) => {
        try {
          set({
            user,
            role: user.role || null, //je stocke le rôle de l'utilisateur
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
          });

          // Optionnel : garder le rôle aussi dans le localStorage pour un accès rapide
          localStorage.setItem("user_role", user.role || "");

          cleanupAuthLocalStorage();
        } catch (error) {
          console.error("Login error:", error);
        }
      },

      logout: () => {
        try {
          set({
            user: null,
            role: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          localStorage.removeItem("user_role");
          cleanupAuthLocalStorage();
        } catch (error) {
          console.error("Logout error:", error);
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
