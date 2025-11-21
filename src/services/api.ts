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

export const otpLoginLegacy = (phone: string, otp: string) =>
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
// ========================
export const getUserSettings = () => API.get("/accounts/user-settings/");
export const setUserRole = (userId: string | number, role: string) =>
  API.post(`/admin-panel/users/${userId}/set-role/`, { role });
export const setUserStatus = (userId: string | number, status: string) =>
  API.post(`/admin-panel/users/${userId}/set-status/`, { status });

// ========================
// API ROUTES FROM src/api FOLDER
// ========================

// AUTHENTICATION
export const otpLogin = (data: any) => API.post("/accounts/otp/login/", data);
export const requestOtp = (data: any) => API.post("/accounts/otp/request/", data);
export const passwordReset = (data: any) => API.post("/accounts/password-reset/", data);
export const passwordResetConfirm = (data: any) => API.post("/accounts/password-reset/confirm/", data);
export const securityQuestion = (data: any) => API.post("/accounts/security-question/", data);
export const securityQuestionConfirm = (data: any) => API.post("/accounts/security-question/confirm/", data);
export const tokenByPhone = (data: any) => API.post("/accounts/token/phone/", data);
export const initiateEmailVerification = (data: any) => API.post("/accounts/initiate-email-verification/", data);
export const initiatePhoneVerification = (data: any) => API.post("/accounts/initiate-phone-verification/", data);
export const verifyEmailOtp = (data: any) => API.post("/accounts/verify-email-otp/", data);
export const verifyPhoneOtp = (data: any) => API.post("/accounts/verify-phone-otp/", data);

// USERS
export const getUsers = () => API.get("/accounts/users/");
export const getUserById = (id: string) => API.get(`/accounts/users/${id}/`);
export const updateUser = (id: string, data: any) => API.put(`/accounts/users/${id}/`, data);
export const patchUser = (id: string, data: any) => API.patch(`/accounts/users/${id}/`, data);
export const deleteUser = (id: string) => API.delete(`/accounts/users/${id}/`);

// AGENTS
export const getAgents = () => API.get("/accounts/agents/");
export const getAgentById = (id: string) => API.get(`/accounts/agents/${id}/`);
export const updateAgent = (id: string, data: any) => API.put(`/accounts/agents/${id}/`, data);
export const patchAgent = (id: string, data: any) => API.patch(`/accounts/agents/${id}/`, data);
export const deleteAgent = (id: string) => API.delete(`/accounts/agents/${id}/`);
export const activateAgent = (id: string) => API.post(`/accounts/agents/${id}/activate/`);
export const getAgentStats = (id: string) => API.get(`/accounts/agents/${id}/stats/`);
export const getMyAgents = () => API.get("/accounts/my-agents/");
export const getMyAgentById = (id: string) => API.get(`/accounts/my-agents/${id}/`);
export const getMyAgentsPerformance = () => API.get("/accounts/my-agents/performance/");



// COMMISSIONS
export const getCommissions = () => API.get("/commissions/");
export const getCommissionById = (id: string) => API.get(`/commissions/${id}/`);
export const updateCommission = (id: string, data: any) => API.put(`/commissions/${id}/`, data);
export const deleteCommission = (id: string) => API.delete(`/commissions/${id}/`);

// MERCHANTS
export const getMerchantsProfiles = () => API.get("/merchants/profiles/");
export const getMerchantProfileById = (id: string) => API.get(`/merchants/profiles/${id}/`);
export const updateMerchant = (id: string, data: any) => API.put(`/merchants/profiles/${id}/`, data);
export const patchMerchantProfile = (id: string, data: any) => API.patch(`/merchants/profiles/${id}/`, data);
export const deleteMerchant = (id: string) => API.delete(`/merchants/profiles/${id}/`);
export const getMerchantTransactions = () => API.get("/merchants/transactions/");
export const getMerchantTransactionById = (uuid: string) => API.get(`/merchants/transactions/${uuid}/`);
export const getMerchantWallets = () => API.get("/merchants/wallets/");
export const getMerchantWalletById = (id: string) => API.get(`/merchants/wallets/${id}/`);
export const regenerateMerchantSecret = (merchant_id: string) => API.post(`/admin-panel/merchants/${merchant_id}/regenerate-secret/`);

