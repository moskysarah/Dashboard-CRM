import axiosClient from "./axiosClient";

// Récupérer toutes les transactions du merchant connecté
export const getMerchantTransactions = () => axiosClient.get("/merchants/transactions/");

// Récupérer une transaction spécifique par UUID
export const getMerchantTransactionById = (uuid: string) => axiosClient.get(`/merchants/transactions/${uuid}/`);
