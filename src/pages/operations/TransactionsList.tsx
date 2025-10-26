import React, { useEffect, useState } from "react";
import { getAgentTransactions } from "../../services/api"; // adapte selon ton API
import { useAuth } from "../../store/auth";


type TransactionData = {
  id: number;
  amount: number;
  date: string;
  status: string;
};

const TransactionsList: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const res = await getAgentTransactions();
        // Forcer transactions à être un tableau
        setTransactions(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        console.error("Erreur lors du chargement des transactions:", err);
        setError("Erreur lors du chargement des transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) return <p className="text-center py-4">Chargement des transactions...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="w-full bg-white p-4 rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-center text-xs divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {["ID", "Montant", "Date", "Statut"].map((h, i) => (
                <th key={i} className="px-3 py-2 font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(transactions) ? transactions : []).map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">{t.id}</td>
                <td className="px-3 py-2">{t.amount} $</td>
                <td className="px-3 py-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-3 py-2">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;
