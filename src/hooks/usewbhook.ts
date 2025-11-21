import { useState } from "react";
import axios from "axios";

export const useWebhooks = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMaxiCashWebhook = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/webhooks/payments/maxicash/", data);
      setStatus("Webhook envoyé avec succès");
      return res.data;
    } catch (err: any) {
      setStatus("Erreur lors de l’envoi du webhook");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMaxiCashWebhook, status, loading };
};
