import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import EventDetails from '../components/EventDetails';
import DefaultImage from '../assets/default-eventpic.jpg';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityId, setCityId] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useAuth();
    

    const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

    // Fetch events and cities from the backend
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("user id", userId);
    
            // Fetch user city ID
            const cityResponse = await axios.get(`http://localhost:3000/users/city/${userId}`);
            const userCityId = cityResponse.data.data.city_id; // Correct way to access city_id
            setCityId(userCityId);
            console.log("userCityId is", userCityId);
    
            // Fetch events related to the city with participation status
            const eventsResponse = await axios.get(`http://localhost:3000/api/events/region/${userCityId}`, {
                params: { user_id: userId },
            });
            console.log("events", eventsResponse);
            setEvents(eventsResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
            setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchFilteredEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/events/search', {
                params: {
                    keyword: searchTerm,
                    categories: selectedCategories.join(','), // Join selected categories to send in the request
                    cityId: cityId,
                    user_id: userId, // Pass user_id to get participation status
                },
            });
            setEvents(response.data); // Update events with filtered results
        } catch (error) {
            console.error('Erreur lors de la recherche des événements :', error);
            setError('Impossible de charger les événements filtrés.');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchFilteredEvents();
    }, [searchTerm, selectedCategories]); // Fetch filtered events whenever filters change

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
    const toggleParticipation = async (eventId) => {
        try {
            const event = events.find((e) => e.id === eventId);
            if (event.isParticipating) {
                console.log("user", userId,"is participating in the event", eventId);
                await axios.delete('http://localhost:3000/api/events/leave', {
                    data: { event_id: eventId, user_id: userId }, // Ensure correct data is sent
                });
                alert('You have left the event.');
            } else {
                await axios.post('http://localhost:3000/api/events/participate', {
                    event_id: eventId,
                    user_id: userId,
                });
                alert('You have joined the event.');
            }
            // Update the event's participation status
            setEvents((prevEvents) =>
                prevEvents.map((e) =>
                    e.id === eventId ? { ...e, isParticipating: !e.isParticipating } : e
                )
            );
        } catch (error) {
            console.error('Error toggling participation:', error);
            alert('An error occurred. Please try again.');
        }
    };
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
                        <EventForm onSubmit={addEvent} userId={userId} cityId={cityId}/>
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
                                className={`px-4 py-2 rounded ${selectedCategories.includes(category) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {loading ? (
        <p>Chargement des événements...</p>
    ) : events.length === 0 ? (
        <p>Il n'y a pas encore des événements dans votre ville.</p>
    ) : (
        events.map((event) => (
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
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        toggleParticipation(event.id);
                    }}
                    className={`px-4 py-2 rounded ${
                        event.isParticipating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}
                >
                    {event.isParticipating ? 'Leave' : 'Participate'}
                </button>
            </div>
        ))
    )}
</div>

        </div>
    );
};

export default EventPage;
