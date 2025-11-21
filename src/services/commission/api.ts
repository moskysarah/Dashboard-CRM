import API from "../../api/axiosClient"; // ton instance axios

export const getCommissions = () => API.get("/accounts/commission/");

export const createCommission = (data: any) => API.post("/accounts/commission/", data);

export const getCommissionById = (id: number | string) => API.get(`/accounts/commission/${id}/`);

export const updateCommission = (id: number | string, data: any) => API.put(`/accounts/commission/${id}/`, data);

export const patchCommission = (id: number | string, data: any) => API.patch(`/accounts/commission/${id}/`, data);

export const deleteCommission = (id: number | string) => API.delete(`/accounts/commission/${id}/`);


