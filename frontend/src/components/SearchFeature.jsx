import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';

const SearchFeature = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // on récup le userId depuis localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('Aucun utilisateur connecté.');
    }
  }, []);

  const handleSearch = async ({ query, category }) => {
    try {
      const response = await axios.get('http://localhost:3000/api/propositions/search', {
        params: { // Utilise "params" pour inclure les paramètres dans la requête
          query, 
          service_type: category,
          user_id: userId,
        },
      });

      setResults(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
      setResults([]);
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {error && <p className="error-message">{error}</p>}
      <ResultsList results={results} />
    </div>
  );
};

export default SearchFeature;