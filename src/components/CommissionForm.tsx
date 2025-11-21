import React, { useState, } from "react";
import { useAgents } from "../hooks/useAgents";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import type { Commission, CommissionFormData } from "../types/Commission";

interface CommissionFormProps {
  commission?: Commission;
  onSubmit: (data: CommissionFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CommissionForm: React.FC<CommissionFormProps> = ({
  commission,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { data: agents } = useAgents();
  const [formData, setFormData] = useState<CommissionFormData>({
    agentId: commission?.agent?.id || "",
    amount: commission?.amount || 0,
    status: commission?.status || "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof CommissionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agent
        </label>
        <select
          value={formData.agentId}
          onChange={(e) => handleChange("agentId", e.target.value)}
          className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        >
          <option value="">Sélectionner un agent</option>
          {agents?.map((agent: any) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Montant
        </label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
          placeholder="Entrez le montant"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Statut
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="pending">En attente</option>
          <option value="paid">Payé</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} size="small">
          {loading ? "Enregistrement..." : commission ? "Modifier" : "Créer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="small">
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default CommissionForm;
