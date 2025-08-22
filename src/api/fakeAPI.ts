
// les Types
export type Notification = {
  id: number;
  message: string;
  read: boolean;
  date: string;
};

export type Message = {
  id: number;
  sender: string;
  content: string;
  date: string;
};

// les Notifications factices
export const notifications: Notification[] = [
  { id: 1, message: "Nouvelle réservation reçue", read: false, date: "2025-08-17 09:30" },
  { id: 2, message: "Paiement confirmé pour Aïdiv", read: true, date: "2025-08-17 10:15" },
  { id: 3, message: "Mise à jour profil utilisateur", read: false, date: "2025-08-17 11:00" },
];

// les Messages factices
export const messages: Message[] = [
  { id: 1, sender: "Admin", content: "Bonjour, le rapport hebdomadaire est prêt.", date: "2025-08-17 09:45" },
  { id: 2, sender: "Marchand B", content: "Demande de remboursement pour Produit C.", date: "2025-08-17 10:30" },
  { id: 3, sender: "Distributeur A", content: "Stock mis à jour.", date: "2025-08-17 11:15" },
];

// les Données pour le graphique financier (BarChart)
export const financeChartData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
  { month: "Jul", revenue: 3490, expenses: 4300 },
];

// les Données pour le graphique des ventes avec (Piehart)
export const salesChartData = [
  { product: "Produit A", value: 400 },
  { product: "Produit B", value: 300 },
  { product: "Produit C", value: 300 },
  { product: "Produit D", value: 200 },
];
// les  Distributeurs factices
export const distributors = [
  { id: 1, name: "Distributeur A", commission: 10, sales: 500, stock: 120 },
  { id: 2, name: "Distributeur B", commission: 8, sales: 300, stock: 80 },
  { id: 3, name: "Distributeur C", commission: 12, sales: 450, stock: 150 },
  { id: 4, name: "Distributeur D", commission: 9, sales: 200, stock: 60 },
];
// les Transactions factices
export const transactions = [
  { id: 1, product: "Ordinateur", amount: 1200, status: "Réussi", date: "2025-08-10" },
  { id: 2, product: "Smartphone", amount: 800, status: "En attente", date: "2025-08-11" },
  { id: 3, product: "Casque Audio", amount: 150, status: "Échoué", date: "2025-08-12" },
  { id: 4, product: "Clavier", amount: 100, status: "Réussi", date: "2025-08-13" },
  { id: 5, product: "Chaise de bureau", amount: 300, status: "Réussi", date: "2025-08-14" },
];

