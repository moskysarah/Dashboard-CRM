import API from "../api";

// Récupérer les paramètres utilisateur (propres)
export const getUserSettings = () => API.get("/accounts/user-settings/");

// Récupérer les paramètres utilisateur par ID (pour admin)
export const getUserSettingsById = (id: string | number) => API.get(`/accounts/user-settings/${id}/`);

// Mettre à jour les paramètres utilisateur
export const updateUserSettings = (data: any) => API.put("/accounts/user-settings/", data);
