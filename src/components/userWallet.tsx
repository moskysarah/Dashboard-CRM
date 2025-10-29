import React from 'react'


const UserWallet: React.FC<{ wallet: { balance: number; updatedAt: string } | null }> = ({ wallet }) => {
if (!wallet) return null


return (
<section className="bg-white p-4 rounded shadow">
<h3 className="font-semibold mb-3">Mon wallet</h3>
<div className="text-2xl font-bold">{wallet.balance} $</div>
<div className="text-sm text-gray-500">Dernière mise à jour: {new Date(wallet.updatedAt).toLocaleString()}</div>
</section>
)
}


export default UserWallet