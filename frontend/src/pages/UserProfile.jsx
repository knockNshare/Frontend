import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "../styles/UserProfile.css";
import DeclareProposition from "../components/DeclareProposition";
import PropositionsList from "../components/PropositionsList";
import InterestsList from "../components/InterestsList";
import SentInterests from "../components/SentInterests";

function UserProfile() {
  const location = useLocation();
  const highlightId = new URLSearchParams(location.search).get("highlight");

  useEffect(() => {
    console.log("📌 URL Paramètre highlightId reçu :", highlightId);
  }, [highlightId]);

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <h1>👤 Mon Profil</h1>
      </div>

      <DeclareProposition />
      <PropositionsList />

      <InterestsList highlightId={highlightId} />

      <div id="sent_interests">
        <SentInterests />
      </div>
    </div>
  );
}

export default UserProfile;