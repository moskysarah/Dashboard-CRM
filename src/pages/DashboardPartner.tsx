import React, { useState } from "react"
import PartnerTable from "../components/tables/PartnerTable"
import AgentTable from "../components/tables/AgentTable"
import PartnerWalletCard from "../components/cards/PartnerWalletCard"
import PartnerStatsCard from "../components/cards/PartnerStatsCard"
import PartnerPerformanceChart from "../components/PartnerPerformanceChart"
import AgentPerformanceChart from "../components/AgentPerformanceChart"
import CommissionTable from "../components/CommissionTable"
import CommissionForm from "../components/CommissionForm"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../components/ui/Modal"
import { Button } from "../components/ui/Button"
import { useCommissions } from "../hooks/useCommission"
import type { Commission, CommissionFormData } from "../types/Commission"
// mport ReportGenerator from "../components/ReportGenerator"

const DashboardPartner: React.FC = () => {
  const { create, update } = useCommissions();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: CommissionFormData) => {
    setFormLoading(true);
    try {
      await create(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (data: CommissionFormData) => {
    if (!editingCommission) return;
    setFormLoading(true);
    try {
      await update(editingCommission.id, data);
      setEditingCommission(null);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-2 md:p-0">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Dashboard Partenaire</h2>

      {/* Wallet and Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PartnerWalletCard />
        <PartnerStatsCard />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PartnerPerformanceChart />
        <AgentPerformanceChart />
      </div>

      {/* Commission Management */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} size="small">
            Nouvelle Commission
          </Button>
        </div>
        <div className="overflow-x-auto">
          <CommissionTable
            onEdit={setEditingCommission}
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="space-y-6">
        {/* Partner Management Grid - Enlarged */}
        <div className="overflow-x-auto">
          <PartnerTable />
        </div>

        {/* Agent Management Grid - Enlarged */}
        <div className="overflow-x-auto">
          <AgentTable />
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogHeader>
          <DialogTitle>Nouvelle Commission</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <CommissionForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingCommission} onOpenChange={() => setEditingCommission(null)}>
        <DialogHeader>
          <DialogTitle>Modifier la Commission</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <CommissionForm
            commission={editingCommission || undefined}
            onSubmit={handleEdit}
            onCancel={() => setEditingCommission(null)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Report Generator
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Génération de Rapports</h3>
        <ReportGenerator />
      </div> */}
    </div>


  )
}

export default DashboardPartner
