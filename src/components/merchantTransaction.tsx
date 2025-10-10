import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { UserContext } from "../contexts/userContext";
import { useTranslationContext } from "../contexts/translateContext";

type Transaction = {
  id: string;
  product: string;
  amount: number;
  status: "Réussi" | "En attente" | "Échoué";
  date: string;
};

const MerchantTransactions: React.FC = () => {
  const { user } = useContext(UserContext);
  const { translate } = useTranslationContext();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Réussi" | "En attente" | "Échoué">("Tous");
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/me/transactions/", {
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

  if (loading) return <p className="p-6">{translate("Chargement des transactions...")}</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">{translate("Transactions Marchand")}</h2>

      <div className="mb-4 flex gap-2 flex-wrap">
        {(["Tous", "Réussi", "En attente", "Échoué"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded ${
              filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {translate(status)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="py-2">{translate("Produit")}</th>
              <th className="py-2">{translate("Montant ($)")}</th>
              <th className="py-2">{translate("Statut")}</th>
              <th className="py-2">{translate("Date")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{t.product}</td>
                <td className="py-2">{t.amount}</td>
                <td className="py-2">{translate(t.status)}</td>
                <td className="py-2">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MerchantTransactions;
