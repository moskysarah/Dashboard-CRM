

export interface FinanceData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface SalesData {
  product: string;
  value: number;
  [key: string]: string | number;
}

export const fetchFinanceData = async (): Promise<FinanceData[]> => {
  try {
    // Mock data for finance
    return [
      { month: "Jan", revenue: 4000, expenses: 2400 },
      { month: "Feb", revenue: 3000, expenses: 1398 },
      { month: "Mar", revenue: 2000, expenses: 9800 },
      { month: "Apr", revenue: 2780, expenses: 3908 },
      { month: "May", revenue: 1890, expenses: 4800 },
      { month: "Jun", revenue: 2390, expenses: 3800 },
    ];
  } catch (error: unknown) {
    console.error("Erreur lors du chargement des données financières :", error);
    return [];
  }
};

export const fetchSalesData = async (): Promise<SalesData[]> => {
  try {
    // Mock data for sales
    return [
      { product: "Produit A", value: 400 },
      { product: "Produit B", value: 300 },
      { product: "Produit C", value: 200 },
      { product: "Produit D", value: 100 },
    ];
  } catch (error: unknown) {
    console.error("Erreur lors du chargement des ventes :", error);
    return [];
  }
};
