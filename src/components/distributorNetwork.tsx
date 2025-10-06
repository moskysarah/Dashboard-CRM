import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { UserContext } from "../contexts/userContext";

type Distributor = {
  id: string;
  name: string;
  commission: number;
  sales: number;
  stock: number;
};

const DistributorNetwork: React.FC = () => {
  const { user } = useContext(UserContext);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Top" | "Faible">("Tous");
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="p-6">Chargement du réseau de distribution...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 ml-2 w-300">
      <h2 className="text-lg font-semibold mb-4">Réseau de distribution</h2>
      <div className="mb-4 flex gap-2">
        {["Tous", "Top", "Faible"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-3 py-1 rounded ${
              filter === status ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Distributeur</th>
            <th className="py-2">Commission (%)</th>
            <th className="py-2">Ventes ($)</th>
            <th className="py-2">Stock</th>
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
  );
};

export default DistributorNetwork;
