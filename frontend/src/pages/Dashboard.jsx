import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import SearchFeature from "../components/SearchFeature";
import SignalementsList from "../components/SignalementsList";
import DashboardCalendar from "../components/DashboardCalendar";
import { gapi } from "gapi-script";
import { useAuth } from "../context/AuthContext"; // Use AuthContext for authentication state

function Dashboard() {
  const [signalements, setSignalements] = useState([]);
  const [events, setEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]); // Events the user is participating in
  const { userId,googleAccessToken, linkGoogleAccount } = useAuth(); // Access googleAccessToken and linkGoogleAccount from AuthContext

  useEffect(() => {
    // Load signalements
    axios
      .get("http://localhost:3000/signalements")
      .then((response) => {
        setSignalements(response.data.signalements);
      })
      .catch((error) => {
        console.error("Erreur récupération signalements :", error);
      });

    // WebSocket for real-time updates
    if (window.socket) {
      window.socket.on("new-signalement", (newSignalement) => {
        setSignalements((prevSignalements) => [
          newSignalement,
          ...prevSignalements.slice(0, 4),
        ]);
      });
    }
     // Fetch events the user is participating in
     if (userId) {
      axios
        .get(`http://localhost:3000/api/user/events/${userId}`)
        .then((response) => {
          setParticipatingEvents(response.data); // Store participating events
        })
        .catch((error) => {
          console.error("Erreur récupération des événements de l'utilisateur :", error);
        });
    }

    return () => {
      if (window.socket) {
        window.socket.off("new-signalement");
      }
    };
  }, [userId]);

  const loadCalendarEvents = async () => {
    if (!googleAccessToken) {
      console.error("Token d'authentification Google manquant");
      return;
    }
  
    try {
      console.log("Chargement des événements Google Calendar avec le token :", googleAccessToken);
      gapi.client.setToken({ access_token: googleAccessToken }); // Set the token for gapi
      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      });
  
      console.log("Google Calendar API Response:", response);
      if (response.result && response.result.items) {
        setEvents(response.result.items); // Set events if they exist
      } else {
        console.warn("Aucun événement trouvé ou réponse invalide :", response);
        setEvents([]); // Set an empty array if no events are found
      }
    } catch (error) {
      console.error("Erreur récupération événements Google Calendar :", error);
      setEvents([]); // Set an empty array in case of an error
    }
  };
  useEffect(() => {
    if (googleAccessToken) {
      loadCalendarEvents();
    }
  }, [googleAccessToken]);

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
          {/* Left Column */}
          <div className="dashboard-left">
            <h2 className="text-lg font-bold mb-2">⚠️ Derniers signalements</h2>
            <SignalementsList
              signalements={signalements}
              limit={3}
              showAllLink={true}
            />
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            <h2 className="text-lg font-bold mb-2">📅 Google Calendar</h2>
            {!googleAccessToken && (
              <>
                <button
                  onClick={linkGoogleAccount}
                  className="auth-button mb-4"
                >
                  Connecter Google Calendar
                </button>
                <p className="text-red-500 mt-2">
                  Connecte-toi à Google pour voir tes événements
                </p>
              </>
            )}
            <DashboardCalendar events={events} />
          </div>
        </section>
         {/* Participating Events Section */}
         <section className="dashboard-section">
          <h2 className="text-lg font-bold mb-2">📅 Événements auxquels vous participez</h2>
          {participatingEvents.length === 0 ? (
            <p>Vous ne participez à aucun événement pour le moment.</p>
          ) : (
            <ul className="participating-events-list">
              {participatingEvents.map((event) => (
                <li key={event.id} className="bg-white p-4 shadow rounded mb-2">
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-gray-700">{event.description}</p>
                  <p className="text-sm text-gray-500">
                    {`Date : ${new Date(event.date).toLocaleString()}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;