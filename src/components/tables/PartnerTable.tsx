import { usePartners } from "../../hooks/usePartner";

const PartnerTable = () => {
  const { data: partners } = usePartners();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-308">
        <h2 className="text-lg font-semibold mb-3">Gestion des partenaires</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Nom</th>
            <th className="text-left">Email</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {partners?.map((partner: any) => (
            <tr key={partner.id}>
              <td>{partner.name}</td>
              <td>{partner.email}</td>
              <td>{partner.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnerTable;