// MESSAGES
export const getMessages = () => API.get("/notification/messages/");
export const getMessageById = (id: string) => API.get(`/notification/messages/${id}/`);
export const updateMessage = (id: string, data: any) => API.put(`/notification/messages/${id}/`, data);
export const deleteMessage = (id: string) => API.delete(`/notification/messages/${id}/`);

// TRANSACTIONS
// Alias for backward compatibility
export const getMerchantTransactionsAlias = getMerchantTransactions;
export const getMerchantTransactionByIdAlias = getMerchantTransactionById;

// WALLET & PAYMENTS
export const airtimePayout = (data: any) => API.post("/me/payouts/airtime/", data);
export const initiateMerchantTransfer = (data: any) => API.post("/me/transfers/merchant/initiate/", data);
export const verifyMerchantTransfer = (data: any) => API.post("/me/transfers/merchant/verify/", data);
export const initiatePostePayTransfer = (data: any) => API.post("/me/transfers/poste-pay/initiate/", data);
export const verifyPostePayTransfer = (data: any) => API.post("/me/transfers/poste-pay/verify/", data);
export const rechargeCreditCard = (data: any) => API.post("/me/wallets/recharge/credit-card/", data);
export const rechargeMomo = (data: any) => API.post("/me/wallets/recharge/momo/", data);
export const mobileMoneyPayout = (data: any) => API.post("/me/payouts/mobile-money/", data);
export const mobileMoneyStatus = (data: any) => API.post("/me/payouts/mobile-money/status/", data);
export const rechargeAsyncInit = (data: any) => API.post("/me/wallets/recharge-async/momo/", data);
export const rechargeAsyncComplete = (data: any) => API.post("/me/wallets/recharge-async/complete/momo/", data);
export const getWallets = () => API.get("/me/wallets/");
export const getWalletById = (id: string) => API.get(`/me/wallets/${id}/`);
export const getTransactions = () => API.get("/me/transactions/");
export const getTransactionById = (uuid: string) => API.get(`/me/transactions/${uuid}/`);

// ANALYTICS
export const getAdminOverview = () => API.get("/admin-panel/overview/");
export const getActiveUsers = () => API.get("/analytics/active-users/");
export const getByDevise = () => API.get("/analytics/by-devise/");
export const getByOperationType = () => API.get("/analytics/by-operation-type/");
export const getByStatus = () => API.get("/analytics/by-status/");
export const getByType = () => API.get("/analytics/by-type/");
export const getOverview = () => API.get("/analytics/overview/");
export const getTimeseries = () => API.get("/analytics/timeseries/");
export const getTopMerchants = () => API.get("/analytics/top-merchants/");
export const getUsersGrowth = () => API.get("/analytics/users-growth/");

// A2B CREDIT
export const removeCredit = (data: any) => API.post("/a2b/credit/remove/", data);
export const transferCredit = (data: any) => API.post("/a2b/credit/transfer/", data);

// WEBHOOKS
export const webhookMaxiCash = (data: any) => API.post("/webhooks/payments/maxicash/", data);

// ADMIN PANEL
export const setTransactionStatus = (transactionCode: string, status: string) =>
  API.post(`/admin-panel/transactions/${transactionCode}/set-status/`, { status });

// ADMIN (User)
export const getAdminWallets = () => API.get("/admin/wallets/all/");
export const getAdminWalletById = (id: string) => API.get(`/admin/wallets/all/${id}/`);

// PARTNERS
export const getPartners = () => API.get("/accounts/partners/");
export const getPartnerById = (id: string) => API.get(`/accounts/partners/${id}/`);
export const createPartner = (data: any) => API.post("/accounts/partners/", data);
export const updatePartner = (id: string, data: any) => API.put(`/accounts/partners/${id}/`, data);
export const patchPartner = (id: string, data: any) => API.patch(`/accounts/partners/${id}/`, data);
export const deletePartner = (id: string) => API.delete(`/accounts/partners/${id}/`);
export const getPartnerAgents = (id: string) => API.get(`/accounts/partners/${id}/agents/`);
export const getPartnerPerformance = (id: string) => API.get(`/accounts/partners/${id}/performance/`);
// PUBLIC ENDPOINTS
export const publicMerchantTopup = (data: any) => API.post("/public/merchant-topup/", data);
export const getSchema = () => API.get("/schema/");
export const getToken = (data: any) => API.post("/token/", data);
export const refreshTokenPublic = (data: any) => API.post("/token/refresh/", data);

export default API;
