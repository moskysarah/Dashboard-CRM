import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import { useAuth } from "../store/auth";
import { getUserWallets, getUserTransactions } from "./user";

// ========================
// CONFIGURATION GLOBALE
// ========================
const API = axios.create({
  baseURL: "https://yozma-postepay.mapango.immo/api/v1",
  timeout: 10000, // 10 seconds timeout
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

    // Routes publiques : pas besoin de token
    const publicEndpoints = [
      { url: "/accounts/otp/request/", method: "POST" },
      { url: "/accounts/token/phone/", method: "POST" },
      { url: "/accounts/users/", method: "POST" },
      { url: "/accounts/password-reset/", method: "POST" },
      { url: "/accounts/otp/login/", method: "POST" },
      { url: "/notification/messages/", method: "GET" },
    ];

    const isPublicEndpoint = publicEndpoints.some(
      (endpoint) =>
        normalizedUrl === endpoint.url &&
        config.method?.toUpperCase() === endpoint.method
    );

    if (!isPublicEndpoint && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      config.headers.Authorization = undefined; // PAS DE TOKEN pour public
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

    // Retry logic for timeout errors
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      return API(originalRequest);
    }

    // Handle 403 Forbidden by logging out the user
    if (error.response?.status === 403) {
      const { logout } = useAuth.getState();
      logout();
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
// AUTHENTIFICATION
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

// ========================
// PROFIL UTILISATEUR
// ========================
export const getUserProfile = () => {
  const userId = useAuth.getState().user?.id;
  if (!userId) throw new Error("User not authenticated");
  return API.get(`/accounts/users/${userId}/`);
};
// Alias for backward compatibility
export const getAgentWallets = getUserWallets;
export const getAgentTransactions = getUserTransactions;
export const deleteUserAccount = (id: string) => API.delete(`/accounts/users/${id}/`);

// ========================
// GESTION UTILISATEURS
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

// ========================
// NOTIFICATIONS
// ========================
export const getNotifications = () => axios.get(`${API.defaults.baseURL}/notification/messages/`); // PAS DE CREDENTIALS
export const markNotificationRead = (id: string) =>
  API.patch(`/notification/messages/${id}/`, { is_read: true });

// ========================
// MARCHANT & ANALYTICS
// // ========================

// export const getMerchantWallets = (id: string | number) => API.get(`/merchants/wallets/${id}/`);
// export const deleteProfileMerchants = (id: string | number) => API.delete(`/merchants/profiles/${id}/`);
// export const getProfileMerchants = (id: number) => API.get(`/merchants/profiles/${id}/`);
// export const getProfileMerchant = (id: string | number) => API.get(`/accounts/users/${id}/`);
// export const getUserSettings = () => API.get("/accounts/user-settings/");
export const setUserRole = (userId: string | number, role: string) =>
  API.post(`/admin-panel/users/${userId}/set-role/`, { role });
export const setUserStatus = (userId: string | number, status: string) =>
  API.post(`/admin-panel/users/${userId}/set-status/`, { status });

// // ========================
// // ANALYTICS
// // ========================
// export const getAnalyticsOverview = () => API.get("/analytics/overview/");
// export const getAnalyticsTimeseries = () => API.get("/analytics/timeseries/");
// export const getAnalyticsByStatus = () => API.get("/analytics/by-status/");
// export const getAnalyticsActiveUsers = () => API.get("/analytics/active-users/");

// // Export supplémentaires
// export const getAdminOverview = getAnalyticsOverview;
// export const getMerchantTransactions = () => API.get("/me/transactions/");
// export const getMerchants = () => API.get("/merchants/");
// export const fetchTicketsIT = (params?: any) => API.get("/accounts/users-settings/{id}/", { params });


// // // --------------DISTRIBUTION ROUTES -----------------------
// // //-------------------------------------------------------


// export const getPartnerList = () => API.get('/accounts/partners/')
// export const createPartner = (payload: any) => API.post('/accounts/partners/', payload)
// export const getPartnerById = (id: number) => API.get(`/accounts/partners/${id}/`)
// export const updatePartner = (id: number, payload: any) => API.put(`/accounts/partners/${id}/`, payload)
// export const patchPartner = (id: number, payload: any) => API.patch(`/accounts/partners/${id}/`, payload)
// export const deletePartner = (id: number) => API.delete(`/accounts/partners/${id}/`)
// export const getPartnerAgents = (id: number) => API.get(`/accounts/partners/${id}/agents/`)
// export const getPartnerPerformance = (id: number) => API.get(`/accounts/partners/${id}/performance/`)


// // export default {
// // getPartnerList,
// // createPartner,
// // getPartnerById,
// // updatePartner,
// // patchPartner,
// // deletePartner,
// // getPartnerAgents,
// // getPartnerPerformance,
// // }



export default API;
