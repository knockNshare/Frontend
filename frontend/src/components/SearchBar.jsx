import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Récupère les catégories depuis l'API au chargement
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories'); 
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '' && selectedCategory.trim() !== '') {
      onSearch({ query: inputValue, category: selectedCategory });
    }
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
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;