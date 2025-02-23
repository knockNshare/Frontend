import React from "react";
import "../styles/ConfirmDeleteModal.css"; // Ajoute un fichier CSS dédié

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message || "Supprimer cet élément ? Cette action est irréversible."}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="delete-button">Supprimer</button>
          <button onClick={onClose} className="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
