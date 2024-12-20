import React, { useState, useEffect } from "react";
import axios from "axios";

function PropositionsList() {
  const [propositions, setPropositions] = useState([]);

  useEffect(() => {
    const fetchPropositions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/propositions");
        setPropositions(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des propositions :", error);
      }
    };

    fetchPropositions();
  }, []);

  return (
    <div className="section">
      <h2>Mes Propositions</h2>
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