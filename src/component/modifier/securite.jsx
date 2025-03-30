import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../nav/Sidebar";
import Topnav from "../nav/Topnav";
import ApprovalCard from "../cartes/approvalcard";
import pageStyle from "./securite.module.css";  

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

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [showApproval, setShowApproval] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const storedPassword = "Mdpsofia";

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

    if (updatedPasswords.oldPassword && updatedPasswords.oldPassword !== storedPassword) {
      errors.oldPassword = "Ancien mot de passe incorrect !";
    }

    if (updatedPasswords.newPassword !== updatedPasswords.confirmPassword) {
      errors.confirmPassword = "Les nouveaux mots de passe ne correspondent pas !";
    }

    setErrorMessage(errors);
    return !errors.oldPassword && !errors.confirmPassword;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return;
    }

    if (!validateForm(passwords)) {
      return;
    }

    setShowApproval(true);
  };

  const confirmSave = () => {
    console.log("Mot de passe mis à jour:", passwords);
    setShowApproval(false);
  };

  return (
    <div className={pageStyle.container}>
      <Sidebar />
      <div className={pageStyle.content}>
        <Topnav />
        <form className={pageStyle.form}>
          {["oldPassword", "newPassword", "confirmPassword"].map((field, index) => (
            <div key={index} className={pageStyle.inputGroup}>
              <label>
                {field === "oldPassword" ? "Ancien" : field === "newPassword" ? "Nouveau" : "Confirmer"} mot de passe <span>*</span>
              </label>
              <div className={pageStyle.passwordContainer}>
                <input 
                  type={showPassword[field] ? "text" : "password"} 
                  name={field} 
                  value={passwords[field]} 
                  onChange={handleChange}
                  placeholder={field === "oldPassword" ? "Ancien mot de passe" : field === "newPassword" ? "Nouveau mot de passe" : "Confirmer le mot de passe"} 
                  required 
                />
                <button type="button" className={pageStyle.togglePassword} onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))}>
                  {showPassword[field] ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {attemptedSubmit && errorMessage[field] && <p className={pageStyle.errorMessage}>{errorMessage[field]}</p>}
            </div>
          ))}
          <div className={pageStyle.saveButtonContainer}>
            <button type="button" className={pageStyle.saveButton} onClick={handleSaveClick}>Sauvegarder</button>
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
