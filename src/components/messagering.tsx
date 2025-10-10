import React, { useState, useEffect } from "react";
import { useTranslationContext } from "../contexts/translateContext";
import API from "../services/api";

interface Message {
  id: number;
  message: string;
  sender: string;
  date: string;
}

const Messaging: React.FC = () => {
  const { translate } = useTranslationContext();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState("Écrire un message...");

  useEffect(() => {
    // Traduction synchrone si possible
    translate("write_message").then((res) => setPlaceholder(res));

    const fetchMessages = async () => {
      try {
        const response = await API.get("/notification/messages/");
        setMsgs(response.data);
      } catch (error) {
        console.error("Erreur fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [translate]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const message = {
      message: newMsg,
      sender: await translate("you"),
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      user: 0, // à adapter selon ton backend
    };

    try {
      const response = await API.post("/notification/messages/", message);
      setMsgs((prev) => [...prev, response.data]);
      setNewMsg("");
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
      <h2 className="text-lg font-semibold mb-4">{translate("messaging")}</h2>

      {loading ? (
        <p>{translate("loading")}</p>
      ) : (
        <div className="max-h-60 overflow-y-auto mb-4">
          {msgs.map((m) => (
            <div key={m.id} className="border-b py-2 last:border-b-0">
              <p className="font-medium">{m.sender}</p>
              <p className="text-gray-600 text-sm">{m.message}</p>
              <p className="text-gray-400 text-xs">{m.date}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder={placeholder}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {translate("send")}
        </button>
      </div>
    </div>
  );
};

export default Messaging;
