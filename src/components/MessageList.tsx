import React from "react"
import { useMessages } from "../hooks/useMessages"

const MessageList: React.FC = () => {
  const { messages, loading, error } = useMessages()

  if (loading) return <p>Chargement des messages...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Messages</h2>
      <ul className="space-y-2">
        {messages && messages.length > 0 ? (
          messages.map((msg: any) => (
            <li
              key={msg.id}
              className="p-3 border rounded-lg hover:bg-gray-50 flex flex-col w-full"
            >
              <span className="font-semibold">{msg.title}</span>
              <span className="text-sm text-gray-600">{msg.body}</span>
              <span className="text-xs text-gray-400 mt-1">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <li className="p-3 border rounded-lg text-gray-500">Aucun message disponible</li>
        )}
      </ul>
    </div>
  )
}

export default MessageList
