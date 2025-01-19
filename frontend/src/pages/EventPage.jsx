import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import EventDetails from '../components/EventDetails';
import DefaultImage from '../assets/default-eventpic.jpg';
import axios from 'axios';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1;

    const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

    // Fetch events and cities from the backend
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const eventsResponse = await axios.get('http://localhost:3000/api/events');
            setEvents(eventsResponse.data);

            const citiesResponse = await axios.get('http://localhost:3000/cities');
            setCities(citiesResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
            setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addEvent = async (newEvent) => {
        try {
            const response = await axios.post('http://localhost:3000/api/events', {
                ...newEvent,
                creator_id: userId,
            });
            setEvents([...events, { ...newEvent, id: response.data.event_id }]);
            setShowForm(false);
            alert('Événement créé avec succès !');
        } catch (error) {
            console.error('Erreur lors de la création de l\'événement :', error);
            alert('Erreur lors de la création de l\'événement.');
        }
    };

    const updateEvent = (id, updatedEvent) => {
        setEvents(events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)));
        setShowDetails(false);
    };

    const deleteEvent = (id) => {
        setEvents(events.filter((event) => event.id !== id));
        setShowDetails(false);
    };

    const fetchEventDetails = async (eventId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/events/${eventId}`);
            setSelectedEvent(response.data);
            setShowDetails(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'événement :', error);
        }
    };

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
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                + Créer un événement
            </button>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <EventForm onSubmit={addEvent} userId={userId} />
                    </div>
                </div>
            )}

            {showDetails && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <EventDetails
                            event={selectedEvent}
                            onDelete={deleteEvent}
                            onUpdate={updateEvent}
                            setShowDetails={setShowDetails}
                        />
                    </div>
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher des événements"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 w-full rounded mb-2"
                />

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
                            className="border p-2 rounded w-60"
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
                    <div
                        key={event.id}
                        className="bg-white p-4 shadow rounded cursor-pointer"
                        onClick={() => fetchEventDetails(event.id)}
                    >
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventPage;
