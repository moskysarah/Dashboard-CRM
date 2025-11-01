import { useEffect, useState } from "react";
import { getPartnerPerformance } from "../../services/partners";

const PartnerPerformance = ({ id }: { id: number | string }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPartnerPerformance(id).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <p>Chargement...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Performance du partenaire</h3>
      <p>Chiffre d’affaires : {data.revenue} $</p>
      <p>Commissions : {data.commissions} $</p>
      <p>Nombre d’agents : {data.agents_count}</p>
    </div>
  );
};

export default PartnerPerformance;
