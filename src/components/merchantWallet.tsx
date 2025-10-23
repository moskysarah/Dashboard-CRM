import React from "react";

type Wallet = {
  id: number;
  balance: string;
  devise: {
    codeISO: string;
    name: string;
  };
};

interface Props {
  wallets: Wallet[];
}

const MerchantWallet: React.FC<Props> = ({ wallets }) => {
  if (wallets.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-green-50 rounded-lg">
      <h3 className="text-md font-semibold mb-2">Solde du Portefeuille</h3>
      {wallets.map((wallet) => (
        <p key={wallet.id}>
          <strong>{wallet.devise.codeISO}:</strong> {wallet.balance} {wallet.devise.name}
        </p>
      ))}
    </div>
  );
};

export default MerchantWallet;
