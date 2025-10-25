import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import type { User } from "../types/domain";
import { cleanupAuthLocalStorage } from "../utils/localStorageCleanup";

export interface AuthState {
  user: User | null;
  role: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (user: User, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
}

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
        set({
          user,
          role: user.role || null,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          isAuthenticated: true,
          hydrated: true,
        });
        localStorage.setItem("user_role", user.role || "");
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
        state && setTimeout(() => state.hydrated = true, 100);
      },
    }
  )
);
