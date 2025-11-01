import API from "../api";

// Récupérer les paramètres utilisateur
export const getUserSettings = () => API.get("/accounts/user-settings/");

// Mettre à jour les paramètres utilisateur
export const updateUserSettings = (data: any) => API.put("/accounts/user-settings/", data);
