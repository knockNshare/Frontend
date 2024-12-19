import React, { useState } from 'react';

const EventForm = ({ onSubmit, currentUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        categories: [], // Catégories sélectionnées
        invitedUsers: [], // Membres invités
    });

    const [showEmptyDescriptionWarning, setShowEmptyDescriptionWarning] = useState(false);

    // Catégories prédéfinies
    const categoriesList = ['Fête', 'Barbecue', 'Sport', 'Culture', 'Musique', 'Réunion'];

    // Liste fictive des membres actifs
    const activeUsers = [
        'Alice Merveille',
        'Bob Eponge',
        'Charles Chaplin',
        'David Copperfield',
        'Elon Maské',
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (value, key) => {
        setFormData((prevState) => {
            const updatedList = prevState[key].includes(value)
                ? prevState[key].filter((item) => item !== value)
                : [...prevState[key], value];

            return { ...prevState, [key]: updatedList };
        });
    };

    const handleSubmit = () => {
        if (!formData.name) {
            alert('Veuillez indiquer un titre à votre événement.');
            return;
        }
        if (!formData.description) {
            setShowEmptyDescriptionWarning(true);
            return;
        }
        onSubmit({ ...formData, creator: currentUser }); // Ajoute le créateur
    };

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Créer un Nouvel Événement</h2>
            <input
                type="text"
                name="name"
                placeholder="Nom de l'événement"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 mb-2 w-full rounded"
            />
            <textarea
                name="description"
                placeholder="Description de l'événement (facultatif)"
                value={formData.description}
                onChange={handleInputChange}
                className="border p-2 mb-2 w-full rounded"
            ></textarea>
            <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="border p-2 mb-2 w-full rounded"
            />
            <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="border p-2 mb-2 w-full rounded"
            />

            {/* Catégories */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Catégories :</h3>
                {categoriesList.map((category) => (
                    <label key={category} className="block mb-1">
                        <input
                            type="checkbox"
                            checked={formData.categories.includes(category)}
                            onChange={() => handleCheckboxChange(category, 'categories')}
                            className="mr-2"
                        />
                        {category}
                    </label>
                ))}
            </div>

            {/* Membres invités */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Inviter des membres :</h3>
                {activeUsers.map((user) => (
                    <label key={user} className="block mb-1">
                        <input
                            type="checkbox"
                            checked={formData.invitedUsers.includes(user)}
                            onChange={() => handleCheckboxChange(user, 'invitedUsers')}
                            className="mr-2"
                        />
                        {user}
                    </label>
                ))}
            </div>

            {/* Pop-up pour description vide */}
            {showEmptyDescriptionWarning && (
                <div className="mb-4 text-yellow-500">
                    <p>Êtes-vous sûr de vouloir créer un événement sans description ?</p>
                    <button
                        onClick={() => {
                            setShowEmptyDescriptionWarning(false);
                            onSubmit({ ...formData, creator: currentUser });
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                        Oui
                    </button>
                    <button
                        onClick={() => setShowEmptyDescriptionWarning(false)}
                        className="bg-gray-300 px-3 py-1 rounded"
                    >
                        Annuler
                    </button>
                </div>
            )}

            {/* Bouton Créer */}
            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                Créer l'événement
            </button>
        </div>
    );
};

export default EventForm;
