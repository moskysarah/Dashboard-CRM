import React from 'react'
import type { Performance } from '../../types/domain'


const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ title, value, subtitle }) => (
<div className="bg-white p-4 rounded-lg shadow flex flex-col">
<div className="text-sm text-gray-500">{title}</div>
<div className="text-2xl font-bold">{value}</div>
{subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
</div>
)


const DistributorPerformance: React.FC<{ data: Performance | null }> = ({ data }) => {
if (!data) return null
return (
<section className="bg-white p-4 rounded-lg shadow">
<h2 className="text-lg font-semibold mb-4">Performance</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<StatCard title="Revenu total" value={`${data.total_revenue} $`} />
<StatCard title="Transactions (mois)" value={data.transactions_month} />
<StatCard title="Agents actifs" value={data.active_agents} />
<StatCard title="Taux croissance" value={`${data.growth_rate ?? 0}%`} />
</div>
</section>
)
}


export default DistributorPerformance