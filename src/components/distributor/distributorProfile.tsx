import React from 'react'
import type { Partner } from '../../types/domain'


const DistributorProfile: React.FC<{ partner: Partner | null }> = ({ partner }) => {
if (!partner) return null
return (
<section className="bg-white p-4 rounded-lg shadow">
<h2 className="text-lg font-semibold mb-3">Profil du distributeur</h2>
<div className="space-y-2 text-sm text-gray-700">
<div><span className="font-medium">Nom :</span> {partner.name}</div>
<div><span className="font-medium">Email :</span> {partner.email}</div>
<div><span className="font-medium">Téléphone :</span> {partner.phone || '—'}</div>
<div><span className="font-medium">Status :</span> <span className={`px-2 py-0.5 rounded ${partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{partner.status}</span></div>
<div><span className="font-medium">Agents :</span> {partner.agents_count ?? '—'}</div>
</div>
</section>
)
}


export default DistributorProfile