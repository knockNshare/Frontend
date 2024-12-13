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
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text="Se connecter" />
      </form>
      <p>
        Pas encore inscrit ? <Link to="/signup">Créer un compte</Link>
      </p>
    </div>
  );
};

export default LoginPage;
