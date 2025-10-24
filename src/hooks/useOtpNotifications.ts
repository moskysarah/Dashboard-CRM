import { useState, useEffect } from "react";
import api from "../services/api";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import type { Message } from "../types/domain";

interface UseNotificationsOptions {
  is_for?: string;
}

export const useNotifications = ({ is_for }: UseNotificationsOptions = {}) => {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const phone = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PHONE);
    if (!phone) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const params: { phone: string; is_for?: string } = { phone };
        if (is_for) {
          params.is_for = is_for;
        }
        const res = await api.get("/notification/messages/", { params });
        setNotifications(res.data.results || []);
      } catch (err) {
        console.error("Erreur récupération notifications :", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // toutes les 5 secondes
    return () => clearInterval(interval);
  }, [is_for]);

  return { notifications, loading };
};
