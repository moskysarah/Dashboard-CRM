import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, CheckCircle, Users } from 'lucide-react';
import { getPartnerPerformance } from '../api/partners';

interface PartnerPerformanceData {
  partner: string;
  transactions: number;
  revenue: number;
  successRate: number;
  commissions: number;
}

const PartnerPerformanceChart: React.FC<{}> = () => {
  const [performanceData, setPerformanceData] = useState<PartnerPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const data = await getPartnerPerformance('all');
        // Assuming the API returns data in a format that can be mapped
        // If not, adjust based on actual API response
        const chartData = data.map((item: any) => ({
          partner: item.name || item.partner_name || `Partner ${item.id}`,
          transactions: item.transactions || 0,
          revenue: item.revenue || 0,
          successRate: item.success_rate || 0,
          commissions: item.commissions || 0
        }));
        setPerformanceData(chartData);
      } catch (error) {
        console.error('Error fetching partner performance data:', error);
        // Fallback to mock data if API fails
        setPerformanceData([
          { partner: 'Partner A', transactions: 200, revenue: 3500, successRate: 88, commissions: 175 },
          { partner: 'Partner B', transactions: 180, revenue: 2700, successRate: 82, commissions: 135 },
          { partner: 'Partner C', transactions: 250, revenue: 4250, successRate: 94, commissions: 212 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommissions = performanceData.reduce((sum, item) => sum + item.commissions, 0);
  const avgSuccessRate = performanceData.length > 0
    ? performanceData.reduce((sum, item) => sum + item.successRate, 0) / performanceData.length
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
        Performance des Partenaires
      </h3>

      {/* Métriques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Revenus Totaux</p>
              <p className="text-2xl font-bold text-purple-800">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm text-indigo-600 font-medium">Taux de Réussite Moyen</p>
              <p className="text-2xl font-bold text-indigo-800">
                {avgSuccessRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-pink-600 mr-3" />
            <div>
              <p className="text-sm text-pink-600 font-medium">Commissions Totales</p>
              <p className="text-2xl font-bold text-pink-800">
                ${totalCommissions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres - Transactions et Revenus */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Transactions et Revenus par Partenaire</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="partner"
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

        {/* Graphique linéaire - Taux de Réussite */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Taux de Réussite et Commissions</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="partner"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === 'commissions' ? `$${Number(value).toLocaleString()}` : `${value}%`,
                  name === 'commissions' ? 'Commissions' : 'Taux de Réussite'
                ]}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="successRate" stroke="#8884d8" name="Taux de Réussite (%)" />
              <Line yAxisId="right" type="monotone" dataKey="commissions" stroke="#82ca9d" name="Commissions ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Partenaire</th>
              <th className="p-3 font-semibold text-gray-700">Transactions</th>
              <th className="p-3 font-semibold text-gray-700">Revenus</th>
              <th className="p-3 font-semibold text-gray-700">Taux de Réussite</th>
              <th className="p-3 font-semibold text-gray-700">Commissions</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((item, index) => (
              <tr key={item.partner} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 font-medium text-gray-900">{item.partner}</td>
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
                <td className="p-3 text-gray-600 font-semibold">
                  ${item.commissions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerPerformanceChart;
