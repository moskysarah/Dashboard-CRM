// components/agent/MyStats.tsx
import React from "react";
import { DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";

interface MyStatsProps {
  stats: {
    totalAmount: number;
    totalSuccess: number;
    totalPending: number;
    totalFailed: number;
  };
}

const MyStats: React.FC<MyStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center justify-between p-4 rounded-lg bg-white shadow text-blue-700">
        <div>
          <span className="text-sm font-medium">Ventes totales</span>
          <p className="text-xl font-bold">{stats.totalAmount}</p>
        </div>
        <DollarSign size={24} />
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg bg-white shadow text-green-700">
        <div>
          <span className="text-sm font-medium">Transactions réussies</span>
          <p className="text-xl font-bold">{stats.totalSuccess}</p>
        </div>
        <CheckCircle size={24} />
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg bg-white shadow text-yellow-700">
        <div>
          <span className="text-sm font-medium">En attente</span>
          <p className="text-xl font-bold">{stats.totalPending}</p>
        </div>
        <Clock size={24} />
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg bg-white shadow text-red-700">
        <div>
          <span className="text-sm font-medium">Échouées</span>
          <p className="text-xl font-bold">{stats.totalFailed}</p>
        </div>
        <XCircle size={24} />
      </div>
    </div>
  );
};

export default MyStats;
