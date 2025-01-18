import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/SearchBar.css";

const SearchBar = ({ selectedCategory, setSelectedCategory, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState([]);

  // Récupère les catégories depuis l'API au chargement
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories'); 
        setCategories(response.data);
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Met à jour la catégorie via `setSelectedCategory`
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifie que les champs ne sont pas vides
    if (!inputValue.trim()) {
      alert("❌ Veuillez entrer un mot-clé dans la barre de recherche.");
      return;
    }
    if (!selectedCategory) {
      alert("❌ Veuillez sélectionner une catégorie.");
      return;
    }

    onSearch(); // Déclenche la recherche
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar-input"
        placeholder="Rechercher un objet ou service..."
        value={inputValue}
        onChange={handleInputChange}
      />
      
      <select
        className="search-bar-select"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="" disabled>Choisir une catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.service_type}>{cat.service_type}</option>
        ))}
      </select>

      <button type="submit" className="search-bar-button">
        🔎 Rechercher
      </button>
    </form>
  );
};

export default SearchBar;