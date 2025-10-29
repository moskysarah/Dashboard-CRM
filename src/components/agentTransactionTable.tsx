import React from "react";

interface Transaction {
  id: number;
  amount: number;
  status: string;
  date: string;
  createdAt?: string;
  description?: string;
}

interface Props {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const statusColors: Record<string, string> = {
  success: "bg-green-500 text-white",
  pending: "bg-yellow-400 text-white",
  failed: "bg-red-500 text-white",
};

const AgentTransactionTable: React.FC<Props> = ({ transactions, loading, error }) => {
  const txs = Array.isArray(transactions) ? transactions : [];

  if (loading)
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-4 text-red-500 font-medium">{error}</div>
    );

  if (txs.length === 0)
    return (
      <div className="text-center py-6 text-gray-500">
       Aucune transaction trouvée.
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
       Mes Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                ID
              </th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                Date
              </th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                Description
              </th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">
               Montant
              </th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {txs.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 font-medium text-gray-700">{tx.id}</td>
                <td className="px-3 py-2 text-gray-600">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 text-gray-600">{tx.description || "—"}</td>
                <td className="px-3 py-2 font-semibold text-gray-800">
                  {tx.amount} FC
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      statusColors[tx.status] || "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentTransactionTable;
