import React, { useState } from "react";
import UserTable from "../components/UserTable";
import AgentTable from "../components/AgentTable";
import CommissionTable from "../components/CommissionTable";
import CommissionForm from "../components/CommissionForm";
import PartnerPerformanceChart from "../components/PartnerPerformanceChart"
// import WebhookTable from "../components/webhookTable";
// import TransactionTable from "../components/tables/TransactionTable";
import AgentTransactionsTable from "../components/tables/AgentTransactionsTable";
import ReportGenerator from "../components/ReportGenerator";

import AdminWalletTable from "../components/AdminWalletTable.tsx";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { useCommissions } from "../hooks/useCommission";
import type { Commission, CommissionFormData } from "../types/Commission";

import AgentPerformanceChart from "../components/AgentPerformanceChart";

const DashboardAdmin: React.FC = () => {
  const { create, update, remove } = useCommissions();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [deletingCommission, setDeletingCommission] = useState<Commission | null>(null);
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

  const handleDelete = async () => {
    if (!deletingCommission) return;
    setFormLoading(true);
    try {
      await remove(deletingCommission.id);
      setDeletingCommission(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 min-w-0 overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h2>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-w-0 overflow-hidden">
        <div className="overflow-x-auto">
          <UserTable />
        </div>
      </div>

      {/* Agent Management */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-w-0 overflow-hidden">
        <div className="overflow-x-auto">
          <AgentTable />
        </div>
      </div>

      {/* Agent Statistics and Performance */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AgentStatsCard />
        <AgentPerformanceChart />
        <PartnerPerformanceChart />
      </div> */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PartnerPerformanceChart />
        <AgentPerformanceChart />
      </div>

      {/* Commission Management */}
      <div className="min-w-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} size="small">
            Nouvelle Commission
          </Button>
        </div>
        <div className="overflow-x-auto">
          <CommissionTable
            onEdit={setEditingCommission}
            onDelete={setDeletingCommission}
          />
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingCommission} onOpenChange={() => setDeletingCommission(null)}>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="mb-4">
            Êtes-vous sûr de vouloir supprimer la commission de {deletingCommission?.agent?.name} ?
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={formLoading}
              size="small"
            >
              {formLoading ? "Suppression..." : "Supprimer"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeletingCommission(null)}
              size="small"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Webhook Management */}
      {/* <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Gestion des Webhooks</h3>
        <WebhookTable />
      </div> */}

      {/* Transaction Monitoring */}
      

      {/* Agent Transactions */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="overflow-x-auto">
          <AgentTransactionsTable />
        </div>
      </div>

      {/* Wallet Management */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-400">
        <div className="overflow-x-auto">
          <AdminWalletTable />
        </div>
      </div>

      {/* Reporting Tools */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <ReportGenerator />
      </div>
    </div>
  );
};

export default DashboardAdmin;
