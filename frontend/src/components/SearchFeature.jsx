import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';

const SearchFeature = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    
    if (storedUserId && storedUserId !== "undefined" && storedUserId !== "null") {
        console.log("📌 userId récupéré dans SearchFeature :", storedUserId);
        setUserId(storedUserId);
    } else {
        console.error("❌ Aucun userId trouvé dans localStorage.");
        setError("Aucun utilisateur connecté.");
    }
}, []);

  const handleSearch = async () => {
    if (!userId) {
      alert("❌ Aucun utilisateur connecté. Veuillez vous connecter.");
      return;
    }

    console.log("🔍 Recherche envoyée avec user_id:", userId, "et catégorie:", selectedCategory);

    try {
        const response = await axios.get("http://localhost:3000/api/propositions/search", {
            params: { service_type: selectedCategory, user_id: userId },
        });
        console.log("🔍 Données reçues du backend :", response.data);
        setResults(response.data);
    } catch (error) {
        console.error("❌ Erreur lors de la recherche :", error.response?.data || error);
    }
  };

  return (
    <div>
      <SearchBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onSearch={handleSearch} />
      {error && <p className="error-message">{error}</p>}
      <ResultsList results={results} />
    </div>
  );
};

export default SearchFeature;