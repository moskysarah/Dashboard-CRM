// src/api/webhooks.ts
import axiosClient from "./axiosClient";

export const webhookMaxiCash = (data: any) => axiosClient.post("/webhooks/payments/maxicash/", data);
