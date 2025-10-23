import React from "react";
import T from "./translatespace";

interface Wallet {
  id: number;
  balance: number;
  currency: string;
  last_updated: string;
}

interface Props {
  wallet: Wallet | null;
  loading: boolean;
}

const AgentWallet: React.FC<Props> = ({ wallet, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!wallet)
    return (
      <div className="text-center py-6 text-gray-500">
        <T>Aucun portefeuille trouvé.</T>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        <T>Mon Portefeuille</T>
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-lg shadow-md">
        <div>
          <p className="text-sm opacity-80"><T>Solde actuel</T></p>
          <p className="text-3xl font-bold">
            {wallet.balance.toLocaleString()} {wallet.currency}
          </p>
        </div>
        <div className="mt-3 sm:mt-0">
          <p className="text-sm opacity-80"><T>Dernière mise à jour</T></p>
          <p className="font-semibold">
            {new Date(wallet.last_updated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentWallet;
