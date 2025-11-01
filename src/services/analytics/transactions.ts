import API from '../api';

export const getTransactionsByDevise = () => API.get('/analytics/by-devise/');
export const getTransactionsByOperationType = () => API.get('/analytics/by-operation-type/');
export const getAnalyticsByStatus = () => API.get('/analytics/by-status/');
export const getTransactionsByType = () => API.get('/analytics/by-type/');
export const getAnalyticsTimeseries = () => API.get('/analytics/timeseries/');
