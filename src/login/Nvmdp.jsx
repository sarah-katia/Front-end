import React, { useState } from "react";
import "./Nvmdp.css";
import logo from "./../assets/LMCS.png";
import audito from "./../assets/audito.png";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Nvmdp = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    console.log("Mot de passe changé avec succès");
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="login-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Changer votre mot de passe</h2>
          <form onSubmit={handleSubmit}>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                required
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="connect-button">
              Modifier le mot de passe
            </button>
          </form>
          <Link to="/Mdpoublier" className="back-button">
            <FaArrowLeft /> Retour
          </Link>
        </div>
        <Link to="/" className="back-to-home4">
          <FaArrowLeft className="back-icon" /> Revenir à la page d'accueil
        </Link>
      </div>
      <div className="right-side">
        <img src={audito} alt="Building" className="building-image" />
      </div>
    </div>
  );
};

export default Nvmdp;
