export interface Commission {
  id: string;
  agent: {
    id: string;
    name: string;
  };
  amount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommissionFormData {
  agentId: string;
  amount: number;
  status: string;
}
