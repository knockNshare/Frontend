import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 On récupère login depuis AuthContext
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      alert("⚠️ Tous les champs doivent être remplis !");
      setIsLoading(false);
      return;
    }

    try {
      // 🔥 Envoi des identifiants au backend
      const response = await axios.post('http://localhost:3000/api/login', { email, password });

      if (response.status === 200) {
        alert("✅ Connexion réussie !");
        const { user } = response.data;

        console.log("📌 ID utilisateur reçu du backend :", user.id);

        // 🔥 Stocke immédiatement userId dans localStorage
        localStorage.setItem("userId", user.id);

        // 🔄 Rafraîchit l'AuthContext
        login(user.id);

        // ✅ Vérification après stockage
        console.log("📌 Vérification après stockage, userId =", localStorage.getItem("userId"));

        // 🚀 Redirige vers le dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      alert("❌ Erreur lors de la connexion. Vérifiez vos identifiants.");
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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">Ou</p>
        <a
          href="http://localhost:3000/api/auth/google"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded inline-block transition"
        >
          Se connecter avec Google
        </a>
      </div>


    </div>
  );
};

export default LoginPage;