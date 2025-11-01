import API from '../api';

export const getAdminOverview = () => API.get('/admin-panel/overview/');
export const getAnalyticsOverview = () => API.get('/analytics/overview/');
