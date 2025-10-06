

import api from "./api"; // Import  axios

// la structure d’un message
export interface Message {
  sender: string
  date:string;
  id: string;
  message: string;
  create_at: string;
  update_at: string;
  is_sent: boolean;  
  phone:string;        
  is_for: string; 
  User:number;                                   
 } 

// je récupére tous les messages depuis l’API
export const fetchMessages = async (): Promise<Message[]> => {
  const response = await api.get("/notification/messages");
  return response.data;
};

// pou envoyer un nouveau message
export const postMessage = async (
  data: { message: string; sender: string }
): Promise<Message> => {
  const response = await api.post("/messages", data);
  return response.data;
};
