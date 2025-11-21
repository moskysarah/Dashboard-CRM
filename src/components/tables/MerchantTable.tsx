import React from "react"
import { useMerchants } from "../../hooks/useMerchant"

const MerchantTable: React.FC = () => {
  const { data: merchants, loading, error } = useMerchants()

  if (loading) return <p>Chargement des marchands...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-white rounded-2xl w-full shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Marchands</h2>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nom</th>
            <th className="p-2">Téléphone</th>
            <th className="p-2">Solde</th>
          </tr>
        </thead>
        <tbody>
          {merchants?.map((m: any) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.phone}</td>
              <td className="p-2">{m.wallet_balance} FC</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MerchantTable
