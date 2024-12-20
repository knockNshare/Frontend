import React, { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import DefaultImage from '../assets/default-eventpic.jpg';
import axios from 'axios';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const userId = 1; // ID temporaire de l'utilisateur actuel

    // Charger les événements depuis l'API
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements :', error);
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
        fetchEvents();
    }, []);

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {events.map((event) => (
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
            </div>
        </div>
    );
};

export default EventPage;
