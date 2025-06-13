import React, { useEffect, useState } from "react";
import axios from "axios";

function SentInterests() {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(`http://localhost:3000/interests/sent/${userId}`);
        setInterests(response.data.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des intérêts envoyés :", error);
      }
    };

    fetchInterests();
  }, []);

  return (
    <div className="section">
      <h2>📬 Mes Demandes Envoyées</h2>
      <ul className="interests-list">
        {interests.length === 0 ? (
          <p>Aucune demande envoyée.</p>
        ) : (
          interests.map((interest) => (
            <li key={interest.id} className="interests-item">
              <div>
                <strong>{interest.proposition_title}</strong>
                <p><small>Statut : {interest.status}</small></p>
              </div>

              {interest.status === "accepted" && (
                <>
                  <div className="contact-details">
                    <p>📧 {interest.proposer_contact.email}</p>
                    <p>📞 {interest.proposer_contact.phone}</p>
                  </div>

                  {/* <a
                    className="telegram-link-btn"
                    href={`https://t.me/KnockNShareBot?startgroup=loan_${interest.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 Créer un groupe Telegram avec le proposeur
                  </a> */}
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default SentInterests;