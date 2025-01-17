import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import EventPage from './pages/EventPage';
import Navbar from './components/NavBar';


const App = () => {
  const { isAuthenticated } = useAuth(); // Gestion d'authentification propre

  return (
    <Router>
      {/* Affiche la Navbar uniquement si l'utilisateur est connecté */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Pages accessibles sans être connecté */}
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Redirection vers home si un utilisateur non connecté tente d'accéder à une page protégée */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Pages accessibles uniquement si connecté */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/events" element={<EventPage />} />
            {/* Redirection vers le dashboard si un utilisateur connecté tente d'accéder à la page d'accueil */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;