import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import type { Agent, CreateAgentData, UpdateAgentData } from "../types/Agent";

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (data: CreateAgentData | UpdateAgentData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({
  agent,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateAgentData | UpdateAgentData>({
    first_name: agent?.first_name || "",
    last_name: agent?.last_name || "",
    email: agent?.email || "",
    phone: agent?.phone || "",
    region: agent?.region || "",
  });

  const [isActive, setIsActive] = React.useState(agent?.is_active ?? true);

  const handleChange = (
    field: keyof CreateAgentData | keyof UpdateAgentData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agent) {
      onSubmit({ ...formData, is_active: isActive });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium mb-1 text-gray-700">
          Prénom
        </label>
        <Input
          id="first_name"
          type="text"
          value={formData.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
          placeholder="Entrez le prénom"
          required
        />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium mb-1 text-gray-700">
          Nom
        </label>
        <Input
          id="last_name"
          type="text"
          value={formData.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
          placeholder="Entrez le nom"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Entrez l'email"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
          Téléphone
        </label>
        <Input
          id="phone"
          type="text"
          value={formData.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Entrez le numéro de téléphone"
        />
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium mb-1 text-gray-700">
          Région
        </label>
        <Input
          id="region"
          type="text"
          value={formData.region || ""}
          onChange={(e) => handleChange("region", e.target.value)}
          placeholder="Entrez la région"
        />
      </div>

      {agent && (
        <div className="flex items-center pt-2">
          <input
            id="is_active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Actif
          </label>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} size="small">
          {loading ? "Enregistrement..." : agent ? "Modifier" : "Créer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="small">
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default AgentForm;
