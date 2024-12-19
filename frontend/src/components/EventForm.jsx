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

    const categories = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];
    
    //il faut encore que j'ajoute les membres invités dans le formulaire

    
    const [nameCharCount, setNameCharCount] = useState(0);
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Veuillez indiquer un titre à votre événement');
            return;
        }
        if (!formData.description) {
            if (!window.confirm('Êtes-vous sûr de vouloir créer un événement sans description ?')) {
                return;
            }
        }
        if (!formData.startDate && !formData.endDate) {
            alert('Veuillez sélectionner au moins une date');
            return;
        }
        if (formData.endDate && formData.startDate) {
            if (formData.endDate < formData.startDate) {
                alert('La date de fin doit être supérieure à la date de début');
                return;
            }
            if (formData.endDate === formData.startDate && formData.endTime < formData.startTime) {
                alert('L’heure de fin doit être supérieure à l’heure de début');
                return;
            }
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
                <span className="mb-2 p-2 absolute bottom-0 right-0 text-xs text-gray-500">
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
                <span className="mb-2 p-2 absolute bottom-0 right-0 text-xs text-gray-500">
                    {descriptionCharCount}/4000
                </span>
            </div>

            {/* Dates */}
            <div className="mb-4">
            <input
                    type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="border p-2 mb-2 w-full rounded"
            />
            <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="border p-2 mb-2 w-full rounded"
                    disabled={!formData.startDate}
                />
            </div>
            <div className="mb-4">
                <input
                    type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="border p-2 mb-2 w-full rounded"
            />
                <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="border p-2 mb-2 w-full rounded"
                    disabled={!formData.endDate}
                />
            </div>

            {/* Upload image */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 mb-2 w-full rounded"
            />

            {/* Catégories */}
            <div className="mb-2">
                <h3 className="font-semibold">Catégories :</h3>
                {categories.map((category) => (
                    <label key={category} className="block">
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

            {/* Bouton */}
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Créer l’événement
            </button>
        </form>
    );
};

export default EventForm;
