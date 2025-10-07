import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import { useAuth } from "../store/auth";

// CONFIGURATION GLOBALE
// ========================
const API = axios.create({
  baseURL: "http://192.162.69.75:8078/api/v1", // toutes les routes
});

//https://001096dn-8000.uks1.devtunnels.ms/api/v1
//

/**
 * Récupère le token d'accès de manière fiable.
 * Tente d'abord de le lire depuis le store Zustand.
 * Si le store n'est pas encore hydraté, il lit directement le localStorage.
 */
let cachedAuthState: { state?: { accessToken?: string } } | null = null;
let cachedAuthStateRaw: string | null = null;

function getAccessToken() {
  const tokenFromStore = useAuth.getState().accessToken;
  if (tokenFromStore) {
    return tokenFromStore;
  }

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

// pour ajouter le token uniquement quand nécessaire
API.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  // Vérification des endpoints publics avec méthode
  const publicEndpoints = [
    { url: "/accounts/otp/request/", method: "POST" },
    { url: "/accounts/token/phone/", method: "POST" },
    { url: "/accounts/users/", method: "POST" },
    { url: "/accounts/password-reset/", method: "POST" },
    { url: "/accounts/otp/login/", method: "POST" },
  ];

  const isPublicEndpoint = publicEndpoints.some(
    (endpoint) =>
      config.url === endpoint.url && config.method?.toUpperCase() === endpoint.method
  );

  if (isPublicEndpoint) {
    return config;
  }

  // Ajout du token si disponible
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur de réponse pour gérer l'expiration du token
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return API(originalRequest);
          })
          .catch(err => Promise.reject(err));
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

          API.defaults.headers.common['Authorization'] = 'Bearer ' + access;
          originalRequest.headers['Authorization'] = 'Bearer ' + access;
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

export const requestOTP = (phone: string, password?: string) =>
  API.post("/accounts/otp/request/", password ? { phone, password } : { phone });

// AUTHENTIFICATION (PHONE + OTP)
// ========================
// L'API ne spécifie qu'un champ 'phone' pour la demande d'OTP.
// export const requestOTP = (phone: string, password?: string) =>
//   API.post("/accounts/otp/request/", { phone });

export const otpLogin = (phone: string, otp: string) =>
  API.post("/accounts/otp/login/", { phone, otp });

export const phoneLogin = (phone: string, password: string) =>
  API.post("/accounts/token/phone/", { phone, password });

// MOT DE PASSE
// ========================
export const resetPassword = (email: string) =>
  API.post("/accounts/password-reset/", { email });

export const confirmResetPassword = (token: string, password: string) =>
  API.post("/accounts/password-reset/confirm/", { token, password });

// ========================
// PROFIL UTILISATEUR
// ========================
// L'API ne définit pas d'endpoint /me/profile/. On utilise l'endpoint pour récupérer un utilisateur par son ID.
export const getProfile = (userId: number) => API.get(`/accounts/users/${userId}/`);

// ========================
// PUBLIC
// ========================
export const getPublicSchema = () => API.get("/schema/");

// ========================
// MERCHANT
// ========================
export const getMerchants = () => API.get("/merchants/profiles/");
export const getMerchantById = (id: string) => API.get(`/merchants/profiles/${id}/`);
export const topupMerchant = (merchantId: string, amount: number) =>
  API.post("/public/merchant-topup/", { merchantId, amount }); // Note: Le body n'est pas défini dans l'API, mais la route existe.
export const regenerateMerchantSecret = (merchantId: string) =>
  API.post(`/admin-panel/merchants/${merchantId}/regenerate-secret/`);

// ========================
// ADMIN PANEL
// ========================
export const getAdminTransactions = () => API.get("/merchants/transactions/"); // L'API définit les transactions marchandes, pas un endpoint admin dédié.
// La création de transaction via /admin-panel/ n'est pas définie dans l'API.

export const getAdminUsers = () => API.get("/accounts/users/"); // L'admin a accès à tous les utilisateurs
export const getAdminUserById = (id: string) =>
  API.get(`/accounts/users/${id}/`);
export const updateAdminUser = (id: string, data: any) =>
  API.put(`/accounts/users/${id}/`, data);
export const patchAdminUser = (id: string, data: any) =>
  API.patch(`/accounts/users/${id}/`, data);
export const deleteAdminUser = (id: string) =>
  API.delete(`/accounts/users/${id}/`);

export const getAdminMerchants = () => API.get("/merchants/profiles/");

// ========================
// ACCOUNTS / USERS
// ========================
export const getAccountsUsers = () => API.get("/accounts/users/");
export const createAccountUser = (data: any) => API.post("/accounts/users/", data);
export const getAccountUserById = (id: string) => API.get(`/accounts/users/${id}/`);
export const updateAccountUser = (id: string, data: any) =>
  API.put(`/accounts/users/${id}/`, data);
export const patchAccountUser = (id: string, data: any) =>
  API.patch(`/accounts/users/${id}/`, data);
export const deleteAccountUser = (id: string) =>
  API.delete(`/accounts/users/${id}/`);

// ========================
// ACCOUNTS / USERS SETTINGS
// ========================
export const getAccountsUsersSettings = () => API.get("/accounts/user-settings/");
export const getAccountUserSettingById = (id: string) =>
  API.get(`/accounts/user-settings/${id}/`);

// ========================
// ACCOUNTS / VERIFICATION
// ========================
export const initiateMailVerification = (email: string) =>
  API.post("/accounts/initiate-email-verification/", { email });

export const initiatePhoneVerification = (phone: string) =>
  API.post("/accounts/initiate-phone-verification/", { phone });

export const verifyPhoneOTP = (phone: string, otp: string) =>
  API.post("/accounts/verify-phone-otp/", { phone, otp });

export const verifyMailOTP = (email: string, otp: string) =>
  API.post("/accounts/verify-email-otp/", { email, otp });

// ========================
// SMART (OTP/SECURITY)
// ========================
// Les endpoints /smart/* n'existent pas dans l'API.
// Utilisez les endpoints /accounts/initiate-phone-verification/ et /accounts/verify-phone-otp/
export const sendSmartOTP = initiatePhoneVerification;
export const verifySmartOTP = verifyPhoneOTP;

// ========================
// TRANSACTIONS
// ========================
export const getTransactions = () => API.get("/me/transactions/");
export const createTransaction = (data: any) =>
  API.post("/me/transactions/", data);

// ========================
// A2B CREDIT
// ========================
export const removeCredit = (from_subscriber_number: string, credit: string) =>
  API.post("/a2b/credit/remove/", { from_subscriber_number, credit });
export const transferCredit = (to_subscriber_number: string, credit: string) =>
  API.post("/a2b/credit/transfer/", { to_subscriber_number, credit });

// ========================
// NOTIFICATIONS
// ========================
export const getNotifications = () => API.get("/notification/messages/");
export const markNotificationRead = (id: string) =>
  API.patch(`/notification/messages/${id}/`, { is_read: true }); // L'API ne définit pas de PATCH, mais c'est une supposition logique.

// ========================
// MESSAGES
// ========================
export const getMessages = () => API.get("/notification/messages/");
export const sendMessage = (data: { message: string; user?: number }) =>
  API.post("/notification/messages/", data); // L'API ne définit pas de POST ici. C'est une supposition.

// ========================
// IT TICKETS
// ========================
// L'endpoint /it/tickets/ n'est pas défini dans la spécification OpenAPI.

export default API;
