import api from "../services/api"; // instance Axios configuré avec baseurl

export const fetchPosteSmartData = async () => {
  try {
    const response = await api.get("/integration/poste-smart"); // route backend
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données Poste Smart :", error);
    return { partners: [], lastSync: "N/A" }; // valeur par défaut si erreur
  }
};
