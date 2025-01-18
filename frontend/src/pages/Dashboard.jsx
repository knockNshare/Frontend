import React from "react";

import "../styles/Dashboard.css"; 
import SearchFeature from "../components/SearchFeature";


function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏠 Mon Dashboard</h1>
      </header>

      <main className="dashboard-main">
        {/* Barre de recherche */}
        <section className="dashboard-section">
          <SearchFeature />
        </section>

        {/* Accès aux événements */}
        <section className="dashboard-section">
          <h2>📅 Événements Communautaires</h2>
          
        </section>
      </main>

      <footer className="dashboard-footer">
       
      </footer>
    </div>
  );
}

export default Dashboard;