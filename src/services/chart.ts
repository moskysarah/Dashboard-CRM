import getAnalytics from "./api"; // ✅ Correction : import par défaut

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
  try {
    const response = await getAnalytics({});
    // Vérifie que les données existent avant de les renvoyer
    return response?.data?.finance || [];
  } catch (error) {
    console.error("Erreur lors du chargement des données financières :", error);
    return [];
  }
};

export const fetchSalesData = async (): Promise<SalesData[]> => {
  try {
    const response = await getAnalytics({});
    // Vérifie que les données existent avant de les renvoyer
    return response?.data?.sales || [];
  } catch (error) {
    console.error("Erreur lors du chargement des ventes :", error);
    return [];
  }
};
