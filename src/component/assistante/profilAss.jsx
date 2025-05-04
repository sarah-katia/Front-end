import React, { useEffect, useState } from 'react';
import styles from './profil.module.css';
import Sidebar from '../nav/sidebarAssi';
import Topnav from '../nav/Topnav';
import { useNavigate } from "react-router-dom";

export default function ProfilAss() {
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState({
    nom_complet: '',
    phone: '',
    email: '',
    photo: ''
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8000/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Échec de récupération des données');
        }

        const data = await response.json();
        console.log("Données assistant :", data); // Debug

        if (data.status === 'success') {
          const user = data.data;
          setAssistant({
            nom_complet: user.nom_complet || `${user.nom || ''} ${user.prenom || ''}`,
            phone: user.Tél || '',
            email: user.Mails || '',
            photo: user.photo || ''
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleEditClick = () => {
    navigate("/editassi");
  };

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
                  <p className={styles.infoItem}><strong>Nom complet:</strong> {assistant.nom_complet}</p>
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
