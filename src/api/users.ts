import axios from "axios";

const BASE_URL = "/api/v1/accounts/users";

export const getUsers = async () => (await axios.get(`${BASE_URL}/`)).data;
export const getUserById = async (id: string) => (await axios.get(`${BASE_URL}/${id}/`)).data;
export const createUser = async (data: any) => (await axios.post(`${BASE_URL}/`, data)).data;
export const updateUser = async (id: string, data: any) => (await axios.put(`${BASE_URL}/${id}/`, data)).data;
export const patchUser = async (id: string, data: any) => (await axios.patch(`${BASE_URL}/${id}/`, data)).data;
export const deleteUser = async (id: string) => (await axios.delete(`${BASE_URL}/${id}/`)).data;
