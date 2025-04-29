import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./Profilecard.module.css"; // Import du CSS Module

const ProfileCard = () => {
    const navigate = useNavigate();
    const [utilisateur, setUtilisateur] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user"); // ici 'user' et pas 'utilisateur'
        if (storedUser) {
            setUtilisateur(JSON.parse(storedUser));  // On stocke l'objet utilisateur dans l'état
        }
    }, []);

    const handleEditClick = () => {
        navigate("/component/modifier/personal");  // Navigation vers la page de modification
    };

    if (!utilisateur) {
        return <div>Chargement...</div>;  // Affichage pendant le chargement des données
    }

    // On accède aux informations du chercheur dans l'objet utilisateur
    const { chercheur } = utilisateur;

    return (
        <div className={styles.profileCard}>
            <div className={styles.profileTitle}>Mon Profile</div>

            <div className={styles.profileHeader}>
                <img
                    src={chercheur.photo || "/default-profile.png"}  // Photo de profil (avec image par défaut)
                    alt="Profil"
                    className={styles.profileImage}
                />
                <div className={styles.profileInfo}>
                    <p><strong>Nom Complet:</strong> {chercheur.nom_complet}</p> {/* nom_complet */}
                    <p><strong>Grade de Recherche:</strong> {chercheur.grade_recherche}</p> {/* grade_recherche */}
                </div>
            </div>

            <button className={styles.editButton} onClick={handleEditClick}>
                <img src="/modifier.svg" alt="Modifier" /> Modifier
            </button>
        </div>
    );
};

export default ProfileCard;
