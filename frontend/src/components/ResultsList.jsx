import React from "react";
import axios from "axios";
import "../styles/ResultsList.css";

const ResultsList = ({ results }) => {
  const handleRequestInterest = async (propositionId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    // Demander confirmation
    const userConfirmation = window.confirm(
      "En envoyant cette demande, vos informations de contact (numéro de téléphone et email) seront communiquées à l'offreur. Voulez-vous continuer ?"
    );

    if (!userConfirmation) {
      // L'utilisateur a annulé l'action
      return;
    }

    // Obtenir la date actuelle en UTC et la convertir au format MySQL
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

    try {
      const response = await axios.post("http://localhost:3000/interests", {
        proposition_id: propositionId,
        interested_user_id: userId,
        start_date: formattedDate,
        end_date: null, // Si end_date n'est pas nécessaire, on peut laisser null
      });
      alert("Demande d'intérêt envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'intérêt :", error);
      alert(error.response?.data?.error || "Une erreur est survenue.");
    }
  };

  if (results.length === 0) {
    return <p className="results-list-empty">Aucun résultat trouvé.</p>;
  }

  return (
    <ul className="results-list">
      {results.map((result) => (
        <li key={result.id} className="results-list-item">
          <h3 className="results-list-title">{result.title}</h3>
          <p className="results-list-description">{result.description}</p>
          <p className="results-list-distance">Distance : {result.distance} km</p>
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