import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css"; // Importation du CSS
import SearchFeature from "../components/SearchFeature";
import Notifications from "../components/Notifications";
import UserProfile from "./UserProfile";
import SolidarityEvents from "../components/SolidarityEvents";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Header : Profil utilisateur et notifications */}
      <header className="dashboard-header">
        <Link to="/profile" className="dashboard-profile-link"> {/* Ajoute un lien */}
          <button className="profile-button">Mon Profil</button>
        </Link>
        <Notifications />
      </header>

      {/* Section principale : Barre de recherche et résultats */}
      <main className="dashboard-main">
        <SearchFeature />
      </main>

      {/* Footer (optionnel) : Événements de solidarité */}
      <footer className="dashboard-footer">
        <SolidarityEvents />
      </footer>
    </div>
  );
}

export default Dashboard;