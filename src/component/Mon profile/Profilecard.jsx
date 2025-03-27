import React from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./Profilecard.module.css"; // Import du CSS Module

const ProfileCard = ({ name, firstName, grade, imageUrl }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate("/component/modifier/personal");
    };

    return (
        <div className={styles.profileCard}>
            {/* Titre bleu "Mon Profile" */}
            <div className={styles.profileTitle}>Mon Profile</div>

            <div className={styles.profileHeader}>
                <img src={imageUrl} alt="Profil" className={styles.profileImage} />
                <div className={styles.profileInfo}>
                    <p><strong>Nom:</strong> {name}</p>
                    <p><strong>Prénom:</strong> {firstName}</p>
                    <p><strong>Grade:</strong> {grade}</p>
                </div>
            </div>

            <button className={styles.editButton} onClick={handleEditClick}>
                <img src="/modifier.svg" alt="Modifier" />Modifier
            </button>
        </div>
    );
};

export default ProfileCard;
