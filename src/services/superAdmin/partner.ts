import API from "../api";

export const getPartners = () => API.get("/accounts/partners/");
export const getPartnerById = (id: number) => API.get(`/accounts/partners/${id}/`);
export const createPartner = (data: any) => API.post("/accounts/partners/", data);
export const updatePartner = (id: number, data: any) => API.put(`/accounts/partners/${id}/`, data);
export const deletePartner = (id: number | string) => API.delete(`/accounts/partners/${id}/`);
export const getPartnerPerformance = (id: number | string) => API.get(`/accounts/partners/${id}/performance/`);
export const getPartnerAgents = (id: number | string) => API.get(`/accounts/partners/${id}/agents/`);
