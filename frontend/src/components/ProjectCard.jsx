import React, { useState } from "react";
import axios from "axios";
import "../styles/ProjectCard.css";
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  const [upVotes, setUpVotes] = useState(project.up_votes || 0);
  const [downVotes, setDownVotes] = useState(project.down_votes || 0);

  const { userId } = useAuth();

  const handleVote = (voteType) => {
    axios.post(`http://localhost:3000/api/projects/${project.id}/vote`, { user_id: userId, vote: voteType })
      .then(response => {
        if (voteType === "up") {
          setUpVotes(upVotes + 1);
        } else {
          setDownVotes(downVotes + 1);
        }
      })
      .catch(error => {
        console.error("Erreur lors du vote :", error.response.data);
      });
  };

  return (
    <div className="project-card">
      <div className="header">
        <span className="category">{project.category}</span>
        <span className="date">{new Date(project.created_at).toLocaleDateString()}</span>
      </div>
      <h3 className="title" onClick={() => setExpanded(!expanded)}>
        {project.title}
      </h3>
      <p className="description">
        {expanded ? project.description : project.description.substring(0, 100) + "..."}
      </p>
      <div className="footer">
        <span className="author">Par {project.author_name}</span>
        {project.author_id !== userId && (
          <div className="vote-buttons">
            <button onClick={() => handleVote("up")} className="upvote">👍 {upVotes}</button>
            <button onClick={() => handleVote("down")} className="downvote">👎 {downVotes}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
