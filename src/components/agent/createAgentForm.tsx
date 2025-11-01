// components/agent/CreateAgentForm.tsx
import React, { useState } from "react";
import { createAgent } from "../../services/agent";

interface CreateAgentFormProps {
  onSuccess?: () => void;
}

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAgent({ name, email, password });
      alert("Agent créé avec succès !");
      setName(""); setEmail(""); setPassword("");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l’agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 mb-6">
      <h2 className="text-lg font-bold">Créer un agent</h2>
      <input type="text" placeholder="Nom" className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? "Création..." : "Sauvegarder"}
      </button>
    </form>
  );
};

export default CreateAgentForm;
