import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import type { User } from "../types/domain";
import { cleanupAuthLocalStorage } from "../utils/localStorageCleanup";

// === Utilitaire pour générer les initiales ===
const getInitials = (
  firstName?: string,
  lastName?: string,
  username?: string
): string => {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (username) {
    return username.slice(0, 2).toUpperCase();
  }
  return "?";
};

// === Types des rôles ===
export type UserRole =
  | "admin"       // Marchand
  | "user"        // Client
  | "superadmin"  // Gestionnaire de plateforme
  | "agent"       // Agents
  | "partner"; // Distributeurs

// === Interface de l'état d'auth ===
export interface AuthState {
  user: User | null;
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (user: User, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
}

// === Store Zustand ===
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: false,

      login: (user, tokens) => {
        // Génération automatique des initiales à la connexion
        const avatar = getInitials(user.first_name, user.last_name, user.username);

        const userRole = (user.role as UserRole) || null;

        set({
          user: { ...user, avatar },
          role: userRole,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          isAuthenticated: true,
          hydrated: true,
        });

        // Sauvegarde du rôle dans le localStorage
        if (userRole) localStorage.setItem("user_role", userRole);

        cleanupAuthLocalStorage();
      },

      logout: () => {
        set({
          user: null,
          role: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          hydrated: true,
        });

        localStorage.removeItem("user_role");
        cleanupAuthLocalStorage();
      },
    }),
    {
      name: LOCAL_STORAGE_KEYS.AUTH_STATE,
      onRehydrateStorage: () => (state) => {
        if (state) setTimeout(() => (state.hydrated = true), 100);
      },
    }
  )
);
