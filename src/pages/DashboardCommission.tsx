import React, { useState, useEffect, useMemo } from "react";
import CommissionList from "../components/commission/CommissionList";
import CreateOrEditCommissionForm from "../components/commission/CreateOrEditCommissionForm";
import CommissionKPI from "../components/commission/CommissionKPI";
import { getCommissions } from "../services/commission";
import { DollarSign } from "lucide-react";

const DashboardCommission: React.FC = () => {
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [commissions, setCommissions] = useState<any[]>([]);

  const fetchCommissions = async () => {
    const res = await getCommissions();
    setCommissions(res.data.results || res.data);
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleEdit = (id: number) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingId(undefined);
    fetchCommissions();
  };

  // === KPIs ===
  const kpis = useMemo(() => {
    const total = commissions.reduce((sum, c) => sum + (c.percentage || 0), 0);
    const count = commissions.length;
    const avg = count ? (total / count).toFixed(2) : 0;
    return { total, count, avg };
  }, [commissions]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-4">
      <button
        onClick={() => { setEditingId(undefined); setShowForm(true); }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Créer une commission
      </button>

      {showForm && (
        <CreateOrEditCommissionForm
          commissionId={editingId}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <CommissionKPI title="Total des commissions (%)" value={kpis.total} color="bg-white shadow text-blue-700" icon={<DollarSign />} />
        <CommissionKPI title="Nombre de commissions" value={kpis.count} color="bg-white shadow text-green-700" />
        <CommissionKPI title="Moyenne des commissions (%)" value={kpis.avg} color="bg-white shadow text-yellow-700" />
      </div>

      <CommissionList onEdit={handleEdit} />
    </div>
  );
};

export default DashboardCommission;
