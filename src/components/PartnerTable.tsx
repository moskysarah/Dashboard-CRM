import React from "react"
import { usePartners } from "../hooks/usePartner"

const PartnerTable: React.FC = () => {
  const { data: partners, loading, error } = usePartners()

  if (loading) return <p>Chargement des partenaires...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 ">
      <h2 className="text-lg font-semibold mb-3">Partenaires</h2>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Entreprise</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {partners?.map((p: any) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{p.company}</td>
              <td className="p-2">{p.contact_name}</td>
              <td className="p-2">{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PartnerTable
