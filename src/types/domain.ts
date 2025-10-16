// ===================================================================
// TYPES ALIGNED WITH "POSTEPAY API(1).yaml"
// ===================================================================

// --- Enums from API ---

export type UserRole = 'admin' | 'user' | 'superadmin' | 'merchant';

export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'ON' | 'OFF' | 'REFUNDED';

export type TransactionType = 'IN' | 'OUT';

export type TransactionOperationType = 'MOMO' | 'BANKCARD' | 'VOUCHER' | 'TRANSFERT' | 'DEPOT' | 'CREDIT_PURCHASE' | 'TELCO';

export type MessageType = 'auth' | 'val_trans' | 'reset_pwd' | 'other';


// --- Main Data Structures ---

/**
 * Represents a User object from the API.
 * Based on `components.schemas.User` and `components.schemas.UserDetail`.
 */
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
  profile_image?: string | null; // format: uri
  date_joined?: string; // format: date-time
  last_login?: string | null; // format: date-time
  merchant?: string | null; // format: uuid
}

/**
 * Represents a Transaction object from the API.
 * Based on `components.schemas.Transaction`.
 */
export type Transaction = {
  id: number;
  codeTransaction?: string | null;
  amount: string; // format: decimal
  status: TransactionStatus;
  type: TransactionType;
  typeOperation: TransactionOperationType;
  createdAt: string; // format: date-time
  updatedAt: string; // format: date-time
  devise: number; // ID of the currency
  user?: number | null;
  merchant?: string | null; // format: uuid
  commission?: string; // format: decimal
  fees?: string; // format: decimal
  reference?: string | null;
  phone?: string | null;
}

/**
 * Represents a Message object from the API.
 * Based on `components.schemas.Message`.
 */
export type Message = {
  id: number;
  message: string;
  created_at: string; // format: date-time
  updated_at: string; // format: date-time
  is_sent: boolean;
  phone?: string | null;
  is_for?: MessageType | null;
  user?: number | null;
}

/**
 * Represents an IT Ticket.
 * Note: This structure is not defined in the provided API spec.
 * It is kept from the original `domain.ts` for now.
 */
export type Ticket = {
  id: string;
  title: string;
  type: string;
  status: "Ouvert" | "En cours" | "Résolu";
  priority: "Haute" | "Moyenne" | "Basse";
}
