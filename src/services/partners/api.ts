// import API from "../api"; // ton instance axios

// // Liste tous les partenaires
// export const getPartners = () => API.get("/accounts/partners/");

// // Créer un partenaire
// export const createPartner = (data: any) => API.post("/accounts/partners/", data);

// // Détails d’un partenaire
// export const getPartner = (id: number | string) => API.get(`/accounts/partners/${id}/`);

// // Mettre à jour un partenaire (remplacer)
// export const updatePartner = (id: number | string, data: any) =>
//   API.put(`/accounts/partners/${id}/`, data);

// // Mise à jour partielle
// export const patchPartner = (id: number | string, data: any) =>
//   API.patch(`/accounts/partners/${id}/`, data);

// // Supprimer un partenaire
// export const deletePartner = (id: number | string) =>
//   API.delete(`/accounts/partners/${id}/`);

// // Liste des agents d’un partenaire
// export const getPartnerAgents = (id: number | string) =>
//   API.get(`/accounts/partners/${id}/agents/`);

// // Statistiques de performance d’un partenaire
// export const getPartnerPerformance = (id: number | string) =>
//   API.get(`/accounts/partners/${id}/performance/`);
import API from "../api";

export const getPartners = () => API.get("/accounts/partners/");

export const updatePartnerStatus = (id: number, action: "activate" | "suspend") =>
  API.patch(`/accounts/partners/${id}/`, { action });

export const deletePartner = (id: number | string) => API.delete(`/accounts/partners/${id}/`);
