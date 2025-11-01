import React, { useEffect, useState, type JSX } from "react";
import { Loader2, Users, DollarSign, CheckCircle2 } from "lucide-react";
import { getAgentStats } from "../../services/superAdmin/agent";
import type { AgentStatsType } from "../../types/domain";

const StatCard: React.FC<{ title: string; value: string | number; icon: JSX.Element; color?: string }> = ({
  title,
  value,
  icon,
  color = "bg-indigo-50 text-indigo-700",
}) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl shadow-md ${color}`}>
    <div className="p-3 rounded-full bg-white">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AgentStats: React.FC = () => {
  const [stats, setStats] = useState<AgentStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getAgentStats();
      setStats(res.data || null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des statistiques des agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!stats) {
    return <p className="text-gray-500">Aucune statistique disponible</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Agents"
        value={stats.total_agents}
        icon={<Users size={24} />}
        color="bg-blue-50 text-blue-700"
      />
      <StatCard
        title="Commissions Générées"
        value={`${stats.total_commissions} FC`}
        icon={<DollarSign size={24} />}
        color="bg-green-50 text-green-700"
      />
      <StatCard
        title="Transactions Réussies"
        value={stats.successful_transactions}
        icon={<CheckCircle2 size={24} />}
        color="bg-purple-50 text-purple-700"
      />
      <StatCard
        title="Agents Actifs"
        value={stats.active_agents}
        icon={<Users size={24} />}
        color="bg-yellow-50 text-yellow-700"
      />
    </div>
  );
};

export default AgentStats;
