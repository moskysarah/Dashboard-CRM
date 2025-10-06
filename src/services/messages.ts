import api from "./api";

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

export const fetchMessages = async (): Promise<Message[]> => {
  const response = await api.get('/messages');
  return response.data;
};

export const postMessage = async (
  data: { text: string; sender: string }
): Promise<Message> => {
  const response = await api.post('/messages', data);
  return response.data;
};
