import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateProjectModal.css";
import { useAuth } from '../context/AuthContext';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const { userId } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !deadline) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/projects", {
        title,
        description,
        category,
        author_id: userId,
        deadline,
      });

      alert("Projet créé avec succès !");
      onProjectCreated(); // Rafraîchit la liste des projets
      onClose(); // Ferme le modal après création

      // Réinitialiser les champs du formulaire après soumission
      setTitle("");
      setDescription("");
      setCategory("");
      setDeadline("");
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
      alert("Erreur lors de la création du projet.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>✖</button>
        <h3>Créer un projet</h3>
        <form onSubmit={handleSubmit}>
          <label>Titre :</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description :</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Catégorie :</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

          <label>Date limite :</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />

          <button type="submit" className="submit-button">Créer le projet</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
