import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { UserContext } from "../contexts/userContext";

type Transaction = {
  id: string;
  product: string;
  amount: number;
  status: "Réussi" | "En attente" | "Échoué";
  date: string;
};

const MerchantTransactions: React.FC = () => {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Réussi" | "En attente" | "Échoué">("Tous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/merchants/transactions", {
          params: { role: user?.role },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error("Erreur fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const filteredTransactions =
    filter === "Tous" ? transactions : transactions.filter((t) => t.status === filter);

  if (loading) return <p className="p-6">Chargement des transactions...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 ml-6 w-300">
      <h2 className="text-lg font-semibold mb-4">Transactions Marchand</h2>
      <div className="mb-4 flex gap-2">
        {["Tous", "Réussi", "En attente", "Échoué"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as "Tous" | "Réussi" | "En attente" | "Échoué")}
            className={`px-3 py-1 rounded ${
              filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Produit</th>
            <th className="py-2">Montant ($)</th>
            <th className="py-2">Statut</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{t.product}</td>
              <td className="py-2">{t.amount}</td>
              <td className="py-2">{t.status}</td>
              <td className="py-2">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MerchantTransactions;
