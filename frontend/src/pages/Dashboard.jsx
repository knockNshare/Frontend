import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import SearchFeature from "../components/SearchFeature";
import SignalementsList from "../components/SignalementsList";
import { gapi } from "gapi-script";

const CLIENT_ID = "741897451593-7mjv05taqv633jrtq9imhhf9mdlgm9sk.apps.googleusercontent.com"; // Replace with your Google Client ID
const API_KEY = "AIzaSyDCy6ltlg9ThWq5QjYaHlJawvJ3opvHmEI"; // Replace with your Google API Key
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

function Dashboard() {
    const [signalements, setSignalements] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Initialize Google API client
        const initClient = () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
            });
        };
        gapi.load("client:auth2", initClient);

        // Fetch initial signalements
        axios.get("http://localhost:3000/signalements")
            .then((response) => {
                setSignalements(response.data.signalements);
            })
            .catch((error) => {
                console.error("Erreur récupération signalements :", error);
            });

        // WebSocket for live updates
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

    const handleAuthClick = () => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            loadCalendarEvents();
        });
    };

    const loadCalendarEvents = () => {
        gapi.client.calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime",
        }).then((response) => {
            const events = response.result.items;
            setEvents(events);
        }).catch((error) => {
            console.error("Error fetching calendar events:", error);
        });
    };

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
                    <button onClick={handleAuthClick} className="auth-button">
                        Connect to Google Calendar
                    </button>
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>
                                <strong>{event.summary}</strong> - {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;