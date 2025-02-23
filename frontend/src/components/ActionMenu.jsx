import React, { useState } from "react";
import "../styles/ActionMenu.css"; // Ajoute un fichier CSS dédié

const ActionMenu = ({ onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="action-menu-container">
      {/* Bouton "3 points" */}
      <button className="action-menu-button" onClick={() => setShowMenu(!showMenu)}>
        <strong>⋮</strong>
      </button>

      {/* Menu déroulant */}
      {showMenu && (
        <div className="action-menu-dropdown">
          <button onClick={onEdit} className="action-menu-item">✏ Éditer</button>
          <button onClick={onDelete} className="action-menu-item delete">🗑 Supprimer</button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
