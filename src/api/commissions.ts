import axiosClient from "./axiosClient";

const BASE_URL = "/accounts/commission";

export const getCommissions = async () => (await axiosClient.get(`${BASE_URL}/`)).data;
export const getCommissionById = async (id: string) => (await axiosClient.get(`${BASE_URL}/${id}/`)).data;
export const createCommission = async (data: any) => (await axiosClient.post(`${BASE_URL}/`, data)).data;
export const updateCommission = async (id: string, data: any) => (await axiosClient.put(`${BASE_URL}/${id}/`, data)).data;
export const patchCommission = async (id: string, data: any) => (await axiosClient.patch(`${BASE_URL}/${id}/`, data)).data;
export const deleteCommission = async (id: string) => (await axiosClient.delete(`${BASE_URL}/${id}/`)).data;
