import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PropositionsList.css"

function PropositionsList() {
  const [propositions, setPropositions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropositions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Vous devez être connecté pour afficher vos propositions.");
          return;
        }

        const response = await axios.get(`http://localhost:3000/propositions/users/${userId}`);

        if (response.data.error) {
          console.warn("⚠️ Aucune proposition trouvée.");
          setPropositions([]); // Évite l'erreur
        } else {
          setPropositions(response.data.data || []);
        }

        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des propositions :", error);
        setError(error.response?.data?.error || "Une erreur est survenue.");
      }
    };

    fetchPropositions();
  }, []);

  return (
    <div className="section">
      <h2>Mes Propositions</h2>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {propositions.length === 0 ? (
          <p>Aucune proposition pour le moment.</p>
        ) : (
          propositions.map((prop) => (
            <li key={prop.id}>
              <strong>{prop.title}</strong> - {prop.description}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default PropositionsList;