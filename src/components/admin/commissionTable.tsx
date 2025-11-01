import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Eye } from "lucide-react";
import { getAllCommissions, updateCommissionStatus } from "../../services/superAdmin/commission";
import type { Commission } from "../../types/domain";

const CommissionTable: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Charger la liste des commissions
  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await getAllCommissions();
      setCommissions(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des commissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  // ✅ Valider ou ❌ annuler une commission
  const handleStatusChange = async (id: number, newStatus: "validated" | "cancelled") => {
    try {
      await updateCommissionStatus(id, { status: newStatus });
      fetchCommissions();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut de la commission.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <h2 className="text-lg font-bold px-4 py-3 border-b">Gestion des Commissions</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Partenaire</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Montant</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Aucune commission disponible
              </td>
            </tr>
          ) : (
            commissions.map((commission) => (
              <tr key={commission.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700 font-medium">
                  {commission.partner_name || "—"}
                </td>
                <td className="px-4 py-2 text-gray-600">{commission.amount} FC</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      commission.status === "validated"
                        ? "bg-green-100 text-green-700"
                        : commission.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {commission.status === "validated"
                      ? "Validée"
                      : commission.status === "pending"
                      ? "En attente"
                      : "Annulée"}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(commission.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  {commission.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(commission.id, "validated")}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(commission.id, "cancelled")}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => alert(`Voir détails de la commission #${commission.id}`)}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommissionTable;
