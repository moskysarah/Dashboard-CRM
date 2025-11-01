import API from '../api';

// Profils
export const getAllProfiles = () => API.get('/merchants/profiles/');
export const createProfile = (data: any) => API.post('/merchants/profiles/', data);
export const getProfileById = (id: number) => API.get(`/merchants/profiles/${id}/`);
export const updateProfile = (id: number, data: any) => API.put(`/merchants/profiles/${id}/`, data);
export const patchProfile = (id: number, data: any) => API.patch(`/merchants/profiles/${id}/`, data);
export const deleteProfile = (id: number) => API.delete(`/merchants/profiles/${id}/`);
