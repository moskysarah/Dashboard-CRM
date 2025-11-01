import { useEffect, useState } from "react";
import { MoreHorizontal, CreditCard } from "lucide-react";
import { getWalletById } from "../../services/merchants";

type CardType = { id: string; brand: string; last4: string; exp: string; type?: string };
type Wallet = { id: number; balance: number; available?: number; currency?: string; cards?: CardType[] };

type Props = { wallets: Wallet[]; merchantId: string | number };

export default function MerchantWallet({ merchantId }: Props) {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    getWalletById(merchantId).then((res: any) => setWallet(res.data)).catch((err: any) => console.error(err));
  }, [merchantId]);

  if (!wallet) return <div>Loading wallet...</div>;

  const balanceFormatted = new Intl.NumberFormat(undefined, { style: 'currency', currency: wallet.currency || 'USD' }).format(wallet.balance);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Wallet Balance</div>
        <MoreHorizontal size={18} />
      </div>
      <div className="mt-3 text-2xl font-bold">{balanceFormatted}</div>
      <div className="mt-4">
        <div className="text-sm text-slate-500">Cards</div>
        <div className="mt-3 space-y-3">
          {wallet.cards?.map(c => (
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
