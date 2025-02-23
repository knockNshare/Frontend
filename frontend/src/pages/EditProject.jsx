import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditProject.css"; // Assurez-vous d'avoir ce fichier pour le style

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({
        title: "",
        description: "",
        category: "",
        deadline: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        axios
            .get(`http://localhost:3000/api/projects/${id}`)
            .then((response) => {
                if (Number(response.data.author_id) !== Number(userId)) {
                    navigate("/projects"); // Redirige si l'utilisateur n'est pas le créateur
                } else {
                    setProject({
                        title: response.data.title,
                        description: response.data.description,
                        category: response.data.category,
                        deadline: response.data.deadline.split("T")[0], // Formater la date pour l'input
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération du projet :", error);
                setError("Impossible de charger le projet.");
                setLoading(false);
            });
    }, [id, userId, navigate]);

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProject = {
            ...project,
            user_id: Number(localStorage.getItem("userId")),
        };

        try {
            await axios.put(
                `http://localhost:3000/api/projects/${id}`,
                updatedProject,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            navigate(`/projects/${id}`);
        } catch (error) {
            console.error("❌ Erreur lors de la mise à jour du projet :", error.response?.data || error);
        }
    };



    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="edit-project-container">
            <h2>Modifier le projet</h2>
            <form onSubmit={handleSubmit}>
                <label>Titre :</label>
                <input
                    type="text"
                    name="title"
                    value={project.title}
                    onChange={handleChange}
                    required
                />

                <label>Description :</label>
                <textarea
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    required
                />

                <label>Catégorie :</label>
                <input
                    type="text"
                    name="category"
                    value={project.category}
                    onChange={handleChange}
                    required
                />

                <label>Date limite :</label>
                <input
                    type="date"
                    name="deadline"
                    value={project.deadline}
                    onChange={handleChange}
                    required
                />

                <div className="button-group">
                    <button type="submit" className="update-button">Mettre à jour</button>
                    <button type="button" className="cancel-button" onClick={() => navigate(`/projects/${id}`)}>Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default EditProject;
