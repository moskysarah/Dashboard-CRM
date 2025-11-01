import React, { useEffect, useState, useMemo, useRef } from "react";
import type { Transaction, Partner, Performance } from "../types/domain";
import AnalyticsCard from "../components/analyticCard";
import { getPartnerPerformance, getPartnerAgents } from "../services/partners";
import { getUserTransactions } from "../services/user/transactions";
import { useAuth } from "../store/auth";

const DashboardPartner: React.FC = () => {
  const user = useAuth((state: any) => state.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [agents, setAgents] = useState<Partner[]>([]);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs to prevent double calls in development mode
  const hasFetched = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!user || hasFetched.current) return;

    const fetchData = async () => {
      try {
        // Cancel previous request if it exists
        if (abortController.current) {
          abortController.current.abort();
        }

        abortController.current = new AbortController();
        setLoading(true);
        setError(null);

        const [txRes, agentsRes, perfRes] = await Promise.all([
          getUserTransactions(),
          getPartnerAgents(user.id),
          getPartnerPerformance(user.id),
        ]);

        setTransactions(txRes.data.results || txRes.data);
        setAgents(agentsRes.data.results || agentsRes.data);
        setPerformance(perfRes.data);
        hasFetched.current = true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Erreur lors du chargement des données partenaire :", err);
          setError(err.message || "Erreur lors du chargement des données");
          // Set empty data on error
          setTransactions([]);
          setAgents([]);
          setPerformance(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [user]);

  // === Type-safe KPI calculations ===
  const kpis = useMemo(() => {
    // Explicitly typed reduce function for totalAmount
    const totalAmount: number = transactions.reduce((accumulator: number, transaction: Transaction): number => {
      // Amount is now number type
      const amount: number = transaction.amount || 0;

      return accumulator + amount;
    }, 0); // Initial value is explicitly 0 (number)

    // Explicitly typed calculations for other KPIs
    const totalAgents: number = agents.length;

    const activeAgents: number = agents.reduce((count: number, agent: Partner): number => {
      return agent.status === "active" ? count + 1 : count;
    }, 0);

    const totalTransactions: number = transactions.length;

    return {
      totalAmount,
      totalAgents,
      activeAgents,
      totalTransactions,
    };
  }, [transactions, agents]);

  const handleRetry = () => {
    hasFetched.current = false;
    setError(null);
    setLoading(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">
            Chargement des données partenaire...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-600 mb-4 text-center">{error}</div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord partenaire</h1>

      {/* === KPIs === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Montant total" 
          value={`${kpis.totalAmount.toLocaleString()}€`} 
          color="text-blue-600" 
        />
        <AnalyticsCard 
          title="Agents actifs" 
          value={kpis.activeAgents} 
          color="text-green-600" 
        />
        <AnalyticsCard 
          title="Total Transactions" 
          value={kpis.totalTransactions} 
          color="text-orange-600" 
        />
        <AnalyticsCard 
          title="Performance" 
          value={`${performance?.total_revenue || 0}%`} 
          color="text-purple-600" 
        />
      </div>

      {/* === Data Summary === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">Aucune transaction disponible</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction: Transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{transaction.merchant || 'N/A'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {transaction.amount.toLocaleString()}€
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${ 
                      transaction.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800' 
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Agents */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Agents actifs</h2>
          {agents.length === 0 ? (
            <p className="text-gray-500">Aucun agent disponible</p>
          ) : (
            <div className="space-y-3">
              {agents.filter((agent: Partner) => agent.status === "active").slice(0, 5).map((agent: Partner) => (
                <div key={agent.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{agent.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{agent.email || 'N/A'}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                    Actif
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* === Performance Details === */}
      {performance && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Détails de performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-2xl font-bold text-blue-600">
                {performance.total_revenue || 0}%
              </p>
              <p className="text-sm text-gray-600">Revenus totaux</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <p className="text-2xl font-bold text-green-600">
                {performance.transactions_month || 0}
              </p>
              <p className="text-sm text-gray-600">Transactions du mois</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <p className="text-2xl font-bold text-purple-600">
                {performance.active_agents || 0}
              </p>
              <p className="text-sm text-gray-600">Agents actifs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPartner;
