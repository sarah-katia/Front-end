import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Lien invalide ou expiré.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/auth/confirmreset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Mot de passe modifié avec succès !");
        setTimeout(() => navigate("/Flogin"), 3000); // Redirection après 3s
      } else {
        setError(data.message || "Erreur lors de la réinitialisation.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="login-form">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Changer votre mot de passe</h2>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

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
            <button type="submit" className="connect-button" disabled={isLoading}>
              {isLoading ? "Modification..." : "Modifier le mot de passe"}
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
