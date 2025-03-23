import React, { useState } from "react";
import "./Flogin.css"; // Fichier CSS pour le style
import logo from "./../assets/LMCS.png"
import audito from "./../assets/audito.png"
import { FaGoogle } from "react-icons/fa"; // Importez l'icône Google
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Flogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple des champs
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Appel au backend pour authentification
      const response = await fetch("https://your-backend-url.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Authentification réussie
        console.log("Connexion réussie :", data);
        setError(""); // Réinitialiser l'erreur
        // Redirection ou mise à jour du contexte utilisateur
      } else {
        // Gestion des erreurs renvoyées par le backend
        setError(data.message || "Échec de la connexion.");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="login-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Welcome back</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
           <Link to="/Mdpoublier" className="forgot-password">Mot de passe oublié ?</Link>
            <button type="submit" className="connect-button">
              Se connecter
            </button>
            <button className="google-connect-button">
            <FaGoogle className="google-icon" />              Se connecter avec Google
            </button>
          </form>
         
        </div>
        <button className="back-to-home">
        <FaArrowLeft className="back-icon" />          Revenir à la page d'accueil
        </button>
      </div>
      <div className="right-side">
        <img src={audito} alt="Building" className="building-image" />
      </div>
    </div>
  );
};

export default Flogin;