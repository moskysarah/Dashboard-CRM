import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import { useAuth } from "../store/auth";

// ========================
// CONFIGURATION GLOBALE
// ========================
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.162.69.75:8078/api/v1",
});

// ========================
// GESTION DU TOKEN
// ========================
let cachedAuthState: { state?: { accessToken?: string } } | null = null;
let cachedAuthStateRaw: string | null = null;

function getAccessToken() {
  const tokenFromStore = useAuth.getState().accessToken;
  if (tokenFromStore) return tokenFromStore;

  const authStateFromStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_STATE);
  if (authStateFromStorage) {
    if (authStateFromStorage !== cachedAuthStateRaw) {
      cachedAuthStateRaw = authStateFromStorage;
      try {
        cachedAuthState = JSON.parse(authStateFromStorage);
      } catch {
        cachedAuthState = null;
      }
    }
    return cachedAuthState?.state?.accessToken ?? null;
  }

  return null;
}

// ========================
// INTERCEPTEUR REQUEST
// ========================
API.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    const normalizedUrl = config.url
      ? config.url.startsWith("/") ? config.url : "/" + config.url
      : "";

    // 🔓 Routes publiques (pas besoin de token)
    const publicEndpoints = [
      { url: "/accounts/otp/request/", method: "POST" },
      { url: "/accounts/token/phone/", method: "POST" },
      { url: "/accounts/users/", method: "POST" },
      { url: "/accounts/password-reset/", method: "POST" },
      { url: "/accounts/otp/login/", method: "POST" },
      { url: "/notification/messages/", method: "GET" }, //  ajouté pour recevoir les OTP
    ];

    const isPublicEndpoint = publicEndpoints.some(
      (endpoint) =>
        normalizedUrl === endpoint.url &&
        config.method?.toUpperCase() === endpoint.method
    );

    if (isPublicEndpoint) {
      config.headers.Authorization = undefined;
      return config;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// INTERCEPTEUR RESPONSE
// ========================
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error("Accès refusé (403): Permissions insuffisantes pour cette ressource.");
      // You can add custom logic here, like showing a notification or redirecting
      return Promise.reject(error);
    }

    if ((error.response?.status === 401 || error.response?.status === 419) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken: currentRefreshToken, login, logout } = useAuth.getState();

      if (currentRefreshToken) {
        try {
          const rs = await refreshToken(currentRefreshToken);
          const { access } = rs.data;
          const user = useAuth.getState().user;
          if (user) login(user, { access, refresh: currentRefreshToken });

          API.defaults.headers.common["Authorization"] = "Bearer " + access;
          originalRequest.headers["Authorization"] = "Bearer " + access;
          processQueue(null, access);
          return API(originalRequest);
        } catch (_error) {
          processQueue(_error, null);
          logout();
          return Promise.reject(_error);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

// ========================
// REFRESH TOKEN
// ========================
export const refreshToken = (refresh: string) =>
  API.post("/token/refresh/", { refresh });

// ========================
// DISTRIBUTEURS
// ========================
export const getDistributors = () => API.get("/distributors/");
export const createDistributor = (data: { name: string; commission: number; sales: number; stock: number }) =>
  API.post("/distributors/", data);
export const updateDistributor = (id: string, data: Partial<{ commission: number; stock: number }>) =>
  API.patch(`/distributors/${id}/`, data);
export const deleteDistributor = (id: string) => API.delete(`/distributors/${id}/`);

// ========================
// SALES
// ========================
export const getSales = () => API.get("/sales/");
export const createSale = (data: { distributorId: string; amount: number; date: string }) =>
  API.post("/sales/", data);

// ========================
// AUTHENTIFICATION (OTP, LOGIN, PASSWORD)
// ========================
export const requestOTP = (phone: string, password?: string) =>
  axios.post(`${API.defaults.baseURL}/accounts/otp/request/`, password ? { phone, password } : { phone });

export const otpLogin = (phone: string, otp: string) =>
  axios.post(`${API.defaults.baseURL}/accounts/otp/login/`, { phone, otp });

export const phoneLogin = (phone: string, password: string) =>
  axios.post(`${API.defaults.baseURL}/accounts/token/phone/`, { phone, password });

export const resetPassword = (email: string) =>
  axios.post(`${API.defaults.baseURL}/accounts/password-reset/`, { email });

export const confirmResetPassword = (token: string, password: string) =>
  axios.post(`${API.defaults.baseURL}/accounts/password-reset/confirm/`, { token, password });

export const changePassword = (data: { old_password: string; new_password: string }) =>
  API.post("/accounts/change-password/", data);

// ========================
// PROFIL UTILISATEUR
// ========================
export const getProfile = (userId: number) => API.get(`/accounts/users/${userId}/`);

// ========================
// CRÉATION ET GESTION DES UTILISATEURS
// ========================
export const createUser = (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}) => API.post("/accounts/users/", userData);

export const getAdminUsers = (params?: { page?: number; page_size?: number }) =>
  API.get("/accounts/users/", { params });

export const updateAdminUser = (id: string, data: Partial<{
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
}>) => API.patch(`/accounts/users/${id}/`, data);

export const deleteAdminUser = (id: string) =>
  API.delete(`/accounts/users/${id}/`);

// ========================

// ========================
// MERCHANTS
// ========================
export const getMerchants = () => API.get("/merchants/");

// ========================
// NOTIFICATIONS
// ========================
export const getNotifications = () => API.get("/notification/messages/");
export const markNotificationRead = (id: string) =>
  API.patch(`/notification/messages/${id}/`, { is_read: true });

// ========================
// TRANSACTIONS & FINANCES
// ========================
export const getTransactions = () => API.get("/me/transactions/");
export const getUserWallet = () => API.get("/me/wallet/");
export const getMerchantWallets = () => API.get("/me/wallet/");


//   ADMIN PANEL - UTILISATEURS ====

// Changer le rôle d'un utilisateur
export const setUserRole = (userId: string | number, role: string) =>
  API.post(`/admin-panel/users/${userId}/set-role/`, { role });

// Changer le statut d'un utilisateur (actif/inactif, etc.)
export const setUserStatus = (userId: string | number, status: string) =>
  API.post(`/admin-panel/users/${userId}/set-status/`, { status });



// ANALYTICS
// ========================
export const getAnalyticsOverview = () => API.get("/analytics/overview/");
export const getAnalyticsTimeseries = () => API.get("/analytics/timeseries/");
export const getAnalyticsByStatus = () => API.get("/analytics/by-status/");
export const getAnalyticsActiveUsers = () => API.get("/analytics/active-users/");

// Additional exports for hooks
export const getAdminOverview = getAnalyticsOverview;
export const getMerchantTransactions = () => API.get("/me/transactions/");

export default API;
