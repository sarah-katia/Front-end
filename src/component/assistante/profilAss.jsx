import React, { useEffect, useState } from 'react';
import styles from './profil.module.css';
import Sidebar from '../nav/sidebarAssi';
import Topnav from '../nav/Topnav';
import { useNavigate } from "react-router-dom";

export default function ProfilAss() {
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données de l'assistante depuis le localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // En supposant que les informations de l'assistante sont stockées dans userData.assistant
      if (userData.assistant) {
        setAssistant(userData.assistant);
      } else {
        // Si les données ne sont pas structurées comme prévu, on utilise tout l'objet userData
        setAssistant(userData);
      }
    }
    setLoading(false);
  }, []);

  const handleEditClick = () => {
    navigate("/editassi");
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!assistant) {
    return <div>Aucune information disponible</div>;
  }

  return (
    <div>
      <Sidebar />
      <div>
        <Topnav />
        <div className={styles.pageProfile}>
          <div className={styles.profileCard}>
            <div className={styles.profileTitle}>Mon Profil</div>

            <div className={styles.profileHeader}>
              <img 
                src={assistant.photo || "/default-profile.png"} 
                alt="Profil" 
                className={styles.profileImage} 
              />
              <div className={styles.profileInfo}>
                <div className={styles.infoColumn}>
                  <p className={styles.infoItem}><strong>Nom:</strong> {assistant.nom}</p>
                  <p className={styles.infoItem}><strong>Prénom:</strong> {assistant.prenom}</p>
                  <p className={styles.infoItem}><strong>Rôle:</strong> Assistante</p>
                </div>
                <div className={styles.infoColumn}>
                  <p className={styles.infoItem}><strong>Num.tél:</strong> {assistant.phone}</p>
                  <p className={styles.infoItem}><strong>Adresse email:</strong> {assistant.email}</p>
                </div>
              </div>
            </div>

            <button className={styles.editButton} onClick={handleEditClick}>
              <img src="/modifier.svg" alt="Modifier" /> Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}