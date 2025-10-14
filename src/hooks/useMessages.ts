import { useState, useEffect, useCallback } from 'react';
import { getMessages, sendMessage as postMessage } from '../services/api';
import { useAuth } from '../store/auth';
import type { Message } from '../types/domain';

export const useMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useAuth((state) => state.user);

    const fetchMessages = useCallback(async () => {
        try {
            // Utilisation de la fonction d'API centralisée
            const res = await getMessages();
            setMessages(res.data.results ?? []);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des messages:", err);
            setError("Impossible de charger les messages.");
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const sendMessage = useCallback(async (content: string): Promise<boolean> => {
        if (!user) {
            console.error("Utilisateur non authentifié, ne peut pas envoyer de message.");
            return false;
        }
        try {
            // L'API spec n'est pas claire sur l'envoi, on se base sur une implémentation logique
            // Utilisation de la fonction d'API centralisée
            await postMessage({
                message: content,
                user: user.id,
            });
            // Après l'envoi, on rafraîchit la liste pour voir le nouveau message
            await fetchMessages();
            return true;
        } catch (err) {
            console.error("Erreur lors de l'envoi du message:", err);
            setError("L'envoi du message a échoué.");
            return false;
        }
    }, [user, fetchMessages]);

    return { messages, loading, error, sendMessage, refreshMessages: fetchMessages };
};