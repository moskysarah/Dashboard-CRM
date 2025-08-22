import React, { useState } from "react";
import { transactions } from "../api/fakeAPI";

const MerchantTransactions: React.FC = () => {
  const [filter, setFilter] = useState<"Tous" | "Réussi" | "En attente" | "Échoué">("Tous");

  const filteredTransactions =
    filter === "Tous" ? transactions : transactions.filter(t => t.status === filter);

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Transactions Marchand</h2>
      <div className="mb-4 flex gap-2">
        {["Tous", "Réussi", "En attente", "Échoué"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-3 py-1 rounded ${filter === status ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
          {filteredTransactions.map(t => (
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
