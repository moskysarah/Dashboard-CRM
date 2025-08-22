import React from 'react';

const ActivityList: React.FC = () => {
  const activities = [
    { id: "1", title: "Nouvelle réservation", description: "Réservation reçue pour le produit A", date: "2025-08-17 09:30" },
    { id: "2", title: "Paiement confirmé", description: "Paiement de 1200€ confirmé pour Aïdiv", date: "2025-08-17 10:15" },
    { id: "3", title: "Mise à jour profil", description: "Profil utilisateur mis à jour avec succès", date: "2025-08-17 11:00" },
  ];

  return (
    <div className="activity-list">
      <h2>Activités Récentes</h2>
      <div className="activities-container">
        {activities.map((activity) => (
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