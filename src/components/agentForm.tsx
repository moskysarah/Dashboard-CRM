import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import type { Agent, CreateAgentData, UpdateAgentData } from "../types/Agent";
import { createAgent, updateAgent } from "../api/agents";
import { X, Save, User } from "lucide-react";

interface AgentFormProps {
  agent?: Agent;
  onClose: () => void;
  onSuccess: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ agent, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateAgentData | UpdateAgentData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (agent) {
      setFormData({
        first_name: agent.first_name,
        last_name: agent.last_name,
        email: agent.email,
        phone: agent.phone || "",
        region: agent.region || "",
      });
    }
  }, [agent]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "Le prénom est requis";
    }
    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Le nom est requis";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (agent) {
        await updateAgent(agent.id, formData);
      } else {
        await createAgent(formData as CreateAgentData);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      setErrors({ general: error.message || "Erreur lors de la sauvegarde" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            {agent ? "Modifier l'Agent" : "Créer un Agent"}
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.first_name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Entrez le prénom"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.last_name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Entrez le nom"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Entrez l'email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez le numéro de téléphone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Région
            </label>
            <input
              type="text"
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez la région"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                "Sauvegarde..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {agent ? "Modifier" : "Créer"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentForm;
