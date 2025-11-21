import axios from "axios";

export const airtimePayout = async (data: any) => (await axios.post("/api/v1/me/payouts/airtime/", data)).data;
export const initiateMerchantTransfer = async (data: any) => (await axios.post("/api/v1/me/transfers/merchant/initiate/", data)).data;
export const verifyMerchantTransfer = async (data: any) => (await axios.post("/api/v1/me/transfers/merchant/verify/", data)).data;
export const initiatePostePayTransfer = async (data: any) => (await axios.post("/api/v1/me/transfers/poste-pay/initiate/", data)).data;
export const verifyPostePayTransfer = async (data: any) => (await axios.post("/api/v1/me/transfers/poste-pay/verify/", data)).data;
export const rechargeCreditCard = async (data: any) => (await axios.post("/api/v1/me/wallets/recharge/credit-card/", data)).data;
export const rechargeMomo = async (data: any) => (await axios.post("/api/v1/me/wallets/recharge/momo/", data)).data;
export const mobileMoneyPayout = async (data: any) => (await axios.post("/api/v1/me/payouts/mobile-money/", data)).data;
export const mobileMoneyStatus = async (data: any) => (await axios.post("/api/v1/me/payouts/mobile-money/status/", data)).data;
export const rechargeAsyncInit = async (data: any) => (await axios.post("/api/v1/me/wallets/recharge-async/momo/", data)).data;
export const rechargeAsyncComplete = async (data: any) => (await axios.post("/api/v1/me/wallets/recharge-async/complete/momo/", data)).data;
export const getWallets = async () => (await axios.get("/api/v1/me/wallets/")).data;
export const getWalletById = async (id: string) => (await axios.get(`/api/v1/me/wallets/${id}/`)).data;
export const getTransactions = async () => (await axios.get("/api/v1/me/transactions/")).data;
export const getTransactionById = async (uuid: string) => (await axios.get(`/api/v1/me/transactions/${uuid}/`)).data;
