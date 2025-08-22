import React, { useState } from "react";
import { messages } from "../api/fakeAPI";
import type { Message } from "../api/fakeAPI";
import { useTranslation } from "react-i18next";

const Messaging: React.FC = () => {
  const { t } = useTranslation();
  const [msgs, setMsgs] = useState<Message[]>(messages);
  const [newMsg, setNewMsg] = useState("");

  const sendMessage = () => {
    if (newMsg.trim() === "") return;
    const msg: Message = {
      id: msgs.length + 1,
      sender: t("you"),
      content: newMsg,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setMsgs([...msgs, msg]);
    setNewMsg("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">{t("messaging")}</h2>
      <div className="max-h-60 overflow-y-auto mb-4">
        {msgs.map(m => (
          <div key={m.id} className="border-b py-2 last:border-b-0">
            <p className="font-medium">{m.sender}</p>
            <p className="text-gray-600 text-sm">{m.content}</p>
            <p className="text-gray-400 text-xs">{m.date}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
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
