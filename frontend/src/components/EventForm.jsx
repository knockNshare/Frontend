import React, { useState } from 'react';

const EventForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        categories: [],
        invitedMembers: [],
        image: null,
    });

    const [showEndDate, setShowEndDate] = useState(false);
    const [nameCharCount, setNameCharCount] = useState(0);
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);

    const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Veuillez indiquer un titre à votre événement');
            return;
        }

        if (!formData.startDate) {
            alert('Veuillez sélectionner une date de début');
            return;
        }

        onSubmit(formData);
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Créer un Nouvel Événement</h2>

            {/* Nom */}
            <div className="relative mb-4">
                <input
                    type="text"
                    maxLength="30"
                    placeholder="Nom de l’événement"
                    value={formData.name}
                    onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setNameCharCount(e.target.value.length);
                    }}
                    className="border p-2 w-full rounded"
                />
                <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                    {nameCharCount}/30
                </span>
            </div>

            {/* Description */}
            <div className="relative mb-4">
                <textarea
                    maxLength="4000"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        setDescriptionCharCount(e.target.value.length);
                    }}
                    className="border p-2 w-full rounded"
                />
                <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                    {descriptionCharCount}/4000
                </span>
            </div>

            {/* Dates et Heures */}
            <div className="flex items-center mb-4">
                <label className="mr-2 font-semibold">{showEndDate ? 'Du :' : 'Le :'}</label>
                <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="border p-2 rounded mr-2"
                />
                <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="border p-2 rounded mr-4"
                    disabled={!formData.startDate}
                />

                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={showEndDate}
                        onChange={() => {
                            setShowEndDate(!showEndDate);
                            if (!showEndDate) {
                                setFormData({ ...formData, endDate: '', endTime: '' });
                            }
                        }}
                        className="mr-2"
                    />
                    Ajouter une date de fin 
                </label>
            </div>

            {showEndDate && (
                <div className="flex items-center mb-4">
                    <label className="mr-2 font-semibold">Au :</label>
                    <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="border p-2 rounded mr-2"
                    />
                    <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="border p-2 rounded"
                        disabled={!formData.endDate}
                    />
                </div>
            )}

            {/* Upload Image */}
            <div className="mb-4">
                <label className="font-semibold block mb-1">Image de présentation :</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Catégories */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Catégories :</h3>
                <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.categories.includes(category)}
                                onChange={() => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        categories: prev.categories.includes(category)
                                            ? prev.categories.filter((c) => c !== category)
                                            : [...prev.categories, category],
                                    }));
                                }}
                                className="mr-2"
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>

            {/* Bouton */}
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
                Créer l’événement
            </button>
        </form>
    );
};

export default EventForm;
