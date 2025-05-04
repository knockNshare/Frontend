import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const accessToken = params.get("access_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        const userId = payload.id;

        if (!userId) throw new Error("ID manquant dans le token");

        localStorage.setItem("userId", userId);
        localStorage.setItem("googleAccessToken", accessToken); // c'est l'acessToken à récupérer pour Google Calendar 

        login(userId);

        navigate("/dashboard");
      } catch (error) {
        console.error("❌ Token invalide :", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    } 
  }, []);

  return <div>Connexion avec Google en cours...</div>;
};

export default OAuthSuccess;
