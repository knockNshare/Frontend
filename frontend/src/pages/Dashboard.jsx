import React from "react";
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
        <UserProfile />
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