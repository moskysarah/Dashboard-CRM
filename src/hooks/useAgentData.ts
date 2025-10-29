import { useState, useEffect } from 'react'


export const useAgentData = () => {
const [loading, setLoading] = useState(true)
const [profile, setProfile] = useState<any>(null)
const [wallet, setWallet] = useState<any>(null)
const [transactions, setTransactions] = useState<any[]>([])
const [clients, setClients] = useState<any[]>([])


useEffect(() => {
const fetchData = async () => {
try {
// Remplace par tes appels API réels (axios/fetch)
// Exemple : const res = await api.get('/me')
// Ici on met des données mock pour le template
setProfile({ nom: 'Agent Demo', telephone: '+243 99 000 000', zone: 'Kinshasa' })
setWallet({ solde: 245, commissions: 12 })
setTransactions([
{ id: 'T-1', type: 'dépôt', montant: 100, statut: 'réussi', date: new Date().toISOString() },
{ id: 'T-2', type: 'paiement', montant: 50, statut: 'en attente', date: new Date().toISOString() }
])
setClients([
{ id: 'C-1', nom: 'Jean Mbala', telephone: '+243 81 000 111', statut: 'actif' }
])
} catch (err) {
console.error(err)
} finally {
setLoading(false)
}
}


fetchData()
}, [])


return { loading, profile, wallet, transactions, clients }
}


export type UseAgentData = ReturnType<typeof useAgentData>