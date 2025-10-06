import React, { useState, useEffect } from "react";
import api from "../../services/api"; // ton API backend

type Transaction = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "en attente" | "reussi" | "echouer";
  createdDate: string;
  createdAt: string;
  description: string;
};

const statusColors: Record<Transaction["status"], string> = {
  reussi: "bg-green-100 text-green-400 font-bold text-xs px-2 py-0.5 rounded-full",
  "en attente": "bg-yellow-100 text-yellow-400 font-bold text-xs px-2 py-0.5 rounded-full",
  echouer: "bg-red-100 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full",
};

const TransactionsList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupérer l'utilisateur connecté depuis localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔹 Charger depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTransactions(Array.isArray(parsed) ? parsed : []); // ⚡ sécurité
      setLoading(false);
    }
  }, []);

  // 🔹 Fonction pour récupérer les transactions
  const fetchTransactions = async () => {
    try {
      // Choisir la route selon le rôle
      const route = user.role === "admin" ? "/transactions" : "/me/transactions/";
      const res = await api.get(route);

      // ⚡ sécurité : s'assurer que c'est un tableau
      const newTransactions = Array.isArray(res.data) ? res.data : [];
      localStorage.setItem("transactions", JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (err) {
      console.error("Erreur lors du chargement des transactions:", err);
      setTransactions([]); // securité
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Appel initial à l’API
  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔹 Rafraîchissement automatique toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-center py-4">Chargement des transactions...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center py-2">
       
        <button
          onClick={fetchTransactions}
          className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition"
        >
          🔄 Rafraîchir
        </button>
      </div>

      <table className="min-w-full text-center divide-y divide-gray-200 text-xs sm:text-sm">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Utilisateur",
              "Email",
              "Montant",
              "Statut",
              "Date",
              "Heure",
              "Méthode",
              "Description",
            ].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-xs font-medium text-gray-600 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                {t.userName}
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                {t.userEmail}
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                {t.amount} {t.currency}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span className={statusColors[t.status]}>
                  {t.status.toUpperCase()}
                </span>
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                {t.createdDate}
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                {t.createdAt}
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                {t.paymentMethod}
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                {t.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
