import React, { useEffect, useState } from 'react';
import styles from './profilDi.module.css';
import Sidebar from '../nav/SidebarDi';
import Topnav from '../nav/Topnav';
import { useNavigate } from "react-router-dom";

export default function ProfilDi() {
  const navigate = useNavigate();
  const [directeur, setDirecteur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données du directeur depuis le localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // En supposant que les informations du directeur sont stockées dans userData.directeur
      if (userData.directeur) {
        setDirecteur(userData.directeur);
      } else {
        // Si les données ne sont pas structurées comme prévu, on utilise tout l'objet userData
        setDirecteur(userData);
      }
    }
    setLoading(false);
  }, []);

  const handleEditClick = () => {
    navigate("/editDi");
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!directeur) {
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
                src={directeur.photo || "/default-profile.png"} 
                alt="Profil" 
                className={styles.profileImage} 
              />
              <div className={styles.profileInfo}>
                <div className={styles.infoColumn}>
                  <p className={styles.infoItem}><strong>Nom:</strong> {directeur.nom}</p>
                  <p className={styles.infoItem}><strong>Prénom:</strong> {directeur.prenom}</p>
                  <p className={styles.infoItem}><strong>Rôle:</strong> Directeur</p>
                </div>
                <div className={styles.infoColumn}>
                  <p className={styles.infoItem}><strong>Num.tél:</strong> {directeur.phone}</p>
                  <p className={styles.infoItem}><strong>Adresse email:</strong> {directeur.email}</p>
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