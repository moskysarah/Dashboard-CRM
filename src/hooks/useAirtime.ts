import { useState } from 'react';
import { airtimePayout } from '../api/wallet';

export const useAirtime = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyAirtime = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await airtimePayout(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Airtime purchase failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    buyAirtime,
    loading,
    error,
  };
};
