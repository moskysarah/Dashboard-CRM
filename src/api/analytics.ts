import axios from "axios";

// Admin Overview
export const getAdminOverview = async () =>
  (await axios.get("/api/v1/admin-panel/overview/")).data;

// Analytics endpoints
export const getActiveUsers = async () =>
  (await axios.get("/api/v1/analytics/active-users/")).data;

export const getByDevise = async () =>
  (await axios.get("/api/v1/analytics/by-devise/")).data;

export const getByOperationType = async () =>
  (await axios.get("/api/v1/analytics/by-operation-type/")).data;

export const getByStatus = async () =>
  (await axios.get("/api/v1/analytics/by-status/")).data;

export const getByType = async () =>
  (await axios.get("/api/v1/analytics/by-type/")).data;

export const getOverview = async () =>
  (await axios.get("/api/v1/analytics/overview/")).data;

export const getTimeseries = async () =>
  (await axios.get("/api/v1/analytics/timeseries/")).data;

export const getTopMerchants = async () =>
  (await axios.get("/api/v1/analytics/top-merchants/")).data;

export const getUsersGrowth = async () =>
  (await axios.get("/api/v1/analytics/users-growth/")).data;
