import { LOCAL_STORAGE_KEYS } from "../config/constants";

/**
 * Nettoie les clés du localStorage utilisées pendant le processus d'authentification
 * (OTP, numéro de téléphone, etc.) qui ne sont plus nécessaires une fois que
 * l'utilisateur est connecté ou déconnecté.
 */
export const cleanupAuthLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PHONE);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.MASKED_PHONE);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_CODE);
};