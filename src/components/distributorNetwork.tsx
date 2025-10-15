import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getDistributors, createDistributor, deleteDistributor } from "../services/api";
import { useUser } from "../contexts/userContext.ts";
import T from "./T";

type Distributor = {
  id: string;
  name: string;
  commission: number;
  sales: number;
  stock: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DistributorNetwork: React.FC = () => {
  const user = useUser();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Top" | "Faible">("Tous");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDistributor, setNewDistributor] = useState({
    name: "",
    commission: 0,
    sales: 0,
    stock: 0,
  });

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await getDistributors();
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

  const handleAddDistributor = async () => {
    try {
      const response = await createDistributor(newDistributor);
      setDistributors([...distributors, response.data]);
      setNewDistributor({ name: "", commission: 0, sales: 0, stock: 0 });
      setShowAddForm(false);
    } catch (err) {
      console.error("Erreur adding distributor:", err);
    }
  };

  const handleDeleteDistributor = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce distributeur ?")) {
      try {
        await deleteDistributor(id);
        setDistributors(distributors.filter(d => d.id !== id));
      } catch (err) {
        console.error("Erreur deleting distributor:", err);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-32"><T>Chargement du réseau de distribution...</T></div>;

  const pieChartData = filteredDistributors.map((d, index) => ({
    name: d.name,
    value: d.sales,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white p-4 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800"><T>Réseau de distribution</T></h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <T>Ajouter Distributeur</T>
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4"><T>Nouveau Distributeur</T></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nom"
              value={newDistributor.name}
              onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Commission (%)"
              value={newDistributor.commission}
              onChange={(e) => setNewDistributor({ ...newDistributor, commission: Number(e.target.value) })}
              className="px-3 py-2 border rounded-lg"
              min="0"
              max="100"
            />
            <input
              type="number"
              placeholder="Ventes ($)"
              value={newDistributor.sales}
              onChange={(e) => setNewDistributor({ ...newDistributor, sales: Number(e.target.value) })}
              className="px-3 py-2 border rounded-lg"
              min="0"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newDistributor.stock}
              onChange={(e) => setNewDistributor({ ...newDistributor, stock: Number(e.target.value) })}
              className="px-3 py-2 border rounded-lg"
              min="0"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddDistributor}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <T>Ajouter</T>
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <T>Annuler</T>
            </button>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["Tous", "Top", "Faible"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as "Tous" | "Top" | "Faible")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === status ? "bg-purple-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Chart Section */}
      {filteredDistributors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4"><T>Répartition des Ventes</T></h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Distributor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistributors.map((d) => (
          <div key={d.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800 mb-2">{d.name}</h3>
            <div className="space-y-1 mb-3">
              <p className="text-sm"><span className="font-medium"><T>Commission:</T></span> {d.commission}%</p>
              <p className="text-sm"><span className="font-medium"><T>Ventes:</T></span> ${d.sales}</p>
              <p className="text-sm"><span className="font-medium"><T>Stock:</T></span> {d.stock} unités</p>
            </div>
            <button
              onClick={() => handleDeleteDistributor(d.id)}
              className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <T>Supprimer</T>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributorNetwork;
