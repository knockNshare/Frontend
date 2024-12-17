import React, { useState } from 'react';

const AddUserForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: 'Member',
        email: '',
        status: 'Active',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Le nom est obligatoire';
        if (!formData.email) {
            newErrors.email = 'L\'email est obligatoire';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'L\'adresse email est invalide';
        }
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
        onSave(formData);
        setFormData({ name: '', role: 'Member', email: '', status: 'Active' });
            setErrors({});
        }
    };

    return (
        <div className="flex justify-end">
        <div className="mb-4 p-4 bg-white shadow w-max">
            <h2 className="text-lg font-semibold mb-2">Ajouter un nouvel utilisateur</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4 w-max">
                <div>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded shadow-md"
                />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="border p-2 rounded shadow-md"
                >
                    <option value="Administrator">Administrateur</option>
                    <option value="Moderator">Modérateur</option>
                    <option value="Member">Membre</option>
                </select>
                </div>
                <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 rounded shadow-md"
                />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border p-2 rounded shadow-md"
                >
                    <option value="Active">Actif</option>
                    <option value="Inactive">Inactif</option>
                </select>
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
                Ajouter
            </button>
            <button
                onClick={onCancel}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                Annuler
            </button>
            </div>
        </div>
    );
};

export default AddUserForm;
