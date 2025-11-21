import axiosClient from "./axiosClient";

const BASE_URL = "/merchants";

export const getMerchantsProfiles = async () => (await axiosClient.get(`${BASE_URL}/profiles/`)).data;
export const getMerchantProfileById = async (id: string) => (await axiosClient.get(`${BASE_URL}/profiles/${id}/`)).data;
export const createMerchant = async (data: any) => (await axiosClient.post(`${BASE_URL}/profiles/`, data)).data;
export const updateMerchant = async (id: string, data: any) => (await axiosClient.put(`${BASE_URL}/profiles/${id}/`, data)).data;
export const patchMerchantProfile = async (id: string, data: any) => (await axiosClient.patch(`${BASE_URL}/profiles/${id}/`, data)).data;
export const deleteMerchant = async (id: string) => (await axiosClient.delete(`${BASE_URL}/profiles/${id}/`)).data;
export const getMerchantTransactions = async () => (await axiosClient.get(`${BASE_URL}/transactions/`)).data;
export const getMerchantTransactionById = async (uuid: string) => (await axiosClient.get(`${BASE_URL}/transactions/${uuid}/`)).data;
export const getMerchantWallets = async () => (await axiosClient.get(`${BASE_URL}/wallets/`)).data;
export const getMerchantWalletById = async (id: string) => (await axiosClient.get(`${BASE_URL}/wallets/${id}/`)).data;
export const publicMerchantTopup = async (data: any) => (await axiosClient.post(`/public/merchant-topup/`, data)).data;
export const regenerateMerchantSecret = async (merchant_id: string) => (await axiosClient.post(`/admin-panel/merchants/${merchant_id}/regenerate-secret/`)).data;
