import axiosClient from "./axiosClient";

const BASE_URL = "/api/v1/notification/messages";

export const getMessages = async () => (await axiosClient.get(`${BASE_URL}/`)).data;
export const getMessageById = async (id: string) => (await axiosClient.get(`${BASE_URL}/${id}/`)).data;
export const createMessage = async (data: any) => (await axiosClient.post(`${BASE_URL}/`, data)).data;
export const updateMessage = async (id: string, data: any) => (await axiosClient.put(`${BASE_URL}/${id}/`, data)).data;
export const deleteMessage = async (id: string) => (await axiosClient.delete(`${BASE_URL}/${id}/`)).data; 
