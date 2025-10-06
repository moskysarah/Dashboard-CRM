// Rôles possibles pour les utilisateurs du Back-Office
export type Role = 'administrateur' | 'marchand' | 'distributeur';

// structure d'un utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: 'active' | 'suspended';
}

// statut d'une transaction
export type TxStatus = 'pending' | 'success' | 'failed';

// structure d'une transaction
export interface Transaction {
  id: string;
  amount: number;
  currency: 'USD' | 'CDF' | 'EUR';
  status: TxStatus;
  createdAt: string; // date ISO
  merchantId?: string;
  distributorId?: string;
}

// structure d'un ticket IT
export interface Ticket {
  id: string;
  title: string;
  type: string;
  status: "Ouvert" | "En cours" | "Résolu";
  priority: "Haute" | "Moyenne" | "Basse";
}
