import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Notifications.css'; 

const Notifications = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // État pour afficher/cacher le popup

  useEffect(() => {
    if (userId) {
      console.log("📌 userId récupéré dans Notifications :", userId);

      // Charger les notifications existantes
      axios.get(`http://localhost:3000/notifications/${userId}`)
        .then((response) => setNotifications(response.data))
        .catch((error) => console.error("❌ Erreur récupération des notifications", error));

      // 🚀 Écoute des notifications en temps réel via WebSocket
      if (window.socket) {
        window.socket.on(`notification-${userId}`, (data) => {
          console.log("🔔 Nouvelle notification reçue :", data);

          // Ajouter la nouvelle notification à l’état
          setNotifications((prevNotifs) => [data, ...prevNotifs]);
        });
      }
    }
  }, [userId]);

  return (
    <div className="notifications-container">
      <button className="notif-button" onClick={() => setIsOpen(!isOpen)}>
        🔔 {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
      </button>

      {isOpen && (
        <div className="notif-popup">
          {notifications.length === 0 ? (
            <p className="notif-empty">Aucune nouvelle notification</p>
          ) : (
            <ul className="notif-list">
              {notifications.map((notif, index) => (
                <li key={index} className="notif-item">
                  {notif.message}
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