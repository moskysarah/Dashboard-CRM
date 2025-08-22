// src/pages/Transactions.tsx
import React, { useState, useEffect } from "react";

type Transaction = {
  id: string;
  user: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
};

const TransactionsList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // je simule un flux en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 9),
        user: ["Alice", "Bob", "Charlie" ,"Jean"][Math.floor(Math.random() * 3)],
        amount: Math.floor(Math.random() * 500) + 10,
        status: ["pending", "completed", "failed"][Math.floor(Math.random() * 3)] as Transaction["status"],
        date: new Date().toLocaleString(),
      };
      setTransactions((prev) => [newTransaction, ...prev].slice(0, 10)); // on garde les 10 dernières
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions en temps réel</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-2 px-4 text-center">Utilisateur</th>
            <th className="py-2 px-4 text-center">Montant</th>
            <th className="py-2 px-4 text-center">Statut</th>
            <th className="py-2 px-4 text-center">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-center">{t.user}</td>
              <td className="py-2 px-4 text-center">{t.amount} $</td>
              <td
                className={`py-2 px-4 text-center ${
                  t.status === "completed"
                    ? "text-green-500"
                    : t.status === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {t.status}
              </td>
              <td className="py-2 px-4 text-center">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
