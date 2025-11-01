import API from "../api";

// Récupère les statistiques globales des agents
export const getAgentStats = () => API.get("/accounts/agent-stats/");

// Récupère tous les agents
export const getAllAgents = () => API.get("/accounts/my-agents/");

// Met à jour le rôle d’un agent
export const updateAgentRole = (id: number, role: string) => API.patch(`/accounts/my-agents/${id}/`, { role });

// Active ou suspend un agent
export const toggleAgentStatus = (id: number, isActive: boolean) => API.patch(`/accounts/my-agents/${id}/`, { is_active: isActive });

// Supprime un agent
export const deleteAgent = (id: number) => API.delete(`/accounts/my-agents/${id}/`);
