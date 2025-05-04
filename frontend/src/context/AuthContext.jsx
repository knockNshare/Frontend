import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
  
    console.log("localStorage :", localStorage);

    console.log("📌 Vérification initiale userId dans localStorage :", storedUserId);

    if (storedUserId) {
      setUserId(storedUserId);
    }

    setLoading(false);
  }, []);

  // 🔄 Met à jour `userId` à chaque changement dans localStorage
  const login = (newUserId) => {
    console.log("🔄 Mise à jour du contexte avec userId :", newUserId);
    localStorage.setItem("userId", newUserId);
    setUserId(newUserId);
  };

  // ✅ Correction logout
  const logout = () => {
    console.log("🚪 Déconnexion...");
    localStorage.removeItem("userId");
    localStorage.removeItem("googleAccessToken");
    setUserId(null);
  };

  if (loading) {
    return <div>Chargement de l'authentification...</div>;
  }

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);