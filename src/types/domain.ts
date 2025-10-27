// ===================================================================
// TYPES ALIGNED WITH "POSTEPAY API(1).yaml"
// ===================================================================

import type { ReactNode } from "react";

// --- Enums from API ---
export type UserRole = 'superadmin' | 'admin' | 'agent' | 'partner' | 'user';
export type AgentRole = 'superadmin' | 'admin' | 'agent' | 'partner' | 'user';

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'ON'
  | 'OFF'
  | 'REFUNDED';

export type TransactionType = 'IN' | 'OUT';
export type TransactionOperationType =
  | 'MOMO'
  | 'BANKCARD'
  | 'VOUCHER'
  | 'TRANSFERT'
  | 'DEPOT'
  | 'CREDIT_PURCHASE'
  | 'TELCO';

export type MessageType = 'auth' | 'val_trans' | 'reset_pwd' | 'other';

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
};

export type Transaction = {
  id: number;
  codeTransaction?: string | null;
  amount: string;
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

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type TicketPriority = "HIGH" | "MEDIUM" | "LOW";

export type Ticket = {
  id: number;
  title: ReactNode;
  type: ReactNode;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at?: string;
};

// ===================================================================
// DISTRIBUTOR MANAGER TYPES
// ===================================================================

export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

export type Commission = {
  id: string;
  distributorId: string;
  productId: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
  minSales?: number;
  maxSales?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Sale = {
  id: string;
  distributorId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  commissionAmount: number;
  saleDate: Date;
};

export type Stock = {
  id: string;
  distributorId: string;
  productId: string;
  currentLevel: number;
  reservedQuantity: number;
  minLevel: number;
  availableQuantity: number;
  lastUpdated: Date;
};

export type Distributor = {
  id: string;
  name: string;
  totalSales: number;
  totalCommissions: number;
};
