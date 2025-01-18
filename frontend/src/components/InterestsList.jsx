import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/InterestsList.css";
import io from "socket.io-client";
const socket = io("http://localhost:5001");

function InterestsList() {
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Vous devez être connecté pour afficher vos intérêts reçus.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/interests/received/${userId}`);
        setInterests(response.data.data || []);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des intérêts :", error);
        setError(error.response?.data?.error || "Une erreur est survenue.");
      }
    };

    fetchInterests();
  }, []);

  const handleAction = async (interestId, action, interestedUserId, title) => {
    try {
        await axios.put(`http://localhost:3000/interests/${interestId}`, { status: action });

        // Enregistrer la notification
        await axios.post("http://localhost:3000/notifications", {
            user_id: interestedUserId,
            type: `interest_${action}`,
            message: `Votre demande pour "${title}" a été ${action === "accepted" ? "acceptée 🎉" : "refusée ❌"}.`,
            related_entity_id: interestId,
        });

        // Envoyer la notif en temps réel
        socket.emit("send-notification", {
            user_id: interestedUserId,
            message: `Votre demande pour "${title}" a été ${action === "accepted" ? "acceptée 🎉" : "refusée ❌"}.`,
        });

        // Mettre à jour l’état des intérêts affichés
        setInterests((prev) =>
            prev.map((interest) =>
                interest.id === interestId ? { ...interest, status: action } : interest
            )
        );
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'intérêt :", error);
        alert("Une erreur est survenue lors de la mise à jour de l'intérêt.");
    }
};

  const fetchContact = async (interestId, userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}/contact`);
      const contact = response.data.data;

      // Mettre à jour l'état local avec les coordonnées
      setInterests((prevInterests) =>
        prevInterests.map((interest) =>
          interest.id === interestId ? { ...interest, contact } : interest
        )
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des coordonnées :", error);
      alert("Une erreur est survenue lors de la récupération des coordonnées.");
    }
  };

  return (
    <div className="section">
      <h2>Mes Intérêts Reçus</h2>
      {error && <p className="error-message">{error}</p>}
      <ul className="interests-list">
        {interests.length === 0 ? (
          <p>Aucun intérêt reçu pour le moment.</p>
        ) : (
          interests.map((interest) => (
            <li key={interest.id} className="interests-item">
              <div>
                <strong>{interest.proposition_title}</strong>
                <p>
                  {interest.interested_user_name} ({interest.interested_user_email})
                </p>
                <p>
                  <small>Statut : {interest.status}</small>
                </p>
              </div>
              <div className="actions">
              {interest.status === "pending" && (
                <>
                    <button className="accept-btn" onClick={() => handleAction(interest.id, "accepted", interest.interested_user_id, interest.proposition_title)}>
                        ✅ Accepter
                    </button>
                    <button className="reject-btn" onClick={() => handleAction(interest.id, "rejected", interest.interested_user_id, interest.proposition_title)}>
                        ❌ Refuser
                    </button>
                </>
              )}
                {interest.status === "accepted" && !interest.contact && (
                  <button
                    className="show-contact-btn"
                    onClick={() => fetchContact(interest.id, interest.interested_user_id)}
                  >
                    Afficher le contact
                  </button>
                )}
                {interest.status === "rejected" && (
                  <p className="rejected-message">Vous avez refusé cette demande.</p>
                )}
                {interest.contact && (
                  <div className="contact-details">
                    <p>Téléphone : {interest.contact.phone_number}</p>
                    <p>Email : {interest.contact.email}</p>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default InterestsList;