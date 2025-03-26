import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../nav/Sidebar";
import Topnav from "../nav/Topnav";
import ApprovalCard from "../cartes/approvalcard";
import "./securite.css";  

const Security = () => {
  const navigate = useNavigate(); 

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    oldPassword: "",
    confirmPassword: "",
  });

  const [showoldPassword, setShowoldPassword] = useState(false);
  const [shownewPassword, setShownewPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false); // 🔹 Ajout pour contrôler l'affichage des erreurs

  const storedPassword = "Mdpsofia"; // 🔹 Simule un mot de passe stocké en base de données

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (attemptedSubmit) {
      validateForm({ ...passwords, [name]: value });
    }
  };

  const validateForm = (updatedPasswords) => {
    let errors = { oldPassword: "", confirmPassword: "" };

    // Vérification de l'ancien mot de passe SEULEMENT si l'utilisateur a tenté d'enregistrer
    if (updatedPasswords.oldPassword && updatedPasswords.oldPassword !== storedPassword) {
      errors.oldPassword = "Ancien mot de passe incorrect !";
    }

    // Vérification des nouveaux mots de passe
    if (updatedPasswords.newPassword !== updatedPasswords.confirmPassword) {
      errors.confirmPassword = "Les nouveaux mots de passe ne correspondent pas !";
    }

    setErrorMessage(errors);
    return !errors.oldPassword && !errors.confirmPassword;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setAttemptedSubmit(true); // 🔹 L'utilisateur a essayé d'enregistrer

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return; // 🔹 Ne fait rien si les champs ne sont pas remplis
    }

    if (!validateForm(passwords)) {
      return; // 🔹 Ne fait rien s'il y a des erreurs
    }

    setShowApproval(true); // 🔹 Affiche la carte de confirmation
  };

  const confirmSave = () => {
    console.log("Mot de passe mis à jour:", passwords);
    setShowApproval(false);
  };

  return (
    <div className="security-edit-container">
      <Sidebar />
      <div className="security-edit-content">
        <Topnav />
        <form className="security-edit-form">
          <div className="input-group">
            <label>Ancien mot de passe <span>*</span></label>
            <div className="password-container">
              <input 
                type={showoldPassword ? "text" : "password"} 
                name="oldPassword" 
                value={passwords.oldPassword} 
                onChange={handleChange}
                placeholder="Ancien mot de passe" 
                required 
              />
              <button type="button" className="toggle-password" onClick={() => setShowoldPassword(!showoldPassword)}>
                {showoldPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {attemptedSubmit && errorMessage.oldPassword && <p className="error-message">{errorMessage.oldPassword}</p>}
          </div>

          <div className="input-group">
            <label>Nouveau mot de passe <span>*</span></label>
            <div className="password-container">
              <input 
                type={shownewPassword ? "text" : "password"} 
                name="newPassword" 
                value={passwords.newPassword} 
                onChange={handleChange}
                placeholder="Nouveau mot de passe" 
                required 
              />
              <button type="button" className="toggle-password" onClick={() => setShownewPassword(!shownewPassword)}>
                {shownewPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmer le mot de passe <span>*</span></label>
            <div className="password-container">
              <input 
                type={showconfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={passwords.confirmPassword} 
                onChange={handleChange}
                placeholder="Confirmer le mot de passe" 
                required 
              />
              <button type="button" className="toggle-password" onClick={() => setShowconfirmPassword(!showconfirmPassword)}>
                {showconfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {attemptedSubmit && errorMessage.confirmPassword && <p className="error-message">{errorMessage.confirmPassword}</p>}
          </div>

          <div className="save-button-container">
            <button type="button" className="save-button" onClick={handleSaveClick}>Sauvegarder</button>
          </div>
        </form>
      </div>

      {showApproval && (
        <ApprovalCard 
          isVisible={showApproval}
          onConfirm={confirmSave}
          onClose={() => setShowApproval(false)}
        />
      )}
    </div>
  );
};

export default Security;
