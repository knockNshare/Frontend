import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityId, setCityId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // regex pour la force du mot de passe
  const passwordConditions = [
    { regex: /.{8,}/, message: "Au moins 8 caractères" },
    { regex: /[a-z]/, message: "Une lettre minuscule" },
    { regex: /[A-Z]/, message: "Une lettre majuscule" },
    { regex: /\d/, message: "Un chiffre" },
    { regex: /[@$!%*?&]/, message: "Un caractère spécial (@$!%*?&)" },
  ];

  const isConditionMet = (regex) => regex.test(password);

  const allConditionsMet = confirmPassword && passwordConditions.every((condition) =>
    isConditionMet(condition.regex)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!name || !email || !phoneNumber || !password || !confirmPassword || !cityId) {
      alert("Tous les champs doivent être remplis");
      setIsLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        name,
        email,
        phone_number: phoneNumber, // Inclure le numéro de téléphone
        password,
        city_id: cityId,
      });
  
      if (response.status === 201) {
        alert("Inscription réussie !");
        navigate('/dashboard');
      }
    } catch (error) {
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Inscription</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="signup-name"
            name="name"
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <InputField
            id="signup-email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <InputField
              id="signup-city-id"
              name="city-id"
              type="text"
              placeholder="Code postal"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
            />
          <InputField
              id="signup-phone-number"
              name="phone-number"
              type="text"
              placeholder="Numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          <InputField
            id="signup-password"
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {/* Affichage des conditions de force */}
          <ul className="text-sm mb-4">
            {passwordConditions.map((condition, index) => (
              <li
                key={index}
                className={`${
                  isConditionMet(condition.regex) ? "text-green-500" : "text-gray-700"
                }`}
              >
                {condition.message}
              </li>
            ))}
          </ul>
          <InputField
            id="signup-confirm-password"
            name="confirm-password"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            text={isLoading ? "Inscription..." : "S'inscrire"}
            disabled={isLoading || !allConditionsMet}
            className="w-full"
          />
        </form>
        <p className="text-center mt-4 text-sm">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
