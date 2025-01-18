import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import DefaultImage from '../assets/default-eventpic.jpg';
import axios from 'axios';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [cities, setCities] = useState([]); // Liste des villes disponibles
    const [selectedCityId, setSelectedCityId] = useState(''); // Ville sélectionnée pour filtrer
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // ID temporaire de l'utilisateur actuel

    const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

    // Charger les événements et les villes depuis le backend
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Récupérer tous les événements
            const eventsResponse = await axios.get('http://localhost:3000/api/events');
            setEvents(eventsResponse.data);

            // Récupérer la liste des villes
            const citiesResponse = await axios.get('http://localhost:3000/cities');
            setCities(citiesResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
            setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    // Ajouter un événement
    const addEvent = async (newEvent) => {
        try {
            const response = await axios.post('http://localhost:3000/api/events', {
                ...newEvent,
                creator_id: userId,
            });
            setEvents([...events, { ...newEvent, id: response.data.event_id }]);
            setShowForm(false);
        } catch (error) {
            console.error('Erreur lors de la création de l\'événement :', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fonction pour filtrer les événements par catégorie, recherche et ville
    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.some((cat) => event.category.includes(cat));
        const matchesCity = !selectedCityId || String(event.city_id) === String(selectedCityId);
        return matchesSearch && matchesCategory && matchesCity;
    });

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Gestion des Événements</h1>

            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                + Créer un événement
            </button>

            {showForm && <EventForm onSubmit={addEvent} userId={userId} />}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher des événements"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 w-full rounded mb-2"
                />

                {/* Conteneur flex pour aligner les catégories et le menu déroulant */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() =>
                                    setSelectedCategories((prev) =>
                                        prev.includes(category)
                                            ? prev.filter((cat) => cat !== category)
                                            : [...prev, category]
                                    )
                                }
                                className={`px-4 py-2 rounded ${
                                    selectedCategories.includes(category)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="ml-4">
                        <label htmlFor="city-filter" className="block mb-1 font-bold">
                            Filtrer par ville :
                        </label>
                        <select
                            id="city-filter"
                            value={selectedCityId}
                            onChange={(e) => setSelectedCityId(e.target.value)}
                            className="border p-2 rounded w-60" // Fixe la largeur du menu déroulant
                        >
                            <option value="">Toutes les villes</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && <p>Chargement des événements...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="bg-white p-4 shadow rounded">
                        <img
                            src={event.imageURL || DefaultImage}
                            alt={event.title}
                            className="w-full h-40 object-cover mb-2 rounded"
                        />
                        <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-700 mb-2">
                            {event.description.length > 100
                                ? `${event.description.slice(0, 100)}...`
                                : event.description}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                            {`Date : ${new Date(event.date).toLocaleString()}`}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                            {`Adresse : ${event.address}`}
                        </p>
                        {event.category && (
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                {event.category}
                            </span>
                        )}
                    </div>
                ))}
                {!loading && !filteredEvents.length && !error && (
                    <p className="text-gray-500 text-center col-span-3">Aucun événement trouvé.</p>
                )}
            </div>
        </div>
    );
};

export default EventPage;
