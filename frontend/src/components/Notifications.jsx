import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Notifications.css'; 
import { use } from 'react';

const Notifications = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ userId est undefined, impossible de récupérer les notifications.");
      return;
    }

    console.log("📌 userId récupéré dans Notifications :", userId);

    axios.get(`http://localhost:3000/notifications/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          setNotifications(response.data);
          console.log("📩 Notifications récupérées :", response.data);
        } else {
          console.warn("⚠️ Aucune notification trouvée.");
          setNotifications([]);
        }
      })
      .catch((error) => {
        console.error("❌ Erreur récupération des notifications", error);
      });

    if (window.socket) {
      window.socket.off(`notification-${userId}`);

      window.socket.on(`notification-${userId}`, (data) => {
        console.log("🔔 Nouvelle notification reçue :", JSON.stringify(data, null, 2));
      
        if (!data.id || !data.related_entity_id) {
          console.warn("⚠️ La notification reçue est invalide :", data);
          return;
        }

        setNotifications((prevNotifs) => {
          const alreadyExists = prevNotifs.some(notif => notif.id === data.id);
          return alreadyExists ? prevNotifs : [data, ...prevNotifs];
        });
      });
    }
  }, [userId]);

  const deleteNotification = async (notifId) => {
    if (!notifId) {
      console.warn("⚠️ Impossible de supprimer : notifId est undefined.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/notifications/${notifId}`);
      setNotifications((prev) => prev.filter(notif => notif.id !== notifId));
      console.log(`🗑️ Notification ${notifId} supprimée.`);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de la notification", error);
    }
  };

  const clearAllNotifications = async () => {
    if (!userId) {
      console.warn("⚠️ Impossible de supprimer toutes les notifications : userId est undefined.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/notifications/all/${userId}`);
      setNotifications([]);
      console.log(`🗑️ Toutes les notifications de l'utilisateur ${userId} supprimées.`);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression des notifications", error);
    }
  };

  return (
    <div className="notifications-container">
      <button className="notif-button" onClick={() => setIsOpen(!isOpen)}>
        🔔 {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
      </button>

      {isOpen && (
        <div className="notif-popup">
          <div className="notif-header">
            <span>📩 Notifications</span>
            {notifications.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllNotifications}>🗑️ Tout supprimer</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="notif-empty">Aucune nouvelle notification</p>
          ) : (
            <ul className="notif-list">
            {notifications.map((notif, index) => (
              <li key={notif.id || `notif-${index}`} className="notif-item">
                {/* 🏷️ Ajout de la classe notif-message pour bien styliser le texte */}
                <p className="notif-message">{notif.message}</p> 

                <div className="notif-actions">
                  {/* 🔥 Ajout de classes aux boutons pour bien les styliser */}
                  {notif.type === "interest_request" ? (
                    <Link to={`/profile?highlight=${notif.related_entity_id}`} className="view-request-btn">
                      Voir la demande
                    </Link>
                  ) : notif.type.includes("interest") ? (
                    <Link to={`/profile?section=sent_interests`} className="view-request-btn">
                      Voir les réponses
                    </Link>
                  ) : null}

                  {/* ❌ Bouton pour supprimer la notif bien stylisé */}
                  <button className="delete-notif-btn" onClick={() => deleteNotification(notif.id)}>❌</button>
                </div>
              </li>
            ))}
          </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;