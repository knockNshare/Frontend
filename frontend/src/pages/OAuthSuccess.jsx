import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login, updateGoogleAccessToken } = useAuth(); // Access AuthContext functions

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const accessToken = params.get("access_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const userId = payload.id;

        if (!userId) throw new Error("ID manquant dans le token");

        // Update AuthContext with userId and Google Access Token
        login(userId);
        updateGoogleAccessToken(accessToken);
        console.log("📌 ID utilisateur reçu du token :", userId);
        console.log("📌 Token Google Access reçu :", accessToken);
        
        navigate("/dashboard");
      } catch (error) {
        console.error("❌ Token invalide :", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [login, updateGoogleAccessToken, navigate]);

  return <div>Connexion avec Google en cours...</div>;
};

export default OAuthSuccess;