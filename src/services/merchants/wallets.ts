import API from '../api';

// Wallets
export const getAllWallets = () => API.get('/merchants/wallets/');
export const getWalletById = (id: string | number) => API.get(`/merchants/wallets/${id}/`);
