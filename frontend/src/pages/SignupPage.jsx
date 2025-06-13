import React, { useState, useEffect } from 'react';
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
  const [quartiers, setQuartiers] = useState([]);  
  const [selectedQuartier, setSelectedQuartier] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [telegramUsername, setTelegramUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (cityId) {
      fetchQuartiers(cityId);
    }
  }, [cityId]);

  const fetchQuartiers = async (cityId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/quartiers/${cityId}`);
      setQuartiers(response.data);
    } catch (error) {
      console.error("Error fetching quartiers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!name || !email || !phoneNumber || !password || !confirmPassword || !cityId || !selectedQuartier) {
      setErrorMessage("Tous les champs doivent être remplis.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        name,
        email,
        phone_number: phoneNumber,
        password,
        city_id: cityId,
        quartier_id: selectedQuartier, // Only one quartier selected
        telegram_username: telegramUsername
      });

      if (response.status === 201) {
        alert("Inscription réussie !");
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Cette adresse email est déjà utilisée. Veuillez en choisir une autre.");
      } else {
        setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Inscription</h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
        )}
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
          <label>
              Pseudo Telegram (facultatif)
              <input
                type="text"
                placeholder="@username"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
              />
            </label>

          <div className="mb-4">
            <select
              id="quartier-select"
              value={selectedQuartier}
              onChange={(e) => setSelectedQuartier(e.target.value)}
              className={`w-full p-4 border rounded-md bg-white 
                          ${selectedQuartier ? "text-black" : "text-gray-400"}`}
            >
              <option value="" disabled>
                Quartier
              </option>
              {quartiers.map((quartier) => (
                <option key={quartier.id} value={quartier.id}>
                  {quartier.name}
                </option>
              ))}
            </select>
          </div>


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
            disabled={isLoading || !selectedQuartier}
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
