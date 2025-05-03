import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./Profilecard.module.css";

const ProfileCard = () => {
    const navigate = useNavigate();
    const [utilisateur, setUtilisateur] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUtilisateur(JSON.parse(storedUser));
        }
    }, []);

    const handleEditClick = () => {
        navigate("/component/modifier/personal");
    };

    if (!utilisateur || !utilisateur.chercheur) {
        return <div className={styles.error}>Aucune information utilisateur disponible</div>;
    }

    const { chercheur } = utilisateur;

    return (
        <div className={styles.profileCard}>
            <div className={styles.profileTitle}>Mon Profil</div>

            <div className={styles.profileHeader}>
                <img
                    src={chercheur.photo || "/default-profile.png"}
                    alt="Profil"
                    className={styles.profileImage}
                />
                <div className={styles.profileInfo}>
                    <p><strong>Nom Complet:</strong> {chercheur.nom_complet}</p>
                    <p><strong>Grade de Recherche:</strong> {chercheur.grade_recherche}</p>
                </div>
            </div>

            <button className={styles.editButton} onClick={handleEditClick}>
                <img src="/modifier.svg" alt="Modifier" /> Modifier
            </button>
        </div>
    );
};

export default ProfileCard;
