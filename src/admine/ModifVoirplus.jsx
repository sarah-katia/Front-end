import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarA from "../component/nav/SidebarAd";
import Topnav from "../component/nav/Topnav";
import Security2 from "../component/modifier/securité2";
import ApprovalCard from "../component/cartes/approvalcard";

import styles from "./ModifierAdmin.module.css";

const ModifVoirplus = () => {
  const location = useLocation();
  const assistant = location.state?.assistant;

  if (!assistant) {
    return <div>Utilisateur non trouvé</div>;
  }

  const [formData, setFormData] = useState({
    nom: assistant.nom,
    prenom: assistant.prenom,
    email: assistant.email,
    telephone: assistant.telephone,
    role: assistant.role || "Assistante",
  });

  const [showApproval, setShowApproval] = useState(false);

  const handleChangeRole = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowApproval(true);
  };

  return (
    <div className={styles.container}>
      <SidebarA />
      <div className={styles.mainContent}>
        <Topnav />

        <div className={styles.cardsWrapper}>
          {/* Titre */}
          <div className={styles.title}>Modifier le rôle de l'utilisateur</div>

          {/* Formulaire */}
          <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label>Nom</label>
                  <input type="text" value={formData.nom} disabled className={styles.disabledInput} />
                </div>

                <div className={styles.inputGroup}>
                  <label>Prénom</label>
                  <input type="text" value={formData.prenom} disabled className={styles.disabledInput} />
                </div>

                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input type="email" value={formData.email} disabled className={styles.disabledInput} />
                </div>

                <div className={styles.inputGroup}>
                  <label>Téléphone</label>
                  <input type="text" value={formData.telephone} disabled className={styles.disabledInput} />
                </div>
              </div>

              {/* Rôle modifiable */}
              <div className={styles.inputGroup}>
                <label>Rôle</label>
                <select name="role" value={formData.role} onChange={handleChangeRole}>
                  <option value="Directrice">Directrice</option>
                  <option value="Assistante">Assistante</option>
                  <option value="Chercheuse">Chercheuse</option>
                </select>
              </div>

              <button type="submit" className={styles.saveButton}>Sauvegarder</button>
            </div>
          </form>

          {/* Carte mot de passe */}
          <div className={styles.title2}>Changer mot de passe</div>
          <div className={styles.securityy}>
            <Security2 />
          </div>

          {/* Carte de confirmation */}
          {showApproval && (
            <ApprovalCard
              isVisible={showApproval}
              onClose={() => setShowApproval(false)}
              onConfirm={() => {
                console.log("Nouveau rôle sauvegardé :", formData.role);
                setShowApproval(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModifVoirplus;
