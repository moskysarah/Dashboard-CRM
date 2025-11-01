import React, { useState, useEffect } from "react";
import { createCommission, updateCommission, getCommissionById } from "../../services/commission";

interface FormProps {
  commissionId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateOrEditCommissionForm: React.FC<FormProps> = ({ commissionId, onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (commissionId) {
      const fetchCommission = async () => {
        const res = await getCommissionById(commissionId);
        setName(res.data.name);
        setPercentage(res.data.percentage);
      };
      fetchCommission();
    }
  }, [commissionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (commissionId) {
        await updateCommission(commissionId, { name, percentage });
        alert("Commission mise à jour !");
      } else {
        await createCommission({ name, percentage });
        alert("Commission créée !");
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 mb-4">
      <h2 className="text-lg font-bold">{commissionId ? "Modifier la commission" : "Créer une commission"}</h2>
      <input
        type="text"
        placeholder="Nom de la commission"
        className="w-full p-2 border rounded"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Pourcentage"
        className="w-full p-2 border rounded"
        value={percentage}
        onChange={e => setPercentage(Number(e.target.value))}
        required
      />
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Enregistrement..." : "Sauvegarder"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded">
          Annuler
        </button>
      </div>
    </form>
  );
};

export default CreateOrEditCommissionForm;
