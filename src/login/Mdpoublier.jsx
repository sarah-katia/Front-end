import React, { useState } from "react";
import "./Mdpoublier.css"; // Garde les mêmes styles
import logo from "./../assets/LMCS.png";
import audito from "./../assets/audito.png";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const MdpOublier = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Réinitialiser les messages
    setMessage("");
    setError("");
    setIsLoading(true);
    
    try {
      // Remplacez l'URL par celle de votre API backend
      const response = await fetch("http://localhost:3000/auth/requestreset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Un email de réinitialisation a été envoyé à votre adresse email.");
      } else {
        setError(data.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container2">
      <div className="left-side2">
        <div className="login-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Mot de passe oublié ?</h2>
          <p className="p">Un email vous sera envoyé sur votre boîte email.<br/>Veuillez vérifier votre boîte mail.</p>
          
          {/* Affichage des messages */}
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <button type="submit" className="connect-button" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer l'email"}
            </button>
          </form>
          <Link to="/Flogin" className="back-button12">
            <FaArrowLeft className="back-icon" /> Retour
          </Link>
        </div>
        <button className="back-to-home2">
          <FaArrowLeft className="back-icon" /> Revenir à la page d'accueil
        </button>
      </div>
      <div className="right-side2">
        <img src={audito} alt="Building" className="building-image" />
      </div>
    </div>
  );
};

export default MdpOublier;