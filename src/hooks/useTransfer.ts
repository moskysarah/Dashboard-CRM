import { useState } from "react";
import { initiateMerchantTransfer, verifyMerchantTransfer } from "../api/me";

export const useTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'initiate' | 'verify' | 'complete'>('initiate');

  const initiateTransfer = async (data: any) => {
    setLoading(true);
    try {
      const res = await initiateMerchantTransfer(data);
      setResult(res);
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyTransfer = async (data: any) => {
    setLoading(true);
    try {
      const res = await verifyMerchantTransfer(data);
      setResult(res);
      setStep('complete');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { initiateTransfer, verifyTransfer, loading, error, result, step };
};
