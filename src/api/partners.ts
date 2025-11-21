import axios from "axios";

const BASE_URL = "/api/v1/accounts/partners";

export const getPartners = async () => (await axios.get(`${BASE_URL}/`)).data;
export const getPartnerById = async (id: string) => (await axios.get(`${BASE_URL}/${id}/`)).data;
export const createPartner = async (data: any) => (await axios.post(`${BASE_URL}/`, data)).data;
export const updatePartner = async (id: string, data: any) => (await axios.put(`${BASE_URL}/${id}/`, data)).data;
export const patchPartner = async (id: string, data: any) => (await axios.patch(`${BASE_URL}/${id}/`, data)).data;
export const deletePartner = async (id: string) => (await axios.delete(`${BASE_URL}/${id}/`)).data;
export const getPartnerAgents = async (id: string) => (await axios.get(`${BASE_URL}/${id}/agents/`)).data;
export const getPartnerPerformance = async (id: string) => (await axios.get(`${BASE_URL}/${id}/performance/`)).data;
