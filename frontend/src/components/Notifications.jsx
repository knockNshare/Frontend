import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Notifications.css';

const Notifications = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ userId est undefined, impossible de récupérer les notifications.");
      return;
    }

    axios.get(`http://localhost:3000/notifications/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          setNotifications(response.data);
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
        console.log("🔔 Nouvelle notification reçue :", data);
        setNotifications((prev) => [data, ...prev]);
      });
    }
  }, [userId]);

  const deleteNotification = async (notifId) => {
    try {
      await axios.delete(`http://localhost:3000/notifications/${notifId}`);
      setNotifications((prev) => prev.filter(notif => notif.id !== notifId));
    } catch (error) {
      console.error("❌ Erreur suppression notification", error);
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
                <li key={notif.id || `notif-${index}`} className={`notif-item ${notif.type === "danger_alert" ? "notif-danger" : ""}`}>
                  <p className="notif-message">{notif.message}</p>

                  <div className="notif-actions">
                    {/* 🔥 Boutons d'action en fonction du type de notification */}
                    {notif.type === "interest_request" ? (
                      <Link to={`/profile?highlight=${notif.related_entity_id}`} className="view-request-btn">
                        Voir la demande
                      </Link>
                    ) : notif.type.includes("interest") ? (
                      <Link to={`/profile?section=sent_interests`} className="view-request-btn">
                        Voir les réponses
                      </Link>
                    ) : notif.type === "danger_alert" ? (
                      <Link to={`/signalement`} className="view-request-btn-danger">
                        Voir les signalements
                      </Link>
                    ) : null}

                    {/* ❌ Bouton pour supprimer la notification */}
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