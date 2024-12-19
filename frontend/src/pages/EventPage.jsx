import React, { useState } from 'react';
import EventForm from '../components/EventForm';

const EventPage = () => {
    const [events, setEvents] = useState([]);

    const addEvent = (newEvent) => {
        setEvents([...events, { ...newEvent, id: Date.now() }]);
        alert('Événement ajouté avec succès !');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Gestion des Événements</h1>
            <EventForm onSubmit={addEvent} />
            <div className="mt-6">
                <h2 className="text-lg font-bold mb-2">Liste des Événements</h2>
                {events.length === 0 ? (
                    <p>Aucun événement pour le moment.</p>
                ) : (
                    <ul>
                        {events.map((event) => (
                            <li key={event.id} className="border-b py-2">
                                <strong>{event.name}</strong> - {event.startDate} - {event.category}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EventPage;
