import React, { useState, useEffect } from "react";
import type { Message } from "../services/messages";
import { fetchMessages, postMessage } from "../services/messages";
import { useTranslation } from "react-i18next";

const Messaging: React.FC = () => {
  const { t } = useTranslation();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages()
      .then((data) => {
        setMsgs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sendMessage = async () => {
    if (newMsg.trim() === "") return;

    //ajout de tous les champs du type Message
    const message: Omit<Message, "id" | "timestamp"> = {
      sender: t("you"),
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      message: newMsg,
      create_at: "",
      update_at: "",
      is_sent: false,
      phone: "",
      is_for: "",
      User: 0
    };

    try {
      const saved = await postMessage(message);
      if (saved) {
        setMsgs((prev) => [...prev, saved]);
        setNewMsg("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">{t("messaging")}</h2>

      {loading ? (
        <p>{t("loading")}</p>
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
          placeholder={t("write_message")}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {t("send")}
        </button>
      </div>
    </div>
  );
};

export default Messaging;
