import React from "react";
import type { Commission } from "../../types/domain";

interface CommissionListProps {
  commissions: Commission[];
}

export const CommissionList: React.FC<CommissionListProps> = ({ commissions }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Configuration des Commissions</h3>
    <div className="space-y-2">
      {commissions.map((commission) => (
        <div key={commission.id} className="flex justify-between items-center p-3 border rounded">
          <div>
            <span className="font-medium">Produit: {commission.productId}</span>
            <span className="ml-4 text-gray-600">
              {commission.type === "percentage" ? `${commission.value}%` : `${commission.value} €`}
            </span>
          </div>
          <span
            className={`px-2 py-1 rounded text-sm ${
              commission.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {commission.isActive ? "Actif" : "Inactif"}
          </span>
        </div>
      ))}
    </div>
  </div>
);
