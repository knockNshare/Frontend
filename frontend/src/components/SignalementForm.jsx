import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assurez-vous que ce chemin est correct
import '../styles/SignalementForm.css';

const categories = [
    { id: "Dangers", label: "Dangers & Sécurité 🔴", emoji: "🚨" },
    { id: "Urbain", label: "Problèmes Urbains 🏚", emoji: "🏚" },
    { id: "Bruit", label: "Nuisances Sonores 🔊", emoji: "🔊" },
    { id: "Stationnement", label: "Problèmes de Stationnement 🚗", emoji: "🚗" }
];

const SignalementForm = ({ onSignalementAdded }) => {
    const { userId } = useAuth(); // Récupération de l'ID utilisateur
    const [selectedCategorie, setSelectedCategorie] = useState(null);
    const [description, setDescription] = useState('');
    const [critique, setCritique] = useState(false);
    const [quartier, setQuartier] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage("⚠️ Vous devez être connecté pour signaler un problème.");
            return;
        }
        if (!selectedCategorie || !description.trim()) {
            setMessage("⚠️ Veuillez sélectionner une catégorie et décrire le problème.");
            return;
        }

        try {
            await axios.post('http://localhost:3000/signalements', {
                user_id: userId, // Envoi de l'ID utilisateur
                categorie: selectedCategorie,
                description,
                critique,
                quartier
            });
            setMessage("✅ Signalement ajouté avec succès !");
            setSelectedCategorie(null);
            setDescription('');
            setCritique(false);
            setQuartier('');
            if (onSignalementAdded) onSignalementAdded();
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            setMessage("❌ Une erreur est survenue.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signalement-form">
            <h2>⚠️ Décrivez le problème en quelques mots</h2>

            <label>Catégorie :</label>
            <div className="categories-container">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        className={`categorie-btn ${selectedCategorie === cat.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCategorie(cat.id)}
                    >
                        <span style={{ fontSize: "24px" }}>{cat.emoji}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            <label>Description :</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label>Zone du quartier concernée :</label>
            <input type="text" value={quartier} onChange={(e) => setQuartier(e.target.value)} placeholder="Ex: Bâtiment B, entrée de la zone pavillonaire..." />

            <div className="checkbox-container">
                <label>
                    🚨 Notifier tout le quartier ?
                    <input type="checkbox" checked={critique} onChange={(e) => setCritique(e.target.checked)} />
                </label>
            </div>                

            <button type="submit">Envoyer</button>
            {message && <p className="feedback-message">{message}</p>}
        </form>
    );
};

export default SignalementForm;