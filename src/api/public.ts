import axios from "axios";

export const publicMerchantTopup = async (data: any) =>
  (await axios.post("/api/v1/public/merchant-topup/", data)).data;

export const getSchema = async () =>
  (await axios.get("/api/v1/schema/")).data;

export const getToken = async (data: any) =>
  (await axios.post("/api/v1/token/", data)).data;

export const refreshToken = async (data: any) =>
  (await axios.post("/api/v1/token/refresh/", data)).data;
