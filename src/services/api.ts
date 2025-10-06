import axios from "axios";

// CONFIGURATION GLOBALE
// ========================
const API = axios.create({
  baseURL: "http://192.162.69.75:8078/api/v1", // toutes les routes  
});

//https://001096dn-8000.uks1.devtunnels.ms/api/v1
//

// pour ajouter le token uniquement quand nécessaire
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  const tempToken = localStorage.getItem("tempAccessToken");

  // Routes publiques ou OTP initial request → pas de token
  const publicEndpoints = [
    "/accounts/otp/request/",
    "/accounts/token-phone/",
    "/accounts/",
    "/accounts/password/reset/",
  ];

  if (publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
    return config;
  }

  // Routes OTP login → utiliser le token temporaire

  if (tempToken && config.url?.includes("/accounts/otp/login/")) {
    config.headers.Authorization = `Bearer ${tempToken}`;
    return config;
  }

  // utiliser le token normal
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ========================
// REFRESH TOKEN
// ========================
export const refreshToken = (refresh: string) =>
  API.post("/accounts/token/refresh/", { refresh });

// AUTHENTIFICATION (PHONE + OTP)
// ========================
export const requestOTP = (phone: string, password?: string) =>
  API.post("/accounts/otp/request/", password ? { phone, password } : { phone });

export const otpLogin = (phone: string, otp: string) =>
  API.post("/accounts/otp/login/", { phone, otp });

export const phoneLogin = (phone: string, password: string) =>
  API.post("/accounts/token-phone/", { phone, password });

// MOT DE PASSE
// ========================
export const resetPassword = (email: string) =>
  API.post("/accounts/password/reset/", { email });

export const confirmResetPassword = (token: string, password: string) =>
  API.post("/accounts/password/reset/confirm/", { token, password });

// ========================
// PROFIL UTILISATEUR
// ========================
export const getProfile = () => API.get("/accounts/profile/");

// ========================
// PUBLIC
// ========================
export const getPublicSchema = () => API.get("/accounts/public/schema/");

// ========================
// MERCHANT
// ========================
export const getMerchants = () => API.get("/accounts/merchants/");
export const getMerchantById = (id: string) => API.get(`/merchants/${id}/`);
export const topupMerchant = (merchantId: string, amount: number) =>
  API.post("/accounts/merchants/topup/", { merchantId, amount });
export const regenerateMerchantSecret = (merchantId: string) =>
  API.post(`/accounts/admin-panel/merchants/${merchantId}/regenerate-secret/`);

// ========================
// ADMIN PANEL
// ========================
export const getAdminTransactions = () => API.get("/admin-panel/transactions/");
export const createAdminTransaction = (data: any) =>
  API.post("/accounts/admin-panel/transactions/", data);

export const getAdminUsers = () => API.get("/admin-panel/users/");
export const getAdminUserById = (id: string) =>
  API.get(`/accounts/admin-panel/users/${id}/`);
export const updateAdminUser = (id: string, data: any) =>
  API.put(`/accounts/admin-panel/users/${id}/`, data);
export const patchAdminUser = (id: string, data: any) =>
  API.patch(`/accounts/admin-panel/users/${id}/`, data);
export const deleteAdminUser = (id: string) =>
  API.delete(`/accounts/admin-panel/users/${id}/`);

export const getAdminMerchants = () => API.get("/accounts/admin-panel/merchants/");

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
export const getAccountsUsersSettings = () => API.get("/accounts/users-settings/");
export const getAccountUserSettingById = (id: string) =>
  API.get(`/accounts/users-settings/${id}/`);

// ========================
// ACCOUNTS / VERIFICATION
// ========================
export const initiateMailVerification = (email: string) =>
  API.post("/accounts/initiate-mail-verification/", { email });

export const initiatePhoneVerification = (phone: string) =>
  API.post("/accounts/initiate-phone-verification/", { phone });

export const verifyPhoneOTP = (phone: string, otp: string) =>
  API.post("/accounts/verify-phone-otp/", { phone, otp });

export const verifyMailOTP = (email: string, otp: string) =>
  API.post("/accounts/verify-email-otp/", { email, otp });

// ========================
// SMART (OTP/SECURITY)
// ========================
export const sendSmartOTP = (phone: string) =>
  API.post("/accounts/smart/send-otp/", { phone });
export const verifySmartOTP = (phone: string, otp: string) =>
  API.post("/accounts/smart/verify-otp/", { phone, otp });

// ========================
// TRANSACTIONS
// ========================
export const getTransactions = () => API.get("/transactions/");
export const createTransaction = (data: any) =>
  API.post("/me/transactions/", data);

// ========================
// A2B CREDIT
// ========================
export const removeCredit = (id: string, amount: number) =>
  API.post("/accounts/credit/remove/", { id, amount });
export const transferCredit = (from: string, to: string, amount: number) =>
  API.post("/accounts/credit/transfer/", { from, to, amount });

// ========================
// NOTIFICATIONS
// ========================
export const getNotifications = () => API.get("/notifications/");
export const markNotificationRead = (id: string) =>
  API.post(`/accounts/notifications/${id}/read/`);

// ========================
// MESSAGES
// ========================
export const getMessages = () => API.get("/messages/");
export const sendMessage = (data: { text: string; sender: string }) =>
  API.post("/accounts/messages/send/", data);

// ========================
// IT TICKETS
// ========================
export const fetchTicketsIT = () => API.get("/accounts/tickets/it/").then(res => res.data);

export default API;

