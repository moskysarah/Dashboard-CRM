// UserWallet.tsx
import { useEffect, useState } from "react";
import { MoreHorizontal, CreditCard } from "lucide-react";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import { getUserWallets } from "../../services/user/wallets";

export type CardType = { id: string; brand: string; last4: string; exp: string; type?: string };
export type Wallet = { id: string; balance: number; available?: number; currency?: string; ref?: string; cards?: CardType[]; transactions?: { amount: number }[] };


export default function UserWallet({ wallet: propWallet }: { wallet?: Wallet | null }) {
const [wallet, setWallet] = useState<Wallet | null>(propWallet || null);
const [transactions, setTransactions] = useState<{ amount: number }[]>([]); // Only for sparkline


useEffect(() => {
if (propWallet) {
  setWallet(propWallet);
  setTransactions(propWallet.transactions || []);
} else {
  getUserWallets().then((res: any) => {
    const data = res.data.results ? res.data.results[0] : res.data[0] || res.data;
    setWallet(data);
    setTransactions(data.transactions || []);
  });
}
}, [propWallet]);


if (!wallet) return <div>Loading wallet...</div>;


const sparkData = transactions.slice().reverse().slice(0, 12).map((t, i) => ({ name: `T${i + 1}`, value: t.amount }));
const balanceFormatted = new Intl.NumberFormat(undefined, { style: 'currency', currency: wallet.currency || 'USD' }).format(wallet.balance);


return (
<div className="bg-white p-4 rounded-2xl shadow-sm">
<div className="flex items-center justify-between">
<div className="text-sm text-slate-500">Wallet Balance</div>
<MoreHorizontal size={18} />
</div>
<div className="mt-3">
<div className="text-2xl font-bold">{balanceFormatted}</div>
<div className="mt-3 text-sm text-slate-500">Available: {wallet.available !== undefined ? new Intl.NumberFormat().format(wallet.available) : "—"}</div>
</div>


<div className="mt-4 w-full h-20">
<ResponsiveContainer width="100%" height={80}>
<LineChart data={sparkData}>
<Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={false} />
<Tooltip />
</LineChart>
</ResponsiveContainer>
</div>


<div className="mt-4">
<div className="text-sm text-slate-500">Cards</div>
<div className="mt-3 space-y-3">
{wallet.cards?.map((c) => (
<div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
<div className="flex items-center gap-3">
<CreditCard size={18} />
<div>
<div className="text-sm font-medium">•••• {c.last4}</div>
<div className="text-xs text-slate-500">{c.brand} • Exp {c.exp}</div>
</div>
</div>
<div className="text-sm text-slate-500">{c.type}</div>
</div>
))}
</div>
</div>
</div>
);
}