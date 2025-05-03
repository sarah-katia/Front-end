import styles from './ProfilAdmin.module.css';
import SidebarA from '../component/nav/SidebarAd';
import Topnav from '../component/nav/Topnav';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function ProfilAdmin() {
  const navigate = useNavigate();
  const [chercheur, setChercheur] = useState({
    nom_complet: '',
    phone: '',
    email: '',
    photo: ''
  });
  
  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté
    const fetchUserInfo = async () => {
      try {
        // Vérifier si le token existe
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé');
          navigate('/login'); // Rediriger vers la page de connexion si pas de token
          return;
        }
        
        const response = await fetch('http://localhost:3000/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Échec de récupération des données');
        }
        
        const data = await response.json();
        if (data.status === 'success') {
          setChercheur({
            nom_complet: data.data.nom_complet || '',
            phone: data.data.Tél || '',
            email: data.data.Mails || '',
            photo: data.data.photo || ''
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    
    fetchUserInfo();
  }, [navigate]);

  const handleEditClick = () => {
    navigate("/ModifierAdmin");
  };

  return (
    <div>
      <SidebarA />
      <div>
        <Topnav />
        <div className={styles.pageProfile}>
          <div className={styles.profileCard}>
            <div className={styles.profileTitle}>Mon Profil</div>
            
            <div className={styles.profileHeader}>
              <img src={chercheur.photo} alt="Profil" className={styles.profileImage} />
              <div className={styles.profileInfo}>
                <div className={styles.infoColumn}>
                  <p className={styles.infoItem}><strong>Nom complet:</strong> {chercheur.nom_complet}</p>
                </div>
                <div className={styles.infoColumn}>
                  <p className={styles.infoItem}><strong>Num.tél:</strong> {chercheur.phone}</p>
                  <p className={styles.infoItem}><strong>Adresse email:</strong> {chercheur.email}</p>
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