import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import "../styles/ProjectList.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/projects")
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des projets :", error);
      });
  }, []);

  return (
    <div className="project-list">
      {projects.length === 0 ? (
        <p>Aucun projet disponible.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      )}
    </div>
  );
};

export default ProjectList;
