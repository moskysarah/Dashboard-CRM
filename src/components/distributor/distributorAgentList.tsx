import React from 'react'
import type { Agent } from '../../types/domain'


const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => (
<div className="p-3 border rounded-lg bg-white flex items-center justify-between">
<div>
<div className="font-medium">{agent.first_name} {agent.last_name}</div>
<div className="text-sm text-gray-500">{agent.email}</div>
<div className="text-xs text-gray-400">{agent.zone || 'N/A'}</div>
</div>
<div className="text-sm text-right">
<div className="font-semibold">{agent.wallet_balance ?? 0} $</div>
<div className="text-xs text-gray-400">{agent.total_transactions ?? 0} tx</div>
</div>
</div>
)


const DistributorAgentsList: React.FC<{ agents: Agent[] }> = ({ agents }) => {
return (
<section className="space-y-4">
<h2 className="text-lg font-semibold">Agents</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{agents.map(a => <AgentCard key={a.id} agent={a} />)}
</div>
</section>
)
}


export default DistributorAgentsList