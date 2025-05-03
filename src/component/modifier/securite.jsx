import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [showApproval, setShowApproval] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (attemptedSubmit) {
      validateForm({ ...passwords, [name]: value });
    }

    if (apiSuccess) {
      setApiSuccess("");
    }
  };

  const validateForm = (updatedPasswords) => {
    let errors = { oldPassword: "", newPassword: "", confirmPassword: "" };
    let isValid = true;

    if (updatedPasswords.newPassword && updatedPasswords.newPassword.length < 8) {
      errors.newPassword = "Le mot de passe doit contenir au moins 8 caractères";
      isValid = false;
    }

    if (updatedPasswords.newPassword !== updatedPasswords.confirmPassword) {
      errors.confirmPassword = "Les nouveaux mots de passe ne correspondent pas !";
      isValid = false;
    }

    setErrorMessage(errors);
    return isValid;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setApiError("");
    setApiSuccess("");

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setApiError("Tous les champs sont obligatoires.");
      return;
    }

    if (!validateForm(passwords)) {
      return;
    }

    setShowApproval(true);
  };

  const confirmSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");

      const response = await fetch("http://localhost:3000/auth/updatepassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Réponse non-JSON reçue: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      setApiSuccess(data.message || "Mot de passe mis à jour avec succès");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowApproval(false);
    } catch (error) {
      setApiError(error.message || "Une erreur inattendue est survenue");
      setShowApproval(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={pageStyle.container}>
      <div className={pageStyle.content}>
        <h2 className={pageStyle.title}>Modifier votre mot de passe</h2>

        {apiError && (
          <div className={pageStyle.errorAlert}>
            <p>{apiError}</p>
          </div>
        )}

        {apiSuccess && (
          <div className={pageStyle.successAlert}>
            <p>{apiSuccess}</p>
          </div>
        )}

        <form className={pageStyle.form}>
          {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
            <div key={field} className={pageStyle.inputGroup}>
              <label>
                {field === "oldPassword" ? "Ancien" : field === "newPassword" ? "Nouveau" : "Confirmer"} mot de passe <span className={pageStyle.required}>*</span>
              </label>
              <div className={pageStyle.passwordContainer}>
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  value={passwords[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "oldPassword"
                      ? "Ancien mot de passe"
                      : field === "newPassword"
                      ? "Nouveau mot de passe"
                      : "Confirmer le mot de passe"
                  }
                  autoComplete={
                    field === "oldPassword"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={pageStyle.togglePassword}
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [field]: !prev[field],
                    }))
                  }
                  disabled={isLoading}
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
            <button
              type="button"
              className={pageStyle.saveButton}
              onClick={handleSaveClick}
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>

      {showApproval && (
        <ApprovalCard
          isVisible={showApproval}
          onConfirm={confirmSave}
          onClose={() => setShowApproval(false)}
          message="Êtes-vous sûr de vouloir modifier votre mot de passe ?"
          confirmText="Confirmer"
          cancelText="Annuler"
        />
      )}
    </div>
  );
};

export default Security;
