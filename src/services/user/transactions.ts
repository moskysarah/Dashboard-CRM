import API from "../api";

// Liste des transactions de l'utilisateur connecté
export const getUserTransactions = () => API.get("/me/transactions/");

// Détail d’une transaction spécifique
export const getUserTransactionById = (uuid: string) =>
  API.get(`/me/transactions/${uuid}/`);
