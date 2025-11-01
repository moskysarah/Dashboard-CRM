import React, { useEffect, useState } from "react";
import { getPartners, deletePartner } from "../../services/partners";
import { Eye, Trash2, CheckCircle, Ban, Loader2 } from "lucide-react";
import type { Partner } from "../../types/domain";

const PartnerTable: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Charger la liste des partenaires
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await getPartners();
      setPartners(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des partenaires.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  //  Activer / Suspendre un partenaire
  const handleStatusChange = async (id: number, action: "activate" | "suspend") => {
    try {
      await updatePartnerStatus(id, action);
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour le statut du partenaire.");
    }
  };

  // ❌ Supprimer un partenaire
  const handleDelete = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) {
      try {
        await deletePartner(id);
        fetchPartners();
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression du partenaire.");
      }
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
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nom</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">{partner.name}</td>
              <td className="px-4 py-2 text-gray-600">{partner.email}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    partner.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {partner.status === "active" ? "Actif" : "Suspendu"}
                </span>
              </td>
              <td className="px-4 py-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => handleStatusChange(partner.id, partner.status === "active" ? "suspend" : "activate")}
                  className={`p-2 rounded-full ${
                    partner.status === "active"
                      ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  {partner.status === "active" ? <Ban size={18} /> : <CheckCircle size={18} />}
                </button>

                <button
                  onClick={() => alert(`Voir les détails du partenaire ${partner.name}`)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  <Eye size={18} />
                </button>

                <button
                  onClick={() => handleDelete(partner.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnerTable;
function updatePartnerStatus(_id: number, _action: string) {
    throw new Error("Function not implemented.");
}

