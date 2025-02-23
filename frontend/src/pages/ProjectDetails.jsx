import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import ActionMenu from "../components/ActionMenu";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import "../styles/ProjectDetails.css";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [upVotes, setUpVotes] = useState(0);
    const [downVotes, setDownVotes] = useState(0);
    const [userHasVoted, setUserHasVoted] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/projects/${id}`)
            .then((response) => {
                setProject(response.data);
                setUpVotes(response.data.up_votes);
                setDownVotes(response.data.down_votes);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération du projet :", error);
                setError("Impossible de charger le projet.");
                setLoading(false);
            });
    }, [id]);

    const handleVote = async (voteType) => {
        if (userHasVoted === voteType) return;

        const validUserId = Number(userId);
        if (!validUserId) {
            console.error("❌ Erreur: userId invalide :", userId);
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/api/projects/${project.id}/vote`,
                { user_id: validUserId, vote: voteType },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 201 || response.status === 200) {
                setUserHasVoted(voteType);
                if (voteType === "up") {
                    setUpVotes((prev) => prev + 1);
                    if (userHasVoted === "down") setDownVotes((prev) => prev - 1);
                } else {
                    setDownVotes((prev) => prev + 1);
                    if (userHasVoted === "up") setUpVotes((prev) => prev - 1);
                }
            }
        } catch (error) {
            console.error("❌ Erreur lors du vote :", error.response?.data || error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/projects/${id}`, {
                data: { user_id: Number(userId) } // Envoyer l'ID utilisateur
            });
            navigate("/projects");
        } catch (error) {
            console.error("❌ Erreur lors de la suppression du projet :", error.response?.data || error);
        }
    };


    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="project-details">
            {location.pathname.startsWith("/projects/") && id && (
                <button className="back-button" onClick={() => navigate("/projects")}>
                    ❮
                </button>
            )}

            {/* ✅ Titre + Menu d'actions */}
            <div className="project-header">
                <h1><strong>{project.title}</strong></h1>

                {/* ✅ Menu d'actions, affiché uniquement si l'utilisateur est le créateur */}
                {Number(userId) === Number(project.author_id) && (
                    <ActionMenu
                        onEdit={() => navigate(`/projects/${id}/edit`)}
                        onDelete={() => setShowConfirmDelete(true)}
                    />
                )}
            </div>

            <p><em>{project.category}</em></p>

            <div className="project-description">
                <strong>Description :</strong>
                <ReactMarkdown breaks={true}>{project.description.replace(/\n/g, "  \n")}</ReactMarkdown>
            </div>

            <div className="project-footer">
                <div className="project-info">
                    <p><strong>Auteur :</strong> {project.author_name}</p>
                    <p><strong>Date de création :</strong> {new Date(project.created_at).toLocaleDateString()}</p>
                    <p><strong>Fin des votes :</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                </div>

                {Number(userId) !== Number(project.author_id) ? (
                    <div className="vote-section">
                        <button
                            className={`vote-button ${userHasVoted === "up" ? "active" : ""}`}
                            onClick={() => handleVote("up")}
                        >
                            👍 {upVotes}
                        </button>
                        <button
                            className={`vote-button ${userHasVoted === "down" ? "active" : ""}`}
                            onClick={() => handleVote("down")}
                        >
                            👎 {downVotes}
                        </button>
                    </div>
                ) : (
                    <div className="vote-count">
                        👍 {upVotes} | 👎 {downVotes}
                    </div>
                )}
            </div>

            {/* ✅ Modal de confirmation pour la suppression */}
            <ConfirmDeleteModal
                isOpen={showConfirmDelete}
                onClose={() => setShowConfirmDelete(false)}
                onConfirm={handleDelete}
                message="Supprimer ce projet ? Cette action est irréversible."
            />
        </div>
    );
};

export default ProjectDetails;
