export interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  region?: string;
  total_sales?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AgentStats {
  total_transactions: number;
  total_amount: number;
  monthly_stats: {
    month: string;
    transactions: number;
    amount: number;
  }[];
}

export interface CreateAgentData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  region?: string;
}

export interface UpdateAgentData extends Partial<CreateAgentData> {
  is_active?: boolean;
}
