import axios from "axios";

const BASE_URL = "/api/v1/a2b/credit";

export const removeCredit = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/remove/`, data);
  return res.data;
};

export const transferCredit = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/transfer/`, data);
  return res.data;
};
