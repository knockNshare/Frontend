import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ onSubmit, userId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        address: '',
        latitude: '',
        longitude: '',
        category: '',
        creator_id: userId,
    });

    const [addressValid, setAddressValid] = useState(null); // État pour l'adresse (true = valide, false = invalide)
    const [loadingGeo, setLoadingGeo] = useState(false); // Indique si la géolocalisation est en cours

    // Fonction pour récupérer les coordonnées depuis l'adresse
    const fetchCoordinates = async (address) => {
        if (!address) return;
        try {
            setLoadingGeo(true);
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );

            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setFormData((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lon,
                }));
                setAddressValid(true); // Adresse valide
            } else {
                setAddressValid(false); // Adresse invalide
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des coordonnées :", error);
            setAddressValid(false);
        } finally {
            setLoadingGeo(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.address) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        if (!addressValid) {
            alert("Veuillez saisir une adresse valide.");
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Créer un Nouvel Événement</h2>

            {/* Titre */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Titre :</label>
                <input
                    type="text"
                    placeholder="Titre de l'événement"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Description :</label>
                <textarea
                    placeholder="Description de l'événement"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border p-2 w-full rounded"
                ></textarea>
            </div>

            {/* Date */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Date :</label>
                <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Adresse */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Adresse :</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Adresse"
                        value={formData.address}
                        onBlur={() => fetchCoordinates(formData.address)} // Appel API au blur
                        onChange={(e) => {
                            setFormData({ ...formData, address: e.target.value });
                            setAddressValid(null); // Réinitialiser l'état
                        }}
                        className={`border p-2 w-full rounded ${
                            addressValid === true
                                ? 'border-green-500' // Bordure verte si valide
                                : addressValid === false
                                ? 'border-red-500' // Bordure rouge si invalide
                                : ''
                        }`}
                    />
                    {/* Icône de statut */}
                    {addressValid === true && (
                        <span className="absolute right-2 top-2 text-green-500">✅</span>
                    )}
                    {addressValid === false && (
                        <span className="absolute right-2 top-2 text-red-500">❌</span>
                    )}
                </div>
                {loadingGeo && <p className="text-blue-500 text-sm mt-1">Vérification de l'adresse...</p>}
            </div>

            {/* Catégorie */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Catégorie :</label>
                <input
                    type="text"
                    placeholder="Catégorie"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Bouton */}
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
                Créer l'événement
            </button>
        </form>
    );
};

export default EventForm;
