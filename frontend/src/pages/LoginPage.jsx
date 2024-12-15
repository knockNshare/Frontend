import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();

  // On redirige si le membre est déjà authentifié
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      alert("Tous les champs doivent être remplis");
      setIsLoading(false);
      return;
    }

    try {
      // pour envoyer les données email et password à l’API
      const response = await axios.post('http://localhost:5001/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Connexion réussie !");
        localStorage.setItem('token', response.data.token);
        login(); // pour l'état global
        navigate('/dashboard'); // ça redirige vers le dashboard après la connexion
      }
    } catch (error) {
      alert("Erreur lors de la connexion. Veuillez réessayer, avec des identifiants valides.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <InputField
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            text={isLoading ? "Connexion..." : "Se connecter"}
            disabled={isLoading}
            className="w-full"
          />
        </form>
        <p className="text-center mt-4 text-sm">
          Pas encore inscrit ?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
