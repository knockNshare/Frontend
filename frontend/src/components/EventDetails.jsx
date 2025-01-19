import React, { useState } from 'react';
import DefaultImage from '../assets/default-eventpic.jpg';
import EventForm from './EventForm';
import axios from 'axios';

const EventDetails = ({ event, onDelete, onUpdate, setShowDetails }) => {
    const [showActions, setShowActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/events/${event.id}`);
            onDelete(event.id); // Rafraîchir la liste des événements dans le parent
        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement :", error);
        }
    };

    return (
        <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="absolute top-3 right-3 flex items-center space-x-2">
                {/* Bouton pour les actions */}
                {!isEditing && (
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        •••
                    </button>
                )}
                {/* Bouton pour fermer */}
                <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-800"
                >
                    ✖
                </button>
            </div>

            {!isEditing ? (
                <div className="relative">
                    <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
                    <img
                        src={event.imageURL || DefaultImage}
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

                    {showActions && (
                        <div className="absolute top-8 right-0 bg-white shadow-lg rounded p-2">
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setShowActions(false);
                                }}
                                className="flex items-center text-gray-700 hover:text-blue-500 mb-2"
                            >
                                ✏ Modifier
                            </button>
                            <button
                                onClick={() => setShowConfirmDelete(true)}
                                className="flex items-center text-red-500 hover:text-red-700"
                            >
                                🗑 Supprimer
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <EventForm
                    onSubmit={(updatedEvent) => {
                        onUpdate(event.id, updatedEvent);
                        setIsEditing(false);
                    }}
                    initialData={event}
                    isEditing={true}
                />
            )}

            {/* Modal de confirmation de suppression */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p className="mb-4">Supprimer l'événement ? Cette action est irréversible.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Supprimer
                            </button>
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
