import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, CheckCircle, Users } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';

interface PerformanceData {
  [key: string]: any;
  subStore: string;
  transactions: number;
  revenue: number;
  successRate: number;
  agents: number;
}

const PerformanceChart: React.FC = () => {
  const { data: transactions } = useTransactions();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    if (transactions) {
      // Grouper les transactions par sous-magasin (merchant_name ou sub_store)
      const grouped = transactions.reduce((acc: any, transaction: any) => {
        const subStore = transaction.sub_store || transaction.merchant_name || 'Inconnu';
        if (!acc[subStore]) {
          acc[subStore] = {
            transactions: 0,
            revenue: 0,
            successful: 0,
            total: 0,
            agents: 1 // Simplifié, pourrait être calculé différemment
          };
        }
        acc[subStore].transactions += 1;
        acc[subStore].revenue += transaction.Montant || 0;
        acc[subStore].total += 1;
        if (['completed', 'success'].includes(transaction.status?.toLowerCase())) {
          acc[subStore].successful += 1;
        }
        return acc;
      }, {});

      // Convertir en format pour les graphiques
      const chartData = Object.entries(grouped).map(([subStore, data]: [string, any]) => ({
        subStore,
        transactions: data.transactions,
        revenue: data.revenue,
        successRate: data.total > 0 ? (data.successful / data.total) * 100 : 0,
        agents: data.agents
      }));

      setPerformanceData(chartData);
    }
  }, [transactions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);

  const avgSuccessRate = performanceData.length > 0
    ? performanceData.reduce((sum, item) => sum + item.successRate, 0) / performanceData.length
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
        Performance par Sous-magasin
      </h3>

      {/* Métriques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Revenus Totaux</p>
              <p className="text-2xl font-bold text-blue-800">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Taux de Réussite Moyen</p>
              <p className="text-2xl font-bold text-green-800">
                {avgSuccessRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Sous-magasins Actifs</p>
              <p className="text-2xl font-bold text-purple-800">
                {performanceData.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres - Transactions et Revenus */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Transactions et Revenus</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="subStore"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `$${Number(value).toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenus' : 'Transactions'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="transactions" fill="#8884d8" name="Transactions" />
              <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenus ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique circulaire - Répartition des revenus */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Répartition des Revenus</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subStore, percent }: any) => `${subStore}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {performanceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenus']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Sous-magasin</th>
              <th className="p-3 font-semibold text-gray-700">Transactions</th>
              <th className="p-3 font-semibold text-gray-700">Revenus</th>
              <th className="p-3 font-semibold text-gray-700">Taux de Réussite</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((item, index) => (
              <tr key={item.subStore} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 font-medium text-gray-900">{item.subStore}</td>
                <td className="p-3 text-gray-600">{item.transactions}</td>
                <td className="p-3 text-gray-600 font-semibold">
                  ${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                    item.successRate >= 80 ? 'bg-green-100 text-green-800' :
                    item.successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.successRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceChart;
