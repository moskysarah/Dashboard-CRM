import axios from "axios";

const BASE_URL = "/api/v1/accounts/my-agents";

export const getMyAgents = async () =>
  (await axios.get(`${BASE_URL}/`)).data;

export const getMyAgentById = async (id: string) =>
  (await axios.get(`${BASE_URL}/${id}/`)).data;

export const getMyAgentsPerformance = async () =>
  (await axios.get(`${BASE_URL}/performance/`)).data;
