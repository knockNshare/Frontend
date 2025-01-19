import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/SearchBar.css";
const SearchBar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  searchedKeywords, 
  setSearchedKeywords, 
  onSearch 
}) => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
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
    setSearchedKeywords(e.target.value); // Update the parent state with the input value
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Update the parent state with the selected category
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(); // Trigger search in parent
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar-input"
        placeholder="Rechercher un objet ou service..."
        value={searchedKeywords} // Bind to parent state
        onChange={handleInputChange} // Update parent state on input change
      />
      
      <select
        className="search-bar-select"
        value={selectedCategory} // Bind to parent state
        onChange={handleCategoryChange} // Update parent state on selection change
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
export default SearchBar ;