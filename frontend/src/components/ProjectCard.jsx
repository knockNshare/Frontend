import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ProjectCard.css";

const ProjectCard = ({ project, userId }) => {
  const [upVotes, setUpVotes] = useState(project.up_votes);
  const [downVotes, setDownVotes] = useState(project.down_votes);
  const [userHasVoted, setUserHasVoted] = useState(null);

  const handleVote = async (voteType) => {
    if (userHasVoted === voteType) return;

    // Vérifier que userId est valide
    const validUserId = Number(userId);
    if (!validUserId) {
      console.error("❌ Erreur: userId invalide :", userId);
      return;
    }

    // Vérifier que voteType est correct
    if (!["up", "down"].includes(voteType)) {
      console.error("❌ Erreur: Type de vote invalide :", voteType);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/projects/${project.id}/vote`,
        { user_id: validUserId, vote: voteType },
        { headers: { "Content-Type": "application/json" } } // ✅ Ajout des headers
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

  return (
    <div className="project-card">
      <div className="project-header">
        <span className="category">{project.category}</span>
        <span className="date">{new Date(project.created_at).toLocaleDateString()}</span>
      </div>

      <h3 className="project-title">
        <Link to={`/projects/${project.id}`}>{project.title}</Link>
      </h3>
      <p className="project-description">
        {project.description.length > 80
          ? project.description.substring(0, 80) + "..."
          : project.description}
      </p>

      <p className="project-author">
        <strong>Par {project.author_name}</strong>
      </p>

      <div className="vote-section">
        {Number(userId) !== Number(project.author_id) ? (
          <>
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
          </>
        ) : (
          <div className="vote-count">
            👍 {upVotes} | 👎 {downVotes}
          </div>
        )}
      </div>


    </div>
  );
};

export default ProjectCard;
