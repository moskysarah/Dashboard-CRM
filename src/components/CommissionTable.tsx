import React from "react"
import { useCommissions } from "../hooks/useCommission"
import { Button } from "./ui/Button"
import type { Commission } from "../types/Commission"

interface CommissionTableProps {
  onEdit?: (commission: Commission) => void;
  onDelete?: (commission: Commission) => void;
}

const CommissionTable: React.FC<CommissionTableProps> = ({ onEdit, onDelete }) => {
  const { data: commissions, loading, error } = useCommissions()

  if (loading) return <p>Chargement des commissions...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      
      <h2 className="text-lg font-semibold mb-3">Gestion des Commissions</h2>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Agent</th>
            <th className="p-2">Montant</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions?.results?.map((c: Commission) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{c.agent?.name || "N/A"}</td>
              <td className="p-2">{c.amount} FC</td>
              <td className="p-2">{c.status}</td>
              <td className="p-2">{new Date(c.createdAt).toLocaleDateString()}</td>
              <td className="p-2 flex gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => onEdit(c)}
                  >
                    Modifier
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => onDelete(c)}
                  >
                    Supprimer
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CommissionTable
