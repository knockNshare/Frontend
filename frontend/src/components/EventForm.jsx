import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

const EventForm = ({ onSubmit, initialData = {}, isEditing = false,cityId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        address: '',
        city_id :cityId,
        quartierId: '',
        category: categories[0],
        imageURL: '',
        ...initialData,
    });

    const [quartiers, setQuartiers] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [errorCities, setErrorCities] = useState(null);

    const fetchQuartiers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/quartiers/${cityId}`);
            setQuartiers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des villes :", error);
            setErrorCities("Impossible de charger les villes. Veuillez réessayer.");
        } finally {
            setLoadingCities(false);
        }
    };

    useEffect(() => {
        fetchQuartiers();
    }, []);

    useEffect(() => {
        if (initialData.date) {
            const date = new Date(initialData.date);
            const localISOTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16); // Format datetime-local
            setFormData((prev) => ({ ...prev, date: localISOTime }));
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            try {
                await axios.put(`http://localhost:3000/api/events/${initialData.id}`, formData);
                onSubmit(formData);
            } catch (error) {
                console.error("Erreur lors de la mise à jour :", error);
            }
        } else {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">
                {isEditing ? 'Modifier l\'événement' : 'Créer un Nouvel Événement'}
            </h2>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Titre :</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Description :</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Date :</label>
                <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Adresse :</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Quartier :</label>
                <select
                    value={formData.quartierId}
                    onChange={(e) => setFormData({ ...formData, quartierId: e.target.value })}
                    className="border p-2 w-full rounded"
                >
                    <option value="">-- Sélectionner un quartier --</option>
                    {quartiers.map((quartier) => (
                        <option key={quartier.id} value={quartier.id}>
                            {quartier.name}
                        </option>
                    ))}
                </select>
            </div>

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

            <div className="mb-4">
                <label className="block font-semibold mb-1">URL de l'image :</label>
                <input
                    type="text"
                    value={formData.imageURL}
                    onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                    className="border p-2 w-full rounded"
                />
            </div>

            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
                {isEditing ? 'Mettre à jour' : 'Créer l\'événement'}
            </button>
        </form>
    );
};

export default EventForm;
