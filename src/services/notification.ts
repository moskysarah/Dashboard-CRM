import getNotifications from "./api";
import markNotificationRead from "./api";

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// Récupérer toutes les notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await getNotifications({});
  return response.data;
};

// Marquer une notification comme lue
export const markNotificationAsRead = async (id: string): Promise<void> => {
  await markNotificationRead(id);
};
