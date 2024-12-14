import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // pour la connexion à l'API

//Page de connexion
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // pour rediriger après la connexion réussie
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      alert("Tous les champs doivent être remplis");
      setIsLoading(false);
      return;
    }
    try {
      //pour envoyer les données email et password à l’API
      const response = await axios.post('http://localhost:5001/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Connexion réussie !");
        // Stocker le token si nécessaire (exemple : localStorage)
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); // Redirection après connexion
      }

    }
    catch (error) {
      alert("Erreur lors de la connexion. Veuillez réessayer, avec des identifiants valides.");
    }
    finally {
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
          />
        </form>
        {/* lien vers signup */}
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
