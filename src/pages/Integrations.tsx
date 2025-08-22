// src/pages/Integration.tsx
import  { useEffect, useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { fetchPosteSmartData } from "../api/integration";

export default function Integration() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchPosteSmartData().then(setData);
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Intégration Poste Smart</h1>
      {!data ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <p><strong>Partenaires :</strong> {data.partners.join(", ")}</p>
          <p><strong>Dernière synchronisation :</strong> {data.lastSync}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
