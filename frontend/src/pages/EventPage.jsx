import React, { useState } from 'react';
import EventForm from '../components/EventForm';
import DefaultImage from '../assets/default-eventpic.jpg';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

    const addEvent = (newEvent) => {
        const eventWithImage = {
            ...newEvent,
            image: newEvent.image ? URL.createObjectURL(newEvent.image) : DefaultImage,
        };

        const formattedStartDate = new Date(newEvent.startDate).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        const formattedEndDate = newEvent.endDate
            ? new Date(newEvent.endDate).toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            })
            : null;

        setEvents([
            ...events,
            {
                ...eventWithImage,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                id: Date.now(), 
            },
        ]);
        setShowForm(false);
    };

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.some((cat) => event.categories.includes(cat));
        return matchesSearch && matchesCategory;
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

            {showForm && <EventForm onSubmit={addEvent} />}

            <input
                type="text"
                placeholder="Rechercher des événements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
            />

            <div className="flex space-x-2 mb-4">
                {categories.map((category) => (
                    <label key={category} className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => {
                                setSelectedCategories((prev) =>
                                    prev.includes(category)
                                        ? prev.filter((c) => c !== category)
                                        : [...prev, category]
                                );
                            }}
                            className="mr-2"
                        />
                        {category}
                    </label>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="bg-white p-4 shadow rounded">
                        <img
                            src={event.image || DefaultImage}
                            alt={event.name}
                            className="w-full h-40 object-cover mb-2 rounded"
                        />
                        <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                        <p className="text-gray-700 mb-2">
                            {event.description.length > 100
                                ? `${event.description.slice(0, 100)}...`
                                : event.description}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                            {event.endDate ? `Du ${event.startDate} au ${event.endDate}` : event.startDate}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {event.categories.map((category) => (
                                <span key={category} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                    #{category}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventPage;
