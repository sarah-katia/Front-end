import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ApprovalCard from "../cartes/approvalcard";
import pageStyle from "./securite.module.css";

const Security2 = () => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [showApproval, setShowApproval] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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
    let errors = { confirmPassword: "" };

    if (updatedPasswords.newPassword !== updatedPasswords.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas !";
    }

    setErrorMessage(errors);
    return !errors.confirmPassword;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!passwords.newPassword || !passwords.confirmPassword) {
      return;
    }

    if (!validateForm(passwords)) {
      return;
    }

    setShowApproval(true);
  };

  const confirmSave = () => {
    console.log("Nouveau mot de passe sauvegardé :", passwords.newPassword);
    setShowApproval(false);
  };

  return (
    <div className={pageStyle.container}>
      <div className={pageStyle.content}>
        <form className={pageStyle.form}>
          {["newPassword", "confirmPassword"].map((field, index) => (
            <div key={index} className={pageStyle.inputGroup}>
              <label>
                {field === "newPassword" ? "Nouveau" : "Confirmer"} mot de passe <span>*</span>
              </label>
              <div className={pageStyle.passwordContainer}>
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  value={passwords[field]}
                  onChange={handleChange}
                  placeholder={field === "newPassword" ? "Nouveau mot de passe" : "Confirmer le mot de passe"}
                  required
                />
                <button
                  type="button"
                  className={pageStyle.togglePassword}
                  onClick={() => setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))}
                >
                  {showPassword[field] ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {attemptedSubmit && errorMessage[field] && (
                <p className={pageStyle.errorMessage}>{errorMessage[field]}</p>
              )}
            </div>
          ))}

          <div className={pageStyle.saveButtonContainer}>
            <button type="button" className={pageStyle.saveButton} onClick={handleSaveClick}>
              Sauvegarder
            </button>
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

export default Security2;
