import React, { useEffect, useState } from "react";
import { useTranslationContext } from "../contexts/translateContext";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
}

const ActivityList: React.FC = () => {
  const { translate } = useTranslationContext();

  // Liste initiale statique (plus besoin de setActivities)
  const activities: Activity[] = [
    { id: "1", title: "Nouvelle réservation", description: "Réservation reçue pour le produit A", date: "2025-08-17 09:30" },
    { id: "2", title: "Paiement confirmé", description: "Paiement de 1200€ confirmé pour Aïdiv", date: "2025-08-17 10:15" },
    { id: "3", title: "Mise à jour profil", description: "Profil utilisateur mis à jour avec succès", date: "2025-08-17 11:00" },
  ];

  const [translatedActivities, setTranslatedActivities] = useState<Activity[]>([]);

  // Traduction asynchrone des titres et descriptions
  useEffect(() => {
    const translateActivities = async () => {
      const results = await Promise.all(
        activities.map(async (activity) => ({
          ...activity,
          title: await translate(activity.title),
          description: await translate(activity.description),
        }))
      );
      setTranslatedActivities(results);
    };

    translateActivities();
  }, [activities, translate]);

  return (
    <div className="activity-list">
      <h2>{translate("Activités Récentes")}</h2>
      <div className="activities-container">
        {translatedActivities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <small>{activity.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
