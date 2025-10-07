import React from "react";
import TransactionsList from "./TransactionsList";
import ReportsList from "./RapportsList";
import { useOverviewStats } from "../../hooks/useOverviewStats";

// ===== Section Card Composant =====
interface SectionCardProps {
  title: string;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 relative w-full">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};

// ===== UserManagement Component =====
const UserManagement: React.FC = () => {
  const { stats: overviewStats, loading: statsLoading } = useOverviewStats();

  return (
    <div className="p-6 bg-gray-100 min-h-screen overflow-y-auto overflow-x-hidden">
      {/* === Statistiques === */}
      {statsLoading ? (
        <div className="text-center p-6">Chargement des statistiques...</div>
      ) : overviewStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Utilisateurs */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Total Utilisateurs</h3>
            <p className="text-xl font-bold">{overviewStats.users.total_users}</p>
          </div>
          {/* Nouveaux Utilisateurs */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Nouveaux Utilisateurs (30j)</h3>
            <p className="text-xl font-bold text-green-600">{overviewStats.users.new_users_in_period}</p>
          </div>
          {/* Volume Total Entrant */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Volume Total (Entrant)</h3>
            <p className="text-xl font-bold text-blue-600">{overviewStats.financials.total_volume_in} $</p>
          </div>
          {/* Taux de succès des transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Taux de Succès (Tx)</h3>
            <p className="text-xl font-bold text-purple-600">{overviewStats.transactions.success_rate_percent} %</p>
          </div>
        </div>
      )}

      {/* === Statistiques Financières et par Devise === */}
      {overviewStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Détails Financiers */}
          <SectionCard title="Détails Financiers (30j)">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenu Estimé:</span>
                <span className="font-bold text-green-600">{overviewStats.financials.estimated_revenue.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume Sortant:</span>
                <span className="font-bold">{overviewStats.financials.total_volume_out.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valeur Moyenne de Transaction:</span>
                <span className="font-bold">{overviewStats.financials.average_transaction_value.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Marchands:</span>
                <span className="font-bold">{overviewStats.merchants.total_merchants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marchands Actifs:</span>
                <span className="font-bold">{overviewStats.merchants.active_merchants_in_period}</span>
              </div>
            </div>
          </SectionCard>

          {/* Statistiques par Devise */}
          <SectionCard title="Activité par Devise (30j)">
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="py-1 px-2 font-semibold text-gray-600">Devise</th>
                    <th className="py-1 px-2 font-semibold text-gray-600">Volume Entrant</th>
                    <th className="py-1 px-2 font-semibold text-gray-600">Succès</th>
                    <th className="py-1 px-2 font-semibold text-gray-600">Échecs</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewStats.stats_per_devise.map(devise => (
                    <tr key={devise.devise__codeISO} className="border-t">
                      <td className="py-2 px-2 font-bold">{devise.devise__codeISO}</td>
                      <td className="py-2 px-2">{(devise.volume_in ?? 0).toLocaleString()}</td>
                      <td className="py-2 px-2 text-green-600">{devise.successful_count}</td>
                      <td className="py-2 px-2 text-red-600">{devise.failed_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Transactions */}
      <SectionCard title="Transactions ">
        <TransactionsList />
      </SectionCard>

      {/* Rapports */}
      <SectionCard title="Rapport de transaction">
        <ReportsList />
      </SectionCard>
    </div>
  );
};

export default UserManagement;
