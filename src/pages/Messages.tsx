// src/pages/Messages.tsx
import  { useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";

interface Message {
  id: number;
  sender: string;
  content: string;
  date: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "Admin", content: "Bienvenue sur la messagerie interne", date: "18/08/2025" },
    { id: 2, sender: "Sarah", content: "Merci beaucoup !", date: "19/08/2025" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: messages.length + 1,
      sender: "Moi",
      content: newMessage,
      date: new Date().toLocaleDateString(),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Messagerie interne</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="p-2 rounded bg-gray-50">
              <p className="font-semibold">{m.sender}</p>
              <p>{m.content}</p>
              <span className="text-xs text-gray-500">{m.date}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Envoyer
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
