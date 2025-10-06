import React, { createContext, useState, useEffect } from "react";
import { getProfile, login as apiLogin } from "../services/api";
import type { User } from "../types/domain";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Vérifie token à l'initialisation
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await getProfile();
          setUser(res.data);
        } catch (err) {
          console.warn("Token invalide, logout automatique");
          logout();
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, []);

  // Login
  const login = async (username: string, password: string) => {
    const res = await apiLogin(username, password);
    const { access, refresh } = res.data;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    const profile = await getProfile();
    setUser(profile.data);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  // Refresh token automatique (optionnel, à ajouter dans interceptor axios si nécessaire)

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
