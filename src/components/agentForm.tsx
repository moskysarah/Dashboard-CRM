import React from 'react'
import { useNavigate } from 'react-router-dom'


const AgentForms: React.FC = () => {
const navigate = useNavigate()


return (
<section className="bg-white p-4 rounded-2xl shadow">
<h2 className="text-lg font-semibold mb-3">Formulaires</h2>
<div className="flex flex-col sm:flex-row gap-3">
<button
onClick={() => navigate('/agent/new-client')}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Nouveau client
</button>


<button
onClick={() => navigate('/agent/new-transaction')}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Nouvelle transaction
</button>


<button
onClick={() => navigate('/agent/new-report')}
className="bg-yellow-600 text-white px-4 py-2 rounded"
>
Signaler / Assistance
</button>
</div>
</section>
)
}


export default AgentForms