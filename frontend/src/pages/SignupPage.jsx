import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; //pour la connexion à l'API

//Page d'inscription
const SignupPage = () => {
  const [name, setName] = useState(''); //Ajout du nom
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log('Données envoyées à l\'API : ', { name, email, password });
    e.preventDefault();
    // Appel API pour s'inscrire
    if (!name || !email || !password || !confirmPassword) {
      alert("Tous les champs doivent être remplis");
      return;
    }
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/signup', {
        name,
        email,
        password,
      });
  
      if (response.status === 201) {
        alert("Inscription réussie !");
        navigate('/login'); // Redirige vers la page de connexion
        
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error.response || error.message);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    }

  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
      <InputField
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <InputField
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button text="S'inscrire" />
      </form>
      <p>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
};

export default SignupPage;
