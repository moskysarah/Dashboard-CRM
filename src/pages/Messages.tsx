// src/pages/Messages.tsx
import { useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { useMessages } from "../hooks/useMessages"; // Le chemin est déjà bon, mais c'est pour l'exemple
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Messages() {
  const { messages, loading, error, sendMessage } = useMessages();
  const currentUser = useAuth((state) => state.user);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage("");
    }
  };

  if (loading) {
    return <DashboardLayout><p className="p-4">Chargement de la messagerie...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Messagerie interne</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((m) => {
              const isCurrentUser = m.user === currentUser?.id;
              return (
                <div key={m.id} className={`p-3 rounded-lg ${isCurrentUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-xs`}>
                  <p className="font-semibold">
                    {isCurrentUser ? "Moi" : `Utilisateur ${m.user}`}
                  </p>
                  <p className="text-gray-800">{m.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Aucun message pour le moment.</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            onClick={handleSend}
            variant="primary"
            className="w-auto px-4"
          >
            Envoyer
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
