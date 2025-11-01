// ===================================================================
// TYPES ALIGNED WITH "POSTEPAY API(1).yaml"
// ===================================================================

// ===================================================================
// ROLES — unified
// ===================================================================

export type UserRole = "superadmin" | "admin" | "agent" | "partner" | "user";

// Pour éviter la redondance inutile, on supprime AgentRole
// Si tu veux garder une distinction, tu peux le redéfinir à part
export type AgentRole = UserRole;

// ===================================================================
// TRANSACTIONS & MESSAGES TYPES
// ===================================================================

export type TransactionStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "ON"
  | "OFF"
  | "REFUNDED";

export type TransactionType = "IN" | "OUT";

export type TransactionOperationType =
  | "MOMO"
  | "BANKCARD"
  | "VOUCHER"
  | "TRANSFERT"
  | "DEPOT"
  | "CREDIT_PURCHASE"
  | "TELCO";

export type MessageType = "auth" | "val_trans" | "reset_pwd" | "other";

// ===================================================================
// MAIN DATA STRUCTURES
// ===================================================================

export type User = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  role?: UserRole;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  profile_image?: string | null;
  date_joined?: string;
  last_login?: string | null;
  merchant?: string | null;
  // Ajout optionnel pour afficher les initiales/avatar
  avatar?: string;
  zone?: string;
  wallet_balance?: number;
  total_transactions?: number;
};

export type Agent = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  role: AgentRole;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  profile_image?: string | null;
  date_joined?: string;
  last_login?: string | null;
  merchant?: string | null;
  avatar?: string;
  zone?: string;
  wallet_balance?: number;
  total_transactions?: number;
};



export interface Client {
id: string
nom: string
telephone?: string
statut?: string
}

export type Transaction = {
  id: number;
  codeTransaction?: string | null;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  typeOperation: TransactionOperationType;
  createdAt: string;
  updatedAt: string;
  devise: number;
  user?: number | null;
  merchant?: string | null;
  commission?: string;
  fees?: string;
  reference?: string | null;
  phone?: string | null;
};

export type Message = {
  id: number;
  is_sent: boolean;
  phone: string;
  type: MessageType;
  message: string;
  created_at: string;
  updated_at: string;
};

// ===================================================================
// TICKET SYSTEM TYPES
// ===================================================================

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type TicketPriority = "HIGH" | "MEDIUM" | "LOW";

export type Ticket = {
  id: number;
  title: string; // pas besoin de ReactNode, plus simple pour API
  type: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at?: string;
};

// ===================================================================
// DISTRIBUTOR / PARTNER MANAGEMENT TYPES
// ===================================================================

// export type Product = {
//   id: string;
//   name: string;
//   price: number;
//   description?: string;
// };

// export type Commission = {
//   id: string;
//   distributorId: string;
//   productId: string;
//   type: "percentage" | "fixed";
//   value: number;
//   isActive: boolean;
//   minSales?: number;
//   maxSales?: number;
//   createdAt: Date;
//   updatedAt: Date;
// };

// export type Sale = {
//   id: string;
//   distributorId: string;
//   productId: string;
//   quantity: number;
//   totalAmount: number;
//   status: string;
//   commissionAmount: number;
//   saleDate: Date;
// };

// export type Stock = {
//   id: string;
//   distributorId: string;
//   productId: string;
//   currentLevel: number;
//   reservedQuantity: number;
//   minLevel: number;
//   availableQuantity: number;
//   lastUpdated: Date;
// };

// export type Distributor = {
//   id: string;
//   name: string;
//   totalSales: number;
//   totalCommissions: number;
// };

// export type Wallet = {
//   balance: number;
//   updatedAt: string;
// };


export interface Commission {
  partner_name: string;
  id: number;                // identifiant unique
  partner_id: number;        // l'ID du partenaire associé
  agent_id?: number;         // optionnel si c’est lié à un agent
  percentage: number;        // pourcentage de commission, ex: 10 pour 10%
  amount?: number;           // montant fixe si applicable
  status: "active" | "inactive" | "pending" | "validated" | "cancelled";  // statut de la commission
  created_at: string;        // date de création ISO 8601
  updated_at: string;        // date de mise à jour ISO 8601
}

export type Partner = {
id: number
name: string
email?: string
phone?: string
status?: string
agents_count?: number
}





export type Performance = {
total_revenue: number
active_agents: number
transactions_month: number
growth_rate?: number
}


export interface AgentStatsType {
  total_agents: number;
  active_agents: number;
  total_commissions: number;
  successful_transactions: number;
}

export interface UserSettings {
  username: string;
  email: string;
  // Add other fields as needed based on API response
}

