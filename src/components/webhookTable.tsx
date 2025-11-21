import React from "react"
import { useWebhooks } from "../hooks/usewbhook"

const WebhookTable: React.FC = () => {
  const { status, loading } = useWebhooks()

  if (loading) return <p>Chargement des webhooks...</p>

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Webhooks</h2>
      <p>Statut: {status || "Aucun webhook envoyé"}</p>
    </div>
  )
}

export default WebhookTable
