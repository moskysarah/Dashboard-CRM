import React, { useState, useEffect } from "react";
import DistributorProfile from "../components/distributor/distributorProfile";
import DistributorPerformance from "../components/distributor/distributorPerformance";
import DistributorAgentsList from "../components/distributor/distributorAgentList";
import { getPartnerById, getPartnerAgents, getPartnerPerformance } from '../services/api'
import { useAuth } from '../store/auth'
import type { Partner, Agent, Performance } from '../types/domain'

const DashboardDistributor: React.FC = () => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const partnerId = user?.id || 1; // Get partnerId from logged-in user

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setError('Utilisateur non authentifié.');
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pRes, aRes, perfRes] = await Promise.all([
          getPartnerById(partnerId),
          getPartnerAgents(partnerId),
          getPartnerPerformance(partnerId),
        ]);
        setPartner(pRes.data);
        setAgents(aRes.data);
        setPerformance(perfRes.data);
      } catch (err: any) {
        console.error(err);
        setError('Impossible de charger les données du partenaire');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [partnerId, isAuthenticated, user]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Tableau distributeur</h1>
          <div className="text-sm text-gray-600">Dernière mise à jour: {new Date().toLocaleString()}</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main */}
          <main className="lg:col-span-2 space-y-6">
            <DistributorPerformance data={performance} />
            <DistributorAgentsList agents={agents} />
          </main>

          {/* Right / Aside */}
          <aside className="space-y-6">
            <DistributorProfile partner={partner} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardDistributor;
