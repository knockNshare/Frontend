import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SignalementsPage.css";
import SignalementForm from "../components/SignalementForm";
import SignalementsList from "../components/SignalementsList";
import categoryStyles from "../components/categoryStyles";

/* On trouvera ici :
1. Le formulaire de signalement (rapide et efficace)
2. La liste complète des signalements
3. Un espace “Mes signalements” (avec option pour terminer un signalement) */

const SignalementsPage = () => {
    const [signalements, setSignalements] = useState([]);
    const [mesSignalements, setMesSignalements] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        axios.get("http://localhost:3000/signalements")
            .then((response) => setSignalements(response.data.signalements))
            .catch((error) => console.error("Erreur récupération signalements :", error));

        axios.get(`http://localhost:3000/signalements/utilisateur/${userId}`)
            .then((response) => setMesSignalements(response.data.signalements))
            .catch((error) => console.error("Erreur récupération de mes signalements :", error));
    }, [userId]);

    const handleResoudre = (id) => {
        axios.put(`http://localhost:3000/signalements/${id}/resoudre`, { user_id: userId })
            .then((response) => {
                const updatedSignalement = response.data.signalement;
    
                // ✅ Mettre à jour "Mes signalements"
                setMesSignalements(mesSignalements.map(s => 
                    s.id === id ? { ...s, resolu: true } : s
                ));
    
                // ✅ Mettre à jour "Tous les signalements"
                setSignalements(signalements.map(s => 
                    s.id === id ? { ...s, resolu: true } : s
                ));
            })
            .catch((error) => console.error("Erreur lors de la résolution :", error));
    };

    return (
        <div className="signalements-page">
            <h1 className="page-title">⚠️ Gestion des Signalements</h1>

            {/* FORMULAIRE */}
            <section className="signalements-section">
                <h2>📍 Faire un signalement</h2>
                <SignalementForm />
            </section>

            <section className="signalements-section">
                <h2>📜 Tous les signalements</h2>
                <SignalementsList 
                    signalements={signalements} 
                    limit={100} 
                    showAllLink={false} 
                    handleResoudre={handleResoudre} // ✅ Passer handleResoudre ici
                />
            </section>

            <section className="signalements-section">
                <h2>👤 Mes signalements</h2>
                <SignalementsList 
                    signalements={mesSignalements} 
                    limit={100} 
                    showAllLink={false} 
                    handleResoudre={handleResoudre} // ✅ Même chose ici
                    isMesSignalements={true} // ✅ Indiquer que c'est "mes signalements"
                />
            </section>
        </div>
    );
};

export default SignalementsPage;