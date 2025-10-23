import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDistributors, updateDistributor } from "../services/api";
import T from "./translatespace";

type Distributor = {
  id: string;
  name: string;
  commission: number;
  sales: number;
  stock: number;
};

const CommissionManagement: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCommission, setNewCommission] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const handleEditCommission = (id: string, currentCommission: number) => {
    setEditingId(id);
    setNewCommission(currentCommission);
  };

  const handleSaveCommission = async (id: string) => {
    try {
      await updateDistributor(id, { commission: newCommission });
      setDistributors(distributors.map(d =>
        d.id === id ? { ...d, commission: newCommission } : d
      ));
      setEditingId(null);
    } catch (err) {
      console.error("Erreur updating commission:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewCommission(0);
  };

  if (loading) return <div className="flex justify-center items-center h-32"><T>Chargement des commissions...</T></div>;

  const chartData = distributors.map(d => ({ name: d.name, commission: d.commission }));

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800"><T>Configuration des Commissions</T></h2>

      {/* Chart Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4"><T>Visualisation des Commissions</T></h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="commission" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {distributors.map((d) => {
          const gains = (d.sales * d.commission) / 100;
          return (
            <div key={d.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 mb-2">{d.name}</h3>
              <div className="mb-3">
                {editingId === d.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newCommission}
                      onChange={(e) => setNewCommission(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-blue-600">{d.commission}%</p>
                )}
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-600"><T>Gains calculés:</T></p>
                <p className="text-lg font-bold text-green-600">${gains.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                {editingId === d.id ? (
                  <>
                    <button
                      onClick={() => handleSaveCommission(d.id)}
                      className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <T>Sauvegarder</T>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <T>Annuler</T>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditCommission(d.id, d.commission)}
                    className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <T>Modifier</T>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommissionManagement;
