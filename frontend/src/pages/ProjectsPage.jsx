import React, { useState, useEffect } from "react";
import ProjectList from "../components/ProjectList";
import CreateProjectModal from "../components/CreateProjectModal";
import "../styles/ProjectsPage.css";
import axios from "axios";

const ProjectsPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [projects, setProjects] = useState([]);
  const userId = localStorage.getItem("userId");

  const handleProjectCreated = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/projects`, {
          params: { user_id: userId, all: showAll },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
      }
    };

    fetchProjects();
  }, [refresh, showAll, userId]);

  return (
    <div className="projects-page">
      <div className="header">
        <button className="create-button" onClick={() => setModalOpen(true)}>
          + Créer un projet
        </button>
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
          Afficher tous les projets
        </label>
      </div>

      <ProjectList projects={projects} />

      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onProjectCreated={handleProjectCreated} />
    </div>
  );
};

export default ProjectsPage;
