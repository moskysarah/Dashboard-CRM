import React, { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../services/analytics/overview";
import { getAnalyticsActiveUsers, getUsersGrowth } from "../services/analytics/users";
import {
  getTransactionsByDevise,
  getTransactionsByOperationType,
  getAnalyticsByStatus,
  getTransactionsByType,
  getAnalyticsTimeseries,
} from "../services/analytics/transactions";
import { getTopMerchants } from "../services/analytics/merchants";
import TimeseriesChart from "../components/timeSeriesChart";
import StatusChart from "../components/statusChart";

const Analytics: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [byDevise, setByDevise] = useState<any[]>([]);
  const [byOperationType, setByOperationType] = useState<any[]>([]);
  const [byStatus, setByStatus] = useState<any[]>([]);
  const [byType, setByType] = useState<any[]>([]);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [topMerchants, setTopMerchants] = useState<any[]>([]);
  const [usersGrowth, setUsersGrowth] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          overviewRes,
          activeUsersRes,
          byDeviseRes,
          byOperationTypeRes,
          byStatusRes,
          byTypeRes,
          timeseriesRes,
          topMerchantsRes,
          usersGrowthRes,
        ] = await Promise.all([
          getAnalyticsOverview(),
          getAnalyticsActiveUsers(),
          getTransactionsByDevise(),
          getTransactionsByOperationType(),
          getAnalyticsByStatus(),
          getTransactionsByType(),
          getAnalyticsTimeseries(),
          getTopMerchants(),
          getUsersGrowth(),
        ]);

        setOverview(overviewRes.data);
        setActiveUsers(activeUsersRes.data);
        setByDevise(byDeviseRes.data);
        setByOperationType(byOperationTypeRes.data);
        setByStatus(byStatusRes.data);
        setByType(byTypeRes.data);
        setTimeseries(timeseriesRes.data);
        setTopMerchants(topMerchantsRes.data);
        setUsersGrowth(usersGrowthRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des analytics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6"> Dashboard Analytics</h2>

      {/* KPIs globaux */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Transactions</h3>
                <p className="text-3xl font-bold text-blue-800 mt-2">{overview.total_transactions}</p>
              </div>
              <div className="text-blue-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide">Total Amount</h3>
                <p className="text-3xl font-bold text-green-800 mt-2">{overview.total_amount} €</p>
              </div>
              <div className="text-green-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wide">Active Users</h3>
                <p className="text-3xl font-bold text-purple-800 mt-2">{overview.active_users}</p>
              </div>
              <div className="text-purple-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-orange-600 uppercase tracking-wide">Merchants</h3>
                <p className="text-3xl font-bold text-orange-800 mt-2">{overview.merchants_count}</p>
              </div>
              <div className="text-orange-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="flex flex-wrap gap-4 mb-8">
        <TimeseriesChart data={activeUsers} title="Utilisateurs Actifs" />
        <StatusChart data={byDevise} title="Répartition par Devise" />
        <StatusChart data={byOperationType} title="Répartition par Type d'Opération" />
        <StatusChart data={byStatus} title="Statut des Transactions" />
        <StatusChart data={byType} title="Entrées et Sorties" />
        <TimeseriesChart data={timeseries} title="Évolution Temporelle des Transactions" />
        <TimeseriesChart data={usersGrowth} title="Croissance des Utilisateurs" />
      </div>

      {/* Tableau top marchands */}
      <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Top Marchands</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Transactions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Montant</th>
              </tr>
            </thead>
            <tbody>
              {topMerchants.map((merchant, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{merchant.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{merchant.transactions}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{merchant.amount} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
