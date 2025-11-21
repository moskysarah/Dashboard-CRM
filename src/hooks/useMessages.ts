import { useEffect, useState } from "react";
import { getMessages, getMessageById } from "../api/messages";

export const useMessages = (messageId?: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const data = await getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setError("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (id: string) => {
    try {
      const data = await getMessageById(id);
      setMessage(data);
    } catch {
      setError("Erreur lors du chargement du message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messageId) fetchById(messageId);
    else fetchAll();
  }, [messageId]);

  return { messages, message, loading, error, refresh: fetchAll };
};
