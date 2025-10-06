import { getAnalytics } from './api';

export interface FinanceData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface SalesData {
  product: string;
  value: number;
}

export const fetchFinanceData = async (): Promise<FinanceData[]> => {
  const response = await getAnalytics();
  // Assuming response.data.finance contains array of FinanceData
  return response.data.finance || [];
};

export const fetchSalesData = async (): Promise<SalesData[]> => {
  const response = await getAnalytics();
  // Assuming response.data.sales contains array of SalesData
  return response.data.sales || [];
};
