import API from "../api";

export const getMyAgents = () => API.get("/accounts/my-agents/");

export const getMyAgentById = (id: number | string) => API.get(`/accounts/my-agents/${id}/`);

export const getMyAgentsPerformance = () => API.get("/accounts/my-agents/performance/");

export const createAgent = (data: any) => API.post("/accounts/my-agents/", data);
