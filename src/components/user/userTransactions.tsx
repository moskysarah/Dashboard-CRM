import { useEffect, useState } from "react";
import { getUserTransactions } from "../../services/user/transactions";

export type Transaction = { id: string; date: string; description: string; amount: number; status: 'success' | 'pending' | 'failed'; balanceAfter?: number };

interface UserTransactionsProps {
  wallet?: { currency?: string };
  transactions?: Transaction[];
}

export default function UserTransactions({ wallet, transactions: propTransactions }: UserTransactionsProps) {
const [transactions, setTransactions] = useState<Transaction[]>(propTransactions || []);


useEffect(() => {
if (propTransactions) {
  setTransactions(propTransactions);
} else {
  getUserTransactions().then((res: any) => setTransactions(res.data.results || res.data));
}
}, [propTransactions]);


if (!transactions.length) return <div>Loading transactions...</div>;


return (
<div className="bg-white p-4 rounded-2xl shadow-sm">
<div className="flex items-start justify-between gap-4">
<div>
<h2 className="text-xl font-semibold">Transactions</h2>
<p className="text-sm text-slate-500 mt-1">Dernières activités du compte</p>
</div>
</div>


<div className="mt-4 overflow-x-auto">
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
{transactions.map((t) => (
<tr key={t.id} className="border-t">
<td className="py-3">{new Date(t.date).toLocaleDateString()}</td>
<td className="py-3">{t.description}</td>
<td className="py-3 font-medium">{new Intl.NumberFormat(undefined, { style: 'currency', currency: wallet?.currency || 'USD' }).format(t.amount)}</td>
<td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${t.status === 'success' ? 'bg-green-100 text-green-800' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{t.status}</span></td>
<td className="py-3 text-slate-500">{t.balanceAfter !== undefined ? new Intl.NumberFormat(undefined, { style: 'currency', currency: wallet?.currency || 'USD' }).format(t.balanceAfter) : '—'}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}
