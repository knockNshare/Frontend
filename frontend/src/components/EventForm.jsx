import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

const EventForm = ({ onSubmit, userId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        address: '',
        city_id: '', // Nouveau champ pour city_id
        category: categories[0], // Initialiser avec la première catégorie
        creator_id: userId,
    });

    const [cities, setCities] = useState([]); // Liste des villes récupérées
    const [loadingCities, setLoadingCities] = useState(true); // Indique si les villes sont en cours de chargement
    const [errorCities, setErrorCities] = useState(null); // Erreur lors du chargement des villes

    // Charger les villes depuis le backend
    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/cities');
            setCities(response.data); // Met à jour la liste des villes
        } catch (error) {
            console.error("Erreur lors de la récupération des villes :", error);
            setErrorCities("Impossible de charger les villes. Veuillez réessayer.");
        } finally {
            setLoadingCities(false);
        }
    };

    useEffect(() => {
        fetchCities(); // Charger les villes à l'ouverture du formulaire
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.address || !formData.city_id) {
            alert("Veuillez remplir tous les champs obligatoires.");
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
                <input
                    type="text"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Ville (city_id) */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Ville :</label>
                {loadingCities ? (
                    <p className="text-blue-500">Chargement des villes...</p>
                ) : errorCities ? (
                    <p className="text-red-500">{errorCities}</p>
                ) : (
                    <select
                        value={formData.city_id}
                        onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">-- Sélectionner une ville --</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name} ({city.id})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Catégorie */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Catégorie :</label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border p-2 w-full rounded"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
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
