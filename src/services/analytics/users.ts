import API from '../api';

export const getAnalyticsActiveUsers = () => API.get('/analytics/active-users/');
export const getUsersGrowth = () => API.get('/analytics/users-growth/');
