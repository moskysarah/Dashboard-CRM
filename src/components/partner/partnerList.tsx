import { Link } from "react-router-dom";
import { usePartners } from "../../hooks/usePartner";
import { Button } from "../ui/Button";

const PartnerList = () => {
  const { partners, loading, removePartner } = usePartners();

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Liste des Partenaires</h2>
        <Link to="/partners/create">
          <Button>+ Créer un partenaire</Button>
        </Link>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner: any) => (
            <tr key={partner.id} className="border-t">
              <td className="p-2">{partner.name}</td>
              <td className="p-2">{partner.email}</td>
              <td className="p-2">
                <Link to={`/partners/${partner.id}`}>
                  <Button variant="outline">Voir</Button>
                </Link>
                <Button
                  variant="destructive"
                  className="ml-2"
                  onClick={() => removePartner(partner.id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnerList;
