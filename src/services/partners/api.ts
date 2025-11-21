import API from "../api";

export const getPartners = () => API.get("/accounts/partners/");
export const getPartnerById = (id: string) => API.get(`/accounts/partners/${id}/`);
export const createPartner = (data: any) => API.post("/accounts/partners/", data);
export const updatePartner = (id: string, data: any) => API.put(`/accounts/partners/${id}/`, data);
export const patchPartner = (id: string, data: any) => API.patch(`/accounts/partners/${id}/`, data);
export const deletePartner = (id: string) => API.delete(`/accounts/partners/${id}/`);
export const getPartnerAgents = (id: string) => API.get(`/accounts/partners/${id}/agents/`);
export const getPartnerPerformance = (id: string) => API.get(`/accounts/partners/${id}/performance/`);
