import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from "socket.io-client";
import { useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import EventPage from './pages/EventPage';
import Navbar from './components/Navbar';
import ProjectsPage from "./pages/ProjectsPage";
import SignalementsPage from './pages/SignalementsPage';

const App = () => {
  const { userId } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false); // ✅ Ajout pour contrôler le chargement

  useEffect(() => {
    if (userId && !window.socket) {
      console.log("🟢 Connexion WebSocket avec userId :", userId);
      window.socket = io("http://localhost:5001", { query: { userId } });

      window.socket.on("connect", () => {
        console.log("✅ WebSocket connecté avec userId :", userId);
        setSocketConnected(true);
      });

      window.socket.on("disconnect", () => {
        console.warn("🔴 WebSocket déconnecté");
        setSocketConnected(false);
      });
    }
  }, [userId]);

  // ✅ Ajout d'un effet pour éviter le blocage en "Chargement..."
  useEffect(() => {
    setTimeout(() => setAppLoaded(true), 500); // Simule un petit délai pour éviter l'affichage trop brutal
  }, []);

  // ✅ Correction : si `userId` est `null` et l'`App` est chargée, on redirige vers `/login`
  if (!appLoaded) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      {userId && <Navbar />}
      <Routes>
        {!userId ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/signalement" element={<SignalementsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;