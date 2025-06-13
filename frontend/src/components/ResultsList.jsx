import React from "react";
import axios from "axios";
import "../styles/ResultsList.css";
import io from "socket.io-client";
const socket = io("http://localhost:5001"); // Connexion WebSocket

const ResultsList = ({ results }) => {
  const handleRequestInterest = async (propositionId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/interests", {
        proposition_id: propositionId,
        interested_user_id: userId,
        start_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      const proposeurId = response.data.proposer_id;

      socket.emit("send-notification", {
        user_id: proposeurId,
        message: "Quelqu’un est intéressé par votre annonce !",
        related_entity_id: propositionId,
      });

      alert("Demande envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error);
      alert(error.response?.data?.error || "Une erreur est survenue.");
    }
  };

  return (
    <ul className="results-list">
      {results.map((result) => (
        <li key={result.id} className="results-list-item">
          <h3 className="results-list-title">{result.title}</h3>
          <p className="results-list-description">{result.description}</p>
          <p className="results-list-distance">Distance : {result.distance} km</p>

          
            <div className="telegram-warning">
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                🔔 <strong>Astuce :</strong> Pour être contacté via Telegram par l'offreur, renseignez votre nom d'utilisateur Telegram dans votre profil. Sinon, votre numéro de téléphone sera utilisé.
              </p>
            </div>
          

          <button
            className="results-list-button"
            onClick={() => handleRequestInterest(result.id)}
          >
            Demander
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ResultsList;