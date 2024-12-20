import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserProfile.css"; // Lien vers le fichier CSS

function UserProfile() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();

    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId || !title || !description || !userId) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/propositions", {
        category_id: categoryId,
        proposer_id: userId,
        title,
        description,
      });
      setMessage(response.data.message);
      setTitle("");
      setDescription("");
      setCategoryId("");
    } catch (error) {
      console.error("Erreur lors de la déclaration:", error);
      setMessage("Une erreur est survenue lors de la déclaration.");
    }
  };
//Déclarez un service à rendre, un de vos services, objet à prêter ou donner
  return (
    <div className="user-profile">
      <h1>Mon Profil</h1>
      <h2>Déclarez un objet ou un service </h2> 
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Catégorie :</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.service_type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Titre :</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-submit">Déclarer</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <div className="section">
  <h3>Mes Intérêts</h3>
  <ul>
    <li>
      <span>Objet : </span> Caméra
    </li>
    <li>
      <span>Service : </span> Réparation de vélo
    </li>
  </ul>
</div>

<div className="section">
  <h3>Mes Emprunts / Dons</h3>
  <ul>
    <li>
      <span>Emprunt : </span> Perceuse
    </li>
    <li>
      <span>Don : </span> Livres de mathématiques
    </li>
  </ul>
</div>
    </div>
  );
}

export default UserProfile;