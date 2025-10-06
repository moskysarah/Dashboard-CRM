
import api from "./api"; 

//  la structure Notification
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  date: string;
  timestamp: string;
}

// je récupérer toutes les notifications depuis l’api
export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notifications");
  return response.data;
};

// marquer une notification comme lue
export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}`, { read: true });
};
