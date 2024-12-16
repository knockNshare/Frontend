import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // pour empêcher le Header d'apparaître sur /login et /signup
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/" className="text-gray-800 hover:text-blue-600">
          KnockNShare
        </Link>
      </div>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Se connecter
            </Link>
            <Link
              to="/signup"
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              S'inscrire
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;