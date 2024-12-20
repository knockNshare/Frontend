import React from "react";
import "../styles/UserProfile.css";
import { Link } from "react-router-dom";
import DeclareProposition from "../components/DeclareProposition";
import PropositionsList from "../components/PropositionsList";
import InterestsList from "../components/InterestsList.jsx";
import TransactionsList from "../components/TransactionsList";

function UserProfile() {
  return (
    <div className="user-profile">
      {/* Header avec le bouton et le titre */}
      <div className="user-profile-header">
        <Link to="/dashboard" className="dashboard-profile-link">
          <button className="profile-button">Retourner au Dashboard</button>
        </Link>
        <h1>Mon Profil</h1>
      </div>

      {/* Section Déclaration */}
      <DeclareProposition />

      {/* Section Propositions */}
      <PropositionsList />

      {/* Section Intérêts Reçus : toutes les demandes d’intérêt reçues par l’utilisateur pour ses propres propositions.(offreur) */}
      <InterestsList />

      {/* Section Ce que je veux emprunter aux gens : montre toutes les demandes d’intérêt envoyées par l’utilisateur en tant qu’intéressé (intéressé)*/}
      <TransactionsList />
    </div>
  );
}

export default UserProfile;