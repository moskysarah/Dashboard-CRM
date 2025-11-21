import React from "react";
import { useAdminWallets } from "../hooks/useAdminWallets";
import { Button } from "./ui/Button";
import { Eye } from "lucide-react";

const AdminWalletTable: React.FC = () => {
  const { wallets, loading, error } = useAdminWallets();

  if (loading) return <p>Chargement des wallets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <Eye className="w-6 h-6 mr-2 text-blue-600" />
        Gestion des Wallets
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="p-4 font-semibold text-gray-700">ID</th>
              <th className="p-4 font-semibold text-gray-700">Utilisateur</th>
              <th className="p-4 font-semibold text-gray-700">Solde</th>
              <th className="p-4 font-semibold text-gray-700">Devise</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets?.map((wallet: any) => (
              <tr key={wallet.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                <td className="p-4 font-medium text-gray-900">{wallet.id}</td>
                <td className="p-4 text-gray-600">{wallet.user?.first_name} {wallet.user?.last_name}</td>
                <td className="p-4 text-gray-600">{wallet.balance}</td>
                <td className="p-4 text-gray-600">{wallet.currency}</td>
                <td className="p-4">
                  <Button
                    onClick={() => {/* TODO: Implement view wallet details */}}
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {wallets?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          Aucun wallet trouvé
        </div>
      )}
    </div>
  );
};

export default AdminWalletTable;
