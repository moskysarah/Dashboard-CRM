import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getDistributors, getSales, createSale, updateDistributor } from "../services/api";
import T from "./translatespace";

type Distributor = {
  id: string;
  name: string;
  commission: number;
  sales: number;
  stock: number;
};

type SaleRecord = {
  id: string;
  distributorId: string;
  amount: number;
  date: string;
};

const SalesStockManagement: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [selectedDistributor, setSelectedDistributor] = useState<string>("");
  const [saleAmount, setSaleAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const distributorsResponse = await getDistributors();
        const salesResponse = await getSales();
        setDistributors(distributorsResponse.data);
        setSalesHistory(salesResponse.data);
      } catch (err) {
        console.error("Erreur fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditStock = (id: string, currentStock: number) => {
    setEditingStockId(id);
    setNewStock(currentStock);
  };

  const handleSaveStock = async (id: string) => {
    try {
      await updateDistributor(id, { stock: newStock });
      setDistributors(distributors.map(d =>
        d.id === id ? { ...d, stock: newStock } : d
      ));
      setEditingStockId(null);
    } catch (err) {
      console.error("Erreur updating stock:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingStockId(null);
    setNewStock(0);
  };

  const handleRecordSale = async (distributorId: string, amount: number) => {
    try {
      const newSale = {
        distributorId,
        amount,
        date: new Date().toISOString(),
      };
      const response = await createSale(newSale);
      setSalesHistory([...salesHistory, response.data]);

      // Update distributor sales
      setDistributors(distributors.map(d =>
        d.id === distributorId ? { ...d, sales: d.sales + amount } : d
      ));
    } catch (err) {
      console.error("Erreur recording sale:", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-32"><T>Chargement des ventes et stocks...</T></div>;

  const stockChartData = distributors.map(d => ({ name: d.name, stock: d.stock }));

  // Prepare sales history chart data (group by date)
  const salesChartData = salesHistory.reduce((acc, sale) => {
    const date = new Date(sale.date).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += sale.amount;
    } else {
      acc.push({ date, amount: sale.amount });
    }
    return acc;
  }, [] as { date: string; amount: number }[]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800"><T>Gestion des Ventes et Stocks</T></h2>

      {/* Stock Management */}
      <div className="mb-8">
     

        {/* Stock Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {distributors.map((d) => (
            <div key={d.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-800 mb-2">{d.name}</h4>
              <div className="mb-3">
                {editingStockId === d.id ? (
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                ) : (
                  <p className="text-lg font-bold text-green-600">{d.stock} unités</p>
                )}
              </div>
              <div className="flex gap-2">
                {editingStockId === d.id ? (
                  <>
                    <button
                      onClick={() => handleSaveStock(d.id)}
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
                    onClick={() => handleEditStock(d.id, d.stock)}
                    className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <T>Modifier</T>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record New Sale */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4"><T>Enregistrer une Nouvelle Vente</T></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedDistributor}
            onChange={(e) => setSelectedDistributor(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value=""><T>Sélectionner Distributeur</T></option>
            {distributors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Montant de la vente"
            value={saleAmount}
            onChange={(e) => setSaleAmount(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg"
            min="0"
          />
          <button
            onClick={() => handleRecordSale(selectedDistributor, saleAmount)}
            disabled={!selectedDistributor || saleAmount <= 0}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300"
          >
            <T>Enregistrer Vente</T>
          </button>
        </div>
      </div>

      {/* Sales History */}
      <div>
        <h3 className="text-lg font-medium mb-4"><T>Historique des Ventes</T></h3>

        {/* Sales Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {salesHistory.slice(-10).reverse().map((sale) => {
            const distributor = distributors.find(d => d.id === sale.distributorId);
            return (
              <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{distributor?.name || 'Inconnu'}</p>
                  <p className="text-sm text-gray-600">{new Date(sale.date).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-orange-600">${sale.amount}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesStockManagement;
