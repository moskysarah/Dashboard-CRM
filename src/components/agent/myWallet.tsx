// components/agent/MyWallet.tsx
import React from "react";

interface MyWalletProps {
  wallets: {
    id: number;
    balance: number;
    currency: string;
  }[];
}

const MyWallet: React.FC<MyWalletProps> = ({ wallets }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {wallets.map(w => (
        <div key={w.id} className="p-4 rounded-lg bg-white shadow flex flex-col items-center">
          <p className="text-gray-500 text-sm">Portefeuille #{w.id}</p>
          <p className="text-xl font-bold">{w.balance} {w.currency}</p>
        </div>
      ))}
    </div>
  );
};

export default MyWallet;
