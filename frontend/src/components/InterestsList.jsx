import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/InterestsList.css";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

function InterestsList({ highlightId }) {
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState(null);
  const highlightRef = useRef(null);

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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    socket.on(`notification-${userId}`, (notification) => {
      if (notification.type.startsWith("interest_")) {
        const { related_entity_id, telegramGroupLink } = notification;

        setInterests((prev) => {
          const updated = prev.map((interest) =>
            interest.id === related_entity_id
              ? {
                  ...interest,
                  status: notification.type.split("_")[1],
                  telegramGroupLink: telegramGroupLink || null,
                }
              : interest
          );
          console.log("📨 Interests après update WebSocket :", updated);
          return updated;
        });
        
      }
    });

    return () => {
      socket.off(`notification-${userId}`);
    };
  }, []);

  useEffect(() => {
    if (highlightId) {
      const elementToHighlight = document.getElementById(`interest-${highlightId}`);
      if (elementToHighlight) {
        elementToHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
        elementToHighlight.classList.add("highlight");
        setTimeout(() => elementToHighlight.classList.remove("highlight"), 3000);
      }
    }
  }, [highlightId, interests]);

  const handleAction = async (interestId, action, interestedUserId, title) => {
    try {
      const response = await axios.put(`http://localhost:3000/interests/${interestId}`, { status: action });

      if (action === "accepted") {
        const contactResponse = await axios.get(`http://localhost:3000/users/${interestedUserId}/contact`);
        const contactData = contactResponse.data.data;
      
        const telegramLink = response.data.telegramGroupLink;
      
        setInterests((prev) =>
          prev.map((interest) =>
            interest.id === interestId
              ? {
                  ...interest,
                  status: action,
                  proposerContact: contactData,
                  telegramGroupLink: telegramLink || null
                }
              : interest
          )
        );
      }
       else {
        setInterests((prev) =>
          prev.map((interest) =>
            interest.id === interestId ? { ...interest, status: action } : interest
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'intérêt :", error);
      alert("Une erreur est survenue lors de la mise à jour de l'intérêt.");
    }
  };

  const fetchContact = async (interestId, userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}/contact`);
      const contact = response.data.data;

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
            <li
              key={interest.id}
              id={`interest-${interest.id}`}
              className={`interests-item ${highlightId == interest.id ? "highlight" : ""}`}
            >
              <div>
                <strong>{interest.proposition_title}</strong>
                <p>{interest.interested_user_name} ({interest.interested_user_email})</p>
                <p><small>Statut : {interest.status}</small></p>
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
                {interest.status === "accepted" && (
                  <>
                    {!interest.contact && (
                      <button
                        className="show-contact-btn"
                        onClick={() => fetchContact(interest.id, interest.interested_user_id)}
                      >
                        Afficher le contact
                      </button>
                    )}
                    {interest.contact && (
                      <div className="contact-details">
                        <p>Téléphone : {interest.contact.phone_number}</p>
                        <p>Email : {interest.contact.email}</p>
                      </div>
                    )}
                    {interest.telegramGroupLink && (
                      <a
                        href={interest.telegramGroupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="telegram-link"
                      >
                        📲 Créer un groupe Telegram pour ce prêt
                      </a>
                    )}
                  </>
                )}
                {interest.status === "rejected" && (
                  <p className="rejected-message">Vous avez refusé cette demande.</p>
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