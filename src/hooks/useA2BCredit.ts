import { useState } from "react";
import { removeCredit, transferCredit } from "../api/a2bCredit";

export const useA2BCredit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const remove = async (data: any) => {
    setLoading(true);
    try {
      const res = await removeCredit(data);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const transfer = async (data: any) => {
    setLoading(true);
    try {
      const res = await transferCredit(data);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { remove, transfer, loading, error, result };
};
