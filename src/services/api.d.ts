// ========================
// USERS
// ========================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================
// MERCHANTS
// ========================
export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  secretKey?: string;
}

// ========================
// TRANSACTIONS
// ========================
export interface Transaction {
  id: string;
  userId: string;
  merchantId?: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
  updatedAt: string;
}

// ========================
// PAYMENTS
// ========================
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

// ========================
// OTP & AUTH
// ========================
export interface OTPRequest {
  phone: string;
}

export interface OTPVerify {
  phone: string;
  otp: string;
}

export interface PasswordReset {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

// ========================
// CREDITS
// ========================
export interface CreditTransfer {
  from: string;
  to: string;
  amount: number;
}

export interface CreditRemove {
  id: string;
  amount: number;
}

// ========================
// NOTIFICATIONS
// ========================
export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ========================
// MESSAGES
// ========================
export interface Message {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
}

// ========================
// WEBHOOKS
// ========================
export interface Webhook {
  id: string;
  event: string;
  url: string;
  createdAt: string;
}
