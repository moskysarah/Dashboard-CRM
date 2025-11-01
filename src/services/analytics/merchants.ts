import API from '../api';

export const getTopMerchants = () => API.get('/analytics/top-merchants/');
export const getMerchantsGrowth = () => API.get('/analytics/merchants-growth/');