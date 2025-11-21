import axios from "axios";

const BASE_URL = "/api/v1/accounts/commission";

export const getCommissions = async () => (await axios.get(`${BASE_URL}/`)).data;
export const getCommissionById = async (id: string) => (await axios.get(`${BASE_URL}/${id}/`)).data;
export const createCommission = async (data: any) => (await axios.post(`${BASE_URL}/`, data)).data;
export const updateCommission = async (id: string, data: any) => (await axios.put(`${BASE_URL}/${id}/`, data)).data;
export const patchCommission = async (id: string, data: any) => (await axios.patch(`${BASE_URL}/${id}/`, data)).data;
export const deleteCommission = async (id: string) => (await axios.delete(`${BASE_URL}/${id}/`)).data;
