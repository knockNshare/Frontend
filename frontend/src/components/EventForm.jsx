import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

const EventForm = ({ onSubmit, userId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        address: '',
        city_id: '',
        category: categories[0],
        imageURL: '', // Champ pour l'URL de l'image
        creator_id: userId,
    });

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [errorCities, setErrorCities] = useState(null);
    const [errorImage, setErrorImage] = useState(null); // État pour les erreurs d'image

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/cities');
            setCities(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des villes :", error);
            setErrorCities("Impossible de charger les villes. Veuillez réessayer.");
        } finally {
            setLoadingCities(false);
        }
    };

    const handleImageValidation = async () => {
        if (!formData.imageURL) return;

        try {
            const response = await fetch(formData.imageURL);
            if (!response.ok) {
                throw new Error('Invalid image');
            }
        } catch {
            setErrorImage('Impossible de charger l\'image. Une image par défaut sera utilisée.');
            setFormData({ ...formData, imageURL: '' }); // Réinitialise l'URL si invalide
            setTimeout(() => setErrorImage(null), 5000); // Efface le message après 5 secondes
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleImageValidation(); // Valider l'image avant soumission
        if (!formData.title || !formData.date || !formData.address || !formData.city_id) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Créer un Nouvel Événement</h2>

            {/* Notification d'erreur d'image */}
            {errorImage && <p className="text-red-500 text-center mb-4">{errorImage}</p>}

            {/* Titre et URL de l'image */}
            <div className="mb-4 flex items-center gap-4">
                <div className="flex-1">
                    <label className="block font-semibold mb-1">Titre :</label>
                    <input
                        type="text"
                        placeholder="Titre de l'événement"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div className="flex-1">
                    <label className="block font-semibold mb-1">URL de l'image :</label>
                    <input
                        type="text"
                        placeholder="https://exemple.com/image.jpg"
                        value={formData.imageURL}
                        onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                </div>
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

            {/* Ville */}
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
