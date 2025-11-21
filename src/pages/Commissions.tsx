import React, { useState } from "react";
import CommissionTable from "../components/CommissionTable";
import CommissionForm from "../components/CommissionForm";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { useCommissions } from "../hooks/useCommission";
import type { Commission, CommissionFormData } from "../types/Commission";

const Commissions: React.FC = () => {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Commissions</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} size="small">
          Nouvelle Commission
        </Button>
      </div>

      <CommissionTable
        onEdit={setEditingCommission}
        onDelete={setDeletingCommission}
      />

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
              variant="destructive"
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
    </div>
  );
};

export default Commissions;
