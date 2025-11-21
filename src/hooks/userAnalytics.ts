import { useEffect, useState } from "react";
import { getOverview } from "../api/analytics";

export const useAnalytics = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getOverview();
        setOverview(data);
      } catch (err) {
        console.error("Erreur analytics", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { overview, loading };
};
