import axios from "axios";

const BASE_URL = "/api/v1/accounts";

export const getAgents = async () => (await axios.get(`${BASE_URL}/agents/`)).data;
export const getAgentById = async (id: string) => (await axios.get(`${BASE_URL}/agents/${id}/`)).data;
export const createAgent = async (data: any) => (await axios.post(`${BASE_URL}/agents/`, data)).data;
export const updateAgent = async (id: string, data: any) => (await axios.put(`${BASE_URL}/agents/${id}/`, data)).data;
export const patchAgent = async (id: string, data: any) => (await axios.patch(`${BASE_URL}/agents/${id}/`, data)).data;
export const deleteAgent = async (id: string) => (await axios.delete(`${BASE_URL}/agents/${id}/`)).data;
export const activateAgent = async (id: string) => (await axios.post(`${BASE_URL}/agents/${id}/activate/`)).data;
export const getAgentStats = async (id: string) => (await axios.get(`${BASE_URL}/agents/${id}/stats/`)).data;
export const getMyAgents = async () => (await axios.get(`${BASE_URL}/my-agents/`)).data;
export const getMyAgentById = async (id: string) => (await axios.get(`${BASE_URL}/my-agents/${id}/`)).data;
export const getMyAgentsPerformance = async () => (await axios.get(`${BASE_URL}/my-agents/performance/`)).data;
export const getAgentWallet = async (id: string) => (await axios.get(`${BASE_URL}/agents/${id}/wallet/`)).data;
export const getAgentTransactions = async (id: string) => (await axios.get(`${BASE_URL}/agents/${id}/transactions/`)).data;
