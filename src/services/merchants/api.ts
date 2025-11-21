import API from "../api";

// Transactions
export const getMerchantTransactions = () => API.get('/merchants/transactions/');
export const getProfileMerchants = (id: number) => API.get(`/merchants/profiles/${id}/`);
export const getMerchantWallets = (id: number) => API.get(`/merchants/wallets/${id}/`);
