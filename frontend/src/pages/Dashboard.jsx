import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import SearchFeature from "../components/SearchFeature";
import SignalementsList from "../components/SignalementsList";
import DashboardCalendar from "../components/DashboardCalendar";
import { gapi } from "gapi-script"; 
import { useContext } from "react";
import { GoogleAuthContext } from "../context/GoogleAuthProvider";


function Dashboard() {
  const [signalements, setSignalements] = useState([]);
  const [events, setEvents] = useState([]);
  const { token, signIn } = useContext(GoogleAuthContext);



  useEffect(() => {
    // Chargement des signalements (comme avant)
    axios.get("http://localhost:3000/signalements")
      .then((response) => {
        setSignalements(response.data.signalements);
      })
      .catch((error) => {
        console.error("Erreur récupération signalements :", error);
      });

    // WebSocket pour mises à jour temps réel
    if (window.socket) {
      window.socket.on("new-signalement", (newSignalement) => {
        setSignalements((prevSignalements) => [newSignalement, ...prevSignalements.slice(0, 4)]);
      });
    }

    return () => {
      if (window.socket) {
        window.socket.off("new-signalement");
      }
    };
  }, []);


  const loadCalendarEvents = () => {
    if (!token) {
      console.error("Token d'authentification manquant");
      return;
    }
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response) => {
        if (response.result && response.result.items) {
          setEvents(response.result.items);
        } else {
          console.error("Aucun événement trouvé :", response);
        }
      })
      .catch((error) => {
        console.error("Erreur récupération événements Google Calendar :", error);
      });
  };

  useEffect(() => {
    if (token) {
      loadCalendarEvents();
    }
  }, [token]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏠 Mon Dashboard</h1>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-section">
          <SearchFeature />
        </section>

        <section className="dashboard-flex-row">
        {/* Colonne gauche */}
        <div className="dashboard-left">
            <h2 className="text-lg font-bold mb-2">⚠️ Derniers signalements</h2>
            <SignalementsList signalements={signalements} limit={3} showAllLink={true} />
        </div>

        {/* Colonne droite */}
        <div className="dashboard-right">
            <h2 className="text-lg font-bold mb-2">📅 Google Calendar</h2>
            <button onClick={signIn} className="auth-button mb-4">
            Connecter Google Calendar
            </button>
            {!token && (
            <p className="text-red-500 mt-2">Connecte-toi à Google pour voir tes événements</p>
            )}
            <DashboardCalendar events={events} />
        </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
