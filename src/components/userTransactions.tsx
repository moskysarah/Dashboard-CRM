import React from 'react'
import type { Transaction } from '../types/domain'


const UserTransactionsLists: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
return (
<section className="bg-white p-4 rounded shadow">
<h3 className="font-semibold mb-3">Mes transactions</h3>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="text-sm text-gray-500">
<tr>
<th>ID</th>
<th>Type</th>
<th>Montant</th>
<th>Statut</th>
<th>Date</th>
</tr>
</thead>
<tbody>
{transactions.map((t, index) => (
<tr key={index} className="border-t">
<td className="py-2">{t.id}</td>
<td>{t.type}</td>
<td>{t.amount} $</td>
<td>{t.status}</td>
<td>{new Date(t.createdAt).toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
)
}


export default UserTransactionsLists