import React from "react";
import { Link } from "react-router-dom";
import "../styles/SignalementsList.css";
import categoryStyles from "./categoryStyles";

// Affiche une liste de signalements (récents ou complets)
// Utilisé dans Dashboard pour afficher les 5 derniers signalements et dans SignalementsPage pour voir tous les signalements.

const SignalementsList = ({ signalements, limit, showAllLink, handleResoudre, isMesSignalements }) => {
    //avant websockets
    return (
        <div className="signalements-container">
            {signalements.length === 0 ? (
                <p className="no-signalement">Aucun signalement récent.</p>
            ) : (
                <ul className="signalement-list">
                    {signalements.slice(0, limit).map((s) => (
                        <li key={s.id} className={`signalement-item ${s.resolu ? 'resolved' : ''}`}>
                            <div className="signalement-header" style={{ background: categoryStyles[s.categorie]?.background }}>
                                {categoryStyles[s.categorie]?.icon} {s.categorie}
                            </div>
                            <div className="signalement-body">
                                <p>{s.description}</p>
                                <span className="signalement-quartier">📍 {s.quartier || "Lieu non précisé"}</span>
                                <span className="signalement-date">🕒 {new Date(s.date_creation).toLocaleString()}</span>
                            </div>
                            {s.resolu ? (
                                <span className="resolved-badge">✅ Résolu</span>
                            ) : (
                                isMesSignalements && ( // ✅ Le bouton n'apparaît que dans "Mes Signalements"
                                    <button className="resolve-btn" onClick={() => handleResoudre(s.id)}>✔️ Marquer comme résolu</button>
                                )
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {showAllLink && <Link to="/signalement" className="voir-plus-btn">Voir tous les signalements</Link>}
        </div>
    );
};

export default SignalementsList;