import API from '../api';

// Transactions
export const getAllTransactions = () => API.get('/merchants/transactions/');
export const getTransactionById = (uuid: string) => API.get(`/merchants/transactions/${uuid}/`);
