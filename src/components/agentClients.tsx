import React from 'react'
import { useAgentData } from '../hooks/useAgentData'


const AgentClients: React.FC = () => {
const { clients, loading } = useAgentData()


if (loading) return <div>Chargement clients...</div>


return (
<section className="bg-white p-4 rounded-2xl shadow">
<h2 className="text-lg font-semibold mb-3">Mes clients</h2>
<ul className="space-y-3">
{clients?.map((c) => (
<li key={c.id} className="p-3 border rounded-md flex justify-between items-center">
<div>
<div className="font-semibold">{c.nom}</div>
<div className="text-sm text-gray-500">{c.telephone}</div>
</div>
<div className="text-sm text-gray-400">{c.statut}</div>
</li>
))}
</ul>
</section>
)
}


export default AgentClients