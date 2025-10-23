import React, { useState } from "react";

type Transaction = {
  id: string;
  product: string;
  amount: number;
  status: "Réussi" | "En attente" | "Échoué";
  date: string;
};

interface Props {
  transactions: Transaction[];
  exportCSV: () => void;
  exportExcel: () => void;
}

const MerchantTransactionsList: React.FC<Props> = ({ transactions, exportCSV, exportExcel }) => {
  const [filter, setFilter] = useState<"Tous" | "Réussi" | "En attente" | "Échoué">("Tous");

  const filteredTransactions =
    filter === "Tous" ? transactions : transactions.filter((t) => t.status === filter);

  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">Liste des Transactions</h3>

      {/* Filtres et Export */}
      <div className="mb-4 flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          {["Tous", "Réussi", "En attente", "Échoué"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export CSV
          </button>
          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Tableau */}
      {filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border-b text-left">Produit</th>
                <th className="px-4 py-2 border-b text-left">Montant</th>
                <th className="px-4 py-2 border-b text-left">Statut</th>
                <th className="px-4 py-2 border-b text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{transaction.product}</td>
                  <td className="px-4 py-2 border-b">{transaction.amount}</td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === "Réussi"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "En attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">Aucune transaction trouvée.</p>
      )}
    </div>
  );
};

export default MerchantTransactionsList;
