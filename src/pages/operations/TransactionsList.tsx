import React from "react";
import { useTransactions } from "../../hooks/useTransactions";
import type { TransactionStatus } from "../../types/domain";

const statusColors: Record<TransactionStatus, string> = {
  SUCCESS: "bg-green-100 text-green-600",
  PENDING: "bg-yellow-100 text-yellow-600",
  PROCESSING: "bg-blue-100 text-blue-600",
  FAILED: "bg-red-100 text-red-600",
  CANCELLED: "bg-gray-100 text-gray-600",
  REFUNDED: "bg-purple-100 text-purple-600",
  ON: "bg-green-100 text-green-600",
  OFF: "bg-red-100 text-red-600",
};

const TransactionsList: React.FC = () => {
  const { transactions, loading, error } = useTransactions();

  if (loading) {
    return <p className="text-center py-4">Chargement des transactions...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center divide-y divide-gray-200 text-xs sm:text-sm">
        <thead className="bg-gray-50">
          <tr>
            {[
              "ID Transaction",
              "Montant",
              "Statut",
              "Type",
              "Opération",
              "Date",
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
              <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                {t.codeTransaction || t.id}
              </td>
              <td className="px-3 py-2 font-semibold whitespace-nowrap">
                {t.amount}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>
                  {t.status.toUpperCase()}
                </span>
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                {t.type}
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                {t.typeOperation}
              </td>
              <td className="px-3 py-2 text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                {new Date(t.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
