import { useEffect, useState, useCallback } from "react";
import { getAgents, getAgentById } from "../api/agents";
import { useAuth } from "../context/AuthContext";
import type { Agent } from "../types/Agent";

export const useAgents = () => {
  const [data, setData] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAgents();
      // Handle different response structures
      const agents = Array.isArray(response) ? response : (response?.results || response?.data || []);
      setData(agents);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur de chargement des agents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { data, loading, error, refetch: fetchAgents };
};

export const useAgentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getAgentById(user.id.toString());
      setProfile(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur de chargement du profil");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};
