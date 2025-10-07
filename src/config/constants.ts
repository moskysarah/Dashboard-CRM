/**
 * Centralise les clés utilisées pour le localStorage afin d'éviter les fautes de frappe
 * et de faciliter la maintenance.
 */
export const LOCAL_STORAGE_KEYS = {
  // Clé pour le store d'authentification persistant (Zustand)
  AUTH_STATE: 'crm-auth',

  // Clés pour le processus de connexion en 2 étapes (OTP)
  USER_PHONE: 'userPhone',
  MASKED_PHONE: 'maskedPhone',
  OTP_CODE: 'otpCode',

  // Clés pour la session authentifiée (utilisées par l'intercepteur Axios)
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};