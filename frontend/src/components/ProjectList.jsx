import React from "react";
import ProjectCard from "./ProjectCard";
import "../styles/ProjectList.css";

const ProjectList = ({ projects }) => {
  return (
    <div className="project-list">
      {projects.length === 0 ? (
        <p>Aucun projet disponible.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} userId={localStorage.getItem("userId")} />
        ))
      )}
    </div>
  );
};

export default ProjectList;
