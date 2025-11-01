import React, { useEffect, useState } from "react";
import { getCommissions, deleteCommission } from "../../services/commission";

interface Commission {
  id: number;
  name: string;
  percentage: number;
}

interface CommissionListProps {
  onEdit?: (id: number) => void;
}

const CommissionList: React.FC<CommissionListProps> = ({ onEdit }) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);

  const fetchData = async () => {
    const res = await getCommissions();
    setCommissions(res.data.results || res.data);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer cette commission ?")) {
      await deleteCommission(id);
      fetchData();
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <table className="w-full bg-white shadow rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Nom</th>
          <th className="p-2">Pourcentage</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {commissions.map(c => (
          <tr key={c.id} className="border-b hover:bg-gray-50">
            <td className="p-2">{c.name}</td>
            <td className="p-2">{c.percentage}%</td>
            <td className="p-2 flex gap-2 justify-center">
              <button onClick={() => onEdit?.(c.id)} className="px-2 py-1 bg-yellow-500 text-white rounded">Modifier</button>
              <button onClick={() => handleDelete(c.id)} className="px-2 py-1 bg-red-600 text-white rounded">Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommissionList;
