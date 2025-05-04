import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaArrowLeft } from "react-icons/fa";
import "./Flogin.css";
import logo from "./../assets/LMCS.png";
import audito from "./../assets/audito.png";

const Flogin = () => {
  const [Mails, setMails] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    // Convertir le rôle en minuscule pour correspondre aux routes
    const roleLC = role.toLowerCase();
    const routes = {
      administrateur: "/Confirmation",
      chercheur: "/Accueil",
      assistant: "/AccueilA",
      directeur: "/AccueilDi", 

      autre: "/AcceuilDi"
    };
    navigate(routes[roleLC] || "/accueil");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Mails || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Correction de la regex email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,6}$/;
    if (!emailRegex.test(Mails)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Mails, password }),
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (response.ok) {
        console.log("Connexion réussie:", data);
        setError("");

        // Récupérer les données utilisateur du bon endroit dans la réponse
        const userData = data.data.utilisateur;
        
        // Stocker l'utilisateur dans localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.data.token);

        // Afficher les données stockées avec plus de détails
        console.log("----------- DONNÉES STOCKÉES DANS LOCALSTORAGE -----------");
        console.log("• Utilisateur (brut):", userData);
        console.log("• Token:", data.data.token);
        
        // Récupérer et afficher les données pour vérifier le stockage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");
        console.log("• Utilisateur (récupéré):", storedUser);
        console.log("• Token (récupéré):", storedToken);
        
        // Afficher les détails spécifiques de l'utilisateur
        console.log("----------- DÉTAILS UTILISATEUR -----------");
        console.log("• ID:", userData.utilisateur_id);
        console.log("• Email:", userData.Mails);
        console.log("• Rôle:", userData.Rôle);
        console.log("• Téléphone:", userData.Tél);
        if (userData.chercheur) {
            console.log("• Détails chercheur:", userData.chercheur);
        }
        console.log("--------------------------------------------");

        // Rediriger selon le rôle
        redirectByRole(userData.Rôle);
      } else {
        setError(data.message || "Échec de la connexion.");
      }
    } catch (err) {
      console.error("Erreur lors de la requête:", err);
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
              value={Mails}
              onChange={(e) => setMails(e.target.value)}
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