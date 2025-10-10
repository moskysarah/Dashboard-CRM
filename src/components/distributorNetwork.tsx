import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { UserContext } from "../contexts/userContext";
import { useTranslationContext } from "../contexts/translateContext";

type Distributor = {
  id: string;
  name: string;
  commission: number;
  sales: number;
  stock: number;
};

const DistributorNetwork: React.FC = () => {
  const { user } = useContext(UserContext);
  const { translate } = useTranslationContext();

  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Top" | "Faible">("Tous");
  const [loading, setLoading] = useState(true);

  const [translatedFilters, setTranslatedFilters] = useState({
    Tous: "Tous",
    Top: "Top",
    Faible: "Faible",
  });
  const [translatedLabels, setTranslatedLabels] = useState({
    title: "Réseau de distribution",
    distributor: "Distributeur",
    commission: "Commission (%)",
    sales: "Ventes ($)",
    stock: "Stock",
    loading: "Chargement du réseau de distribution...",
  });

  // Traduction labels statiques et filtres
  useEffect(() => {
    const translateLabels = async () => {
      setTranslatedLabels({
        title: await translate("Réseau de distribution"),
        distributor: await translate("Distributeur"),
        commission: await translate("Commission (%)"),
        sales: await translate("Ventes ($)"),
        stock: await translate("Stock"),
        loading: await translate("Chargement du réseau de distribution..."),
      });

      setTranslatedFilters({
        Tous: await translate("Tous"),
        Top: await translate("Top"),
        Faible: await translate("Faible"),
      });
    };
    translateLabels();
  }, [translate]);

  // Récupération des distributeurs
  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await api.get("/distributors", {
          params: { role: user?.role },
        });
        setDistributors(response.data);
      } catch (err) {
        console.error("Erreur fetching distributors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, [user]);

  const filteredDistributors = distributors.filter((d) => {
    if (filter === "Top") return d.sales > 400;
    if (filter === "Faible") return d.sales <= 400;
    return true;
  });

  if (loading) return <p className="p-6">{translatedLabels.loading}</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">{translatedLabels.title}</h2>

      <div className="mb-4 flex gap-2 flex-wrap">
        {(["Tous", "Top", "Faible"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded ${
              filter === status ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            {translatedFilters[status]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="py-2">{translatedLabels.distributor}</th>
              <th className="py-2">{translatedLabels.commission}</th>
              <th className="py-2">{translatedLabels.sales}</th>
              <th className="py-2">{translatedLabels.stock}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDistributors.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{d.name}</td>
                <td className="py-2">{d.commission}</td>
                <td className="py-2">{d.sales}</td>
                <td className="py-2">{d.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributorNetwork;
