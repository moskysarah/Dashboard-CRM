import API from "../api";

//  Récupérer toutes les commissions
export const getAllCommissions = () => API.get("/accounts/commission/");

//  Mettre à jour le statut d’une commission
export const updateCommissionStatus = (id: number, data: any) =>
  API.patch(`/accounts/commission/${id}/`, data);
