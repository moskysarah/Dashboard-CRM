import { useState } from 'react';
import { securityQuestion, securityQuestionConfirm } from '../api/auth';

export const useSecurityQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestSecurityQuestion = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await securityQuestion(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Security question request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmSecurityQuestion = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await securityQuestionConfirm(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Security question confirmation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    requestSecurityQuestion,
    confirmSecurityQuestion,
    loading,
    error,
  };
};
