import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css"; 
import SearchFeature from "../components/SearchFeature";
import SignalementsList from "../components/SignalementsList";

function Dashboard() {
    const [signalements, setSignalements] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/signalements")
            .then((response) => {
                setSignalements(response.data.signalements); 
            })
            .catch((error) => {
                console.error("Erreur récupération signalements :", error);
            });
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