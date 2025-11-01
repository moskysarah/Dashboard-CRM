
import { FileText, FileSpreadsheet } from "lucide-react";

type Transaction = { id: string; product: string; amount: number; status: "Réussi" | "En attente" | "Échoué"; date: string; subStore?: string };

type Props = { transactions: Transaction[]; exportCSV: () => void; exportExcel: () => void };

export default function MerchantTransactions({ transactions, exportCSV, exportExcel }: Props) {
  if (!transactions.length) return <div>No transactions available.</div>;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <FileText size={18} />
            CSV
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            <FileSpreadsheet size={18} />
            Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-left">
            <tr>
              <th className="py-3">Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-t">
                <td className="py-3">{new Date(t.date).toLocaleDateString()}</td>
                <td className="py-3">{t.product}</td>
                <td className="py-3 font-medium">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(t.amount)}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${t.status === "Réussi" ? 'bg-green-100 text-green-800' : t.status === "En attente" ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{t.status}</span>
                </td>
                <td className="py-3 text-slate-500">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
