import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Navbar.css'; // Ajout du fichier CSS

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Charger les notifications
  useEffect(() => {
    if (isAuthenticated) {
      const userId = localStorage.getItem("userId");
      axios.get(`/api/notifications/${userId}`)
        .then((response) => setNotifications(response.data))
        .catch((error) => console.error("Erreur récupération des notifications", error));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-link">🏠 Dashboard</Link>
        <Link to="/profile" className="nav-link">👤 Profil</Link>
        <Link to="/events" className="nav-link">📅 Événements</Link>
      </div>

      {isAuthenticated && (
        <div className="nav-right">
          <Link to="/notifications" className="nav-link notification-icon">
            🔔 {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
          </Link>
          <button onClick={handleLogout} className="logout-button">🚪 Déconnexion</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;