import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css"; 
import SearchFeature from "../components/SearchFeature";
import SignalementsList from "../components/SignalementsList";

function Dashboard() {
  const [signalements, setSignalements] = useState([]);

  useEffect(() => {
      // 📌 Charger les signalements initiaux
      axios.get("http://localhost:3000/signalements")
          .then((response) => {
              setSignalements(response.data.signalements);
          })
          .catch((error) => {
              console.error("Erreur récupération signalements :", error);
          });

      // 🔥 Connexion WebSocket pour mise à jour en direct
      if (window.socket) {
        // Le dashboard écoute les nouveaux signalements avec windows.socket.on
          window.socket.on("new-signalement", (newSignalement) => {
              console.log("🆕 Nouveau signalement reçu :", newSignalement);

              // 🏷 Ajouter en tête de liste
              setSignalements((prevSignalements) => [newSignalement, ...prevSignalements.slice(0, 4)]); 
          });
      }

      return () => {
          if (window.socket) {
              window.socket.off("new-signalement"); // 🛑 Stopper l'écoute quand on quitte la page
          }
      };
  }, []);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>🏠 Mon Dashboard</h1>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-section">
                    <SearchFeature />
                </section>

               

                <section className="dashboard-section">
                    <h1>⚠️ Derniers signalements</h1>
                    <SignalementsList signalements={signalements} limit={3} showAllLink={true} />
                </section>

                <section className="dashboard-section">
                    <h2>📅 Événements Communautaires</h2>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;