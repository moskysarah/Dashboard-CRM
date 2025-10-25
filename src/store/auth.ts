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
  hydrated: boolean; // 
  login: (user: User, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
  setHydrated: (value: boolean) => void; // 
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: false, //  au début, pas encore prêt

      setHydrated: (value) => set({ hydrated: value }),

      login: (user, tokens) => {
        try {
          set({
            user,
            role: user.role || null,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
          });

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
    {
      name: LOCAL_STORAGE_KEYS.AUTH_STATE,
      onRehydrateStorage: () => (state) => {
        //  après la restauration, on indique que le store est prêt
        state?.setHydrated(true);
      },
    }
  )
);

export const useIsAuthenticated = () => {
  const auth = useAuth();
  return auth.isAuthenticated;
};
