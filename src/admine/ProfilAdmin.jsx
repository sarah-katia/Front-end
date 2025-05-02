import styles from './ProfilAdmin.module.css';
import SidebarA from '../component/nav/SidebarAd';
import Topnav from '../component/nav/Topnav';
import { useNavigate } from "react-router-dom";

export default function ProfilAdmin({ chercheur }) {
  const navigate = useNavigate();

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
                <p className={styles.infoItem}><strong>Nom:</strong> {chercheur.nom}</p>
                <p className={styles.infoItem}><strong>Prénom:</strong> {chercheur.prenom}</p>
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
