import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationRead } from '../services/api';
import { AxiosError } from 'axios';
import type { Message } from '../types/domain';

export const useNotifications = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setMessages(res.data.results ?? []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des notifications :", err);
      if (err instanceof AxiosError && err.response?.status === 401) {
        setError("Token expiré. Veuillez vous reconnecter.");
      } else if (err instanceof AxiosError && err.response?.status === 403) {
        setError("Vous n'avez pas la permission de voir ces notifications.");
      } else {
        setError("Impossible de charger les notifications.");
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Marquer un message comme lu
  const markAsRead = useCallback(async (id: number) => {
    try {
    await markNotificationRead(id.toString()); // <-- conversion ici
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, is_read: true } : msg
      )
    );
  } catch (err) {
    console.error("Erreur lors du marquage du message comme lu :", err);
    setError("Impossible de marquer le message comme lu.");
  }
}, []);

  return { messages, loading, error, fetchMessages, markAsRead };
};
