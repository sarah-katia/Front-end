import React, { useState } from "react";
import SidebarA from "../component/nav/SidebarAd";
import Topnav from "../component/nav/Topnav";
import Security from "../component/modifier/securite";
import ApprovalCard from "../component/cartes/approvalcard";

import styles from "./ModifierAdmin.module.css"; // Tu vas le créer

const ModifierAdmin = ({ assistant }) => {
  const [formData, setFormData] = useState({
    nom: assistant.nom || "",
    prenom: assistant.prenom || "",
    email: assistant.email || "",
    telephone: assistant.telephone || "",
    role: assistant.role || "Admine", // par défaut
  });

  const [showApproval, setShowApproval] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setShowApproval(true);
  };

  return (
    <div className={styles.container} >
      <SidebarA />
      <div className={styles.mainContent}>
        <Topnav />

        <div className={styles.cardsWrapper}>
          {/* Carte Infos personnelles */}
          <div className={styles.title}>Mon Profil</div>

          <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
  <div className={styles.inputGrid}>
    <div className={styles.inputGroup}>
      <label>Nom <span>*</span></label>
      <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
    </div>

    <div className={styles.inputGroup}>
      <label>Prénom <span>*</span></label>
      <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
    </div>

    <div className={styles.inputGroup}>
      <label>Adresse email <span>*</span></label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
    </div>

    <div className={styles.inputGroup}>
      <label>Numéro de téléphone <span>*</span></label>
      <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />
    </div>
  </div>

  {/* Rôle : pleine largeur */}
  <div className={styles.inputGroup}>
    <label>Rôle</label>
    <input type="text" name="role" value={formData.role} disabled className={styles.disabledInput} />
  </div>

  <button type="submit" className={styles.saveButton}>Sauvegarder</button>
</div>

          </form>

          {/* Carte Changement mot de passe */}
          <div className={styles.title2}>Changer mot de passe</div>
          <div className={styles.securityy}>
            <Security />
          </div>
        </div>

        {/* Carte de confirmation */}
        {showApproval && (
          <ApprovalCard
            isVisible={showApproval}
            onClose={() => setShowApproval(false)}
            onConfirm={() => console.log("Infos sauvegardées:", formData)}
          />
        )}
      </div>
    </div>
  );
};

export default ModifierAdmin;
