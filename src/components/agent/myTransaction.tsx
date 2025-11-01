// components/agent/MyTransactions.tsx
import React from "react";
import * as XLSX from "xlsx";
import { FileText, File } from "lucide-react";

interface Transaction {
  id: string;
  product: string;
  amount: number;
  status: string;
  date: string;
  subStore?: string;
}

interface MyTransactionsProps {
  transactions: Transaction[];
}

const MyTransactions: React.FC<MyTransactionsProps> = ({ transactions }) => {
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Produit,Montant,Statut,Date,Sous-magasin",
        ...transactions.map(
          t => `${t.product},${t.amount},${t.status},${t.date},${t.subStore || "Inconnu"}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_agent.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map(t => ({
        Produit: t.product,
        Montant: t.amount,
        Statut: t.status,
        Date: t.date,
        "Sous-magasin": t.subStore || "Inconnu",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions_agent.xlsx");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col space-y-2">
      <div className="flex gap-2 mb-4">
        <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded">
          <FileText size={16} /> CSV
        </button>
        <button onClick={exportExcel} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded">
          <File size={16} /> Excel
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Produit</th>
            <th className="p-2">Montant</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Date</th>
            <th className="p-2">Sous-magasin</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{t.product}</td>
              <td className="p-2">{t.amount}</td>
              <td className="p-2">{t.status}</td>
              <td className="p-2">{t.date}</td>
              <td className="p-2">{t.subStore || "Inconnu"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTransactions;
