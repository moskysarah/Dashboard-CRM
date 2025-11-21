import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { getAgentStats } from '../../api/agents';
import { useAuth } from '../../context/AuthContext';

interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  totalTransactions: number;
  totalRevenue: number;
  averageCommission: number;
  successRate: number;
}

const AgentStatsCard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAgentStats(user.id.toString());
        setStats(data);
      } catch (error) {
        console.error('Error fetching agent stats:', error);
        // Fallback to mock data - but this should be improved to show actual agent data
        setStats({
          totalAgents: 0, // Number of sub-agents
          activeAgents: 0,
          totalTransactions: 0,
          totalRevenue: 0,
          averageCommission: 0,
          successRate: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 p-3 md:p-4 lg:p-6 rounded-xl shadow-lg animate-pulse">
        <div className="h-6 bg-white/20 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-white/20 rounded"></div>
          <div className="h-16 bg-white/20 rounded"></div>
          <div className="h-16 bg-white/20 rounded"></div>
          <div className="h-16 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 md:hover:scale-102">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold">Agent Statistiques</h3>
           
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-green-300" />
          <span className="text-green-300 text-xs font-semibold">+{stats.successRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 p-4 rounded-lg ">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-teal-200" />
            <span className="text-teal-200 text-sm font-medium">Total Agents</span>
          </div>
          <p className="text-white text-2xl font-bold">{stats.totalAgents}</p>
          <p className="text-teal-100 text-xs">Active: {stats.activeAgents}</p>
        </div>

        <div className="bg-white/10 p-4 rounded-lg ">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-teal-200" />
            <span className="text-teal-200 text-sm font-medium">Transactions</span>
          </div>
          <p className="text-white text-2xl font-bold ">{stats.totalTransactions ? stats.totalTransactions.toLocaleString() : '0'}</p>
          <p className="text-teal-100 text-xs">Ce mois</p>
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-teal-200" />
            <span className="text-teal-200 text-sm font-medium">Revenue</span>
          </div>
          <p className="text-white text-2xl font-bold">${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}</p>
          <p className="text-teal-100 text-xs">Total révenu</p>
        </div>

        <div className="bg-white/10 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-teal-200" />
            <span className="text-teal-200 text-sm font-medium">Avg Commission</span>
          </div>
          <p className="text-white text-2xl font-bold">${stats.averageCommission }</p>
          <p className="text-teal-100 text-xs">Par transaction</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-teal-200 text-sm">Taux de réussite</span>
          <span className="text-white font-bold">{stats.successRate}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div
            className="bg-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.successRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AgentStatsCard;
