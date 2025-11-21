import { useState } from 'react';
import { getUserSettings, getUserSettingById } from '../api/me';
import { useAuth } from '../store/auth';

export const useUserSettings = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const { user } = useAuth();

  const canViewOthers = user?.role === 'admin' || user?.role === 'superadmin';

  const fetchUserSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (userId && canViewOthers) {
        response = await getUserSettingById(userId);
      } else {
        response = await getUserSettings();
      }
      setSettings(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSettingById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserSettingById(id);
      setSettings(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user setting');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserSettings,
    fetchUserSettingById,
    settings,
    loading,
    error,
    canViewOthers,
  };
};
