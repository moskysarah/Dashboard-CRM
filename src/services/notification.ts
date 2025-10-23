// src/services/notificationService.ts
import api from "../services/api"; // ton instance Axios (déjà utilisée ailleurs)

export interface AppNotification {
  id: number;
  message: string;
  created_at: string;
  updated_at: string;
  is_sent: boolean;
  phone: string;
  is_for: string;
  user: number;
}

export interface NotificationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AppNotification[];
}

export async function getNotifications(params?: { user?: number; is_for?: string }): Promise<NotificationResponse> {
  const response = await api.get<NotificationResponse>("/notification/messages/", { params });
  return response.data;
}
