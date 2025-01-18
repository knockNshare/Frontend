import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SentInterests.css";

function SentInterests() {
  const [sentInterests, setSentInterests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentInterests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Vous devez être connecté pour voir vos demandes envoyées.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/interests/sent/${userId}`);
        setSentInterests(response.data.data || []);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes envoyées :", error);
        setError(error.response?.data?.error || "Une erreur est survenue.");
      }
    };

    fetchSentInterests();
  }, []);

  return (
    <div className="section">
      <h2>📤 Mes Demandes Envoyées</h2>
      {error && <p className="error-message">{error}</p>}
      <ul className="interests-list">
        {sentInterests.length === 0 ? (
          <p className="empty-message">Aucune demande envoyée pour le moment.</p>
        ) : (
          sentInterests.map((interest) => (
            <li key={interest.id} className={`interests-item status-${interest.status}`}>
              <div className="interest-content">
                <strong className="interest-title">{interest.proposition_title}</strong>
                <p>
                  <span className="interest-status">{interest.status === "accepted" ? "✅ Accepté" : interest.status === "rejected" ? "❌ Refusé" : "⏳ En attente"}</span>
                </p>
                {interest.status === "accepted" && interest.proposer_contact && (
                  <p className="contact-info">
                    📧 {interest.proposer_contact.email} <br />
                    📞 {interest.proposer_contact.phone || "Non renseigné"}
                  </p>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default SentInterests;