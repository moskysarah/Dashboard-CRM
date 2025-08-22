import React, { useState } from "react";
import { distributors } from "../api/fakeAPI";

const DistributorNetwork: React.FC = () => {
  const [filter, setFilter] = useState<"Tous" | "Top" | "Faible">("Tous");

  const filteredDistributors = distributors.filter(d => {
    if (filter === "Top") return d.sales > 400;
    if (filter === "Faible") return d.sales <= 400;
    return true;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Réseau de distribution</h2>
      <div className="mb-4 flex gap-2">
        {["Tous", "Top", "Faible"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-3 py-1 rounded ${filter === status ? "bg-purple-500 text-white" : "bg-gray-200"}`}
          >
            {status}
          </button>
        ))}
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Distributeur</th>
            <th className="py-2">Commission (%)</th>
            <th className="py-2">Ventes ($)</th>
            <th className="py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredDistributors.map(d => (
            <tr key={d.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{d.name}</td>
              <td className="py-2">{d.commission}</td>
              <td className="py-2">{d.sales}</td>
              <td className="py-2">{d.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DistributorNetwork;
