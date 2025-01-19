import React from 'react';
import DefaultImage from '../assets/default-eventpic.jpg'; // Import de l'image par défaut

const EventDetails = ({ event }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
            <img
                src={event.imageURL || DefaultImage} // Utilisation de l'image par défaut si aucune URL n'est fournie
                alt={event.title}
                className="w-full h-60 object-cover mb-4 rounded"
            />
            <p className="mb-2">{event.description}</p>
            <p className="mb-2 font-semibold">{`Date : ${new Date(event.date).toLocaleString()}`}</p>
            <p className="mb-2">{`Adresse : ${event.address}`}</p>
            {event.category && (
                <p className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm inline-block">
                    {event.category}
                </p>
            )}
        </div>
    );
};

export default EventDetails;
