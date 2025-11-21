import { useState } from 'react';
import { otpLogin, requestOtp } from '../api/auth';

export const useOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithOTP = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await otpLogin(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'OTP login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestOtp(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'OTP request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginWithOTP,
    requestOTP,
    loading,
    error,
  };
};
