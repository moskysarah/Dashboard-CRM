import API from "../api";

// Liste des wallets de l'utilisateur connecté
export const getUserWallets = () => API.get("/me/wallets/");

// Détails d’un wallet spécifique
export const getUserWalletById = (id: number | string) =>
  API.get(`/me/wallets/${id}/`);
