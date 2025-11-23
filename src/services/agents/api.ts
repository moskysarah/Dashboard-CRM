import API from "../api";
import type { CreateAgentData, UpdateAgentData } from "../../types/Agent";

export const getMyAgents = () => API.get("/accounts/my-agents/");

export const getMyAgentById = (id: number | string) => API.get(`/accounts/my-agents/${id}/`);

export const getMyAgentsPerformance = () => API.get("/accounts/my-agents/performance/");

export const createAgent = (data: CreateAgentData) => API.post("/accounts/my-agents/", data);

export const updateAgent = (id: number | string, data: UpdateAgentData) =>
  API.put(`/accounts/my-agents/${id}/`, data);
