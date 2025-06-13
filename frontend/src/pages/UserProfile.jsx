import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import "../styles/UserProfile.css";
import DeclareProposition from "../components/DeclareProposition";
import PropositionsList from "../components/PropositionsList";
import InterestsList from "../components/InterestsList";
import SentInterests from "../components/SentInterests";

function UserProfile() {
  const location = useLocation();
  const highlightId = new URLSearchParams(location.search).get("highlight");

  const [telegramUsername, setTelegramUsername] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [hasTelegram, setHasTelegram] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // on va charger depuis la BDD si le champ est vide
    axios.get(`http://localhost:3000/users/${userId}`)
      .then((res) => {
        const username = res.data.telegram_username;
        if (username) {
          setHasTelegram(true); // Il l’a déjà rempli → on affiche rien
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du pseudo Telegram :", err);
      });
  }, []);

  const handleSaveTelegram = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.put(`http://localhost:3000/users/${userId}/telegram`, {
        telegram_username: telegramUsername,
      });
      setSuccessMessage("✅ Pseudo Telegram enregistré !");
      setHasTelegram(true); // On le cache ensuite
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setErrorMessage("Une erreur est survenue.");
    }
  };

  return (
    <div className="user-profile">
    <div className="user-profile-header">
      <h1>👤 Mon Profil</h1>
    </div>

    <div className="user-settings-wrapper">
  <div className="user-settings-header" onClick={toggleSettings}>
    <span style={{ cursor: "pointer", fontSize: "18px" }}>
      {showSettings ? "▼" : "▶"} Paramètres de contact
    </span>
  </div>

  {showSettings && (
    <div className="user-settings">
      <label htmlFor="telegram">
        <strong>Nom d’utilisateur Telegram (sans @)</strong>
      </label>
      <input
        type="text"
        id="telegram"
        value={telegramUsername}
        onChange={(e) => setTelegramUsername(e.target.value)}
        placeholder="ex: jean_dupont"
      />
      <button onClick={handleSaveTelegram}>Enregistrer</button>
    </div>
  )}
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