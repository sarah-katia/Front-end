import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Ajouté
import { FaGoogle, FaArrowLeft } from "react-icons/fa";
import "./Flogin.css";
import logo from "./../assets/LMCS.png";
import audito from "./../assets/audito.png";

const Flogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Hook pour la navigation

  const redirectByRole = (role) => {
    const routes = {
      admin: "/ChercheurA",
      chercheur: "/Accueil",
      assistante: "/AccueilA",
      autre: "/AcceuilDi"
    };
    navigate(routes[role] || "/accueil");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Connexion réussie :", data);
        setError("");

        // Stocker l'utilisateur dans localStorage
        localStorage.setItem("user", JSON.stringify(data.utilisateur));

        // Afficher les données stockées dans localStorage
        console.log("Données stockées dans localStorage : ", localStorage.getItem("user"));

        // Rediriger selon le rôle
        redirectByRole(data.utilisateur.role);

      } else {
        setError(data.message || "Échec de la connexion.");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side1">
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
            <Link to="/Mdpoublier" className="forgot-password">
              Mot de passe oublié ?
            </Link>
            <button type="submit" className="connect-button" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <button type="button" className="google-connect-button">
              <FaGoogle className="google-icon" /> Se connecter avec Google
            </button>
          </form>
        </div>
        <Link to="/" className="back-to-home1">
          <FaArrowLeft className="back-icon" /> Revenir à la page d'accueil
        </Link>
      </div>
      <div className="right-side">
        <img src={audito} alt="Building" className="building-image" />
      </div>
    </div>
  );
};

export default Flogin;
