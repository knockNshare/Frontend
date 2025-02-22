import React, { useState } from "react";
import ProjectList from "../components/ProjectList";
import CreateProjectModal from "../components/CreateProjectModal";
import "../styles/ProjectsPage.css";

const ProjectsPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleProjectCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="projects-page">
      <div className="header">
        <button className="create-button" onClick={() => setModalOpen(true)}>+ Créer un projet</button>
      </div>
      
      <ProjectList key={refresh} />
      
      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onProjectCreated={handleProjectCreated} />
    </div>
  );
};

export default ProjectsPage;
