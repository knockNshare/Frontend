import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') // Si un token est présent, on considère l'utilisateur connecté (TODO: vérifier si le token est encore valide)
  );

  const login = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token); // token stocké
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // token supprimé au moment de la déconnexion
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Si un token existe, l'utilisateur est authentifié
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
