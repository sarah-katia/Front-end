import React, { useState } from "react";
import "./Mdpoublier.css"; // Garde les mêmes styles
import logo from "./../assets/LMCS.png";
import audito from "./../assets/audito.png";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const MdpOublier = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ajouter ici la logique pour envoyer l'email au backend
    console.log("Email envoyé à :", email);
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="login-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Mot de passe oublié ?</h2>
          <p>Un email vous sera envoyé sur votre boîte email.<br/>Veuillez vérifier votre boîte mail.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <button type="submit" className="connect-button">
              Envoyer l'email
            </button>
           
          </form>
          <Link to="/" className="back-button">
            <FaArrowLeft className="back-icon" /> Retour
          </Link>
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

export default MdpOublier;
