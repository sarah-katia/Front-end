import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./Profilecard.module.css";

const ProfileCard = () => {
    const navigate = useNavigate();
    const [utilisateur, setUtilisateur] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUtilisateur(JSON.parse(storedUser));
            } else {
                setError("Aucune donnée utilisateur trouvée dans le localStorage");
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des données:", err);
            setError("Erreur lors du chargement des données utilisateur");
        }
    }, []);

    const handleEditClick = () => {
        navigate("/component/modifier/personal");
    };

    // Fonction pour afficher "Non disponible" quand une donnée n'est pas disponible
    const displayValue = (value) => {
        return value ? value : "Non disponible";
    };

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!utilisateur) {
        return <div className={styles.error}>Aucune information utilisateur disponible</div>;
    }

    // Si les données ne sont pas dans le format attendu (pas de propriété chercheur)
    // On suppose que les données sont directement à la racine de l'objet
    const chercheurData = utilisateur.chercheur || utilisateur;

    return (
        <div className={styles.profileCard}>
            <div className={styles.profileTitle}>Mon Profil</div>

            <div className={styles.profileHeader}>
                <img
                    src={chercheurData.photo || "/default-profile.png"}
                    alt="Profil"
                    className={styles.profileImage}
                />
                <div className={styles.profileInfo}>
                    <p><strong>Nom Complet:</strong> {displayValue(chercheurData.nom_complet || chercheurData.Nom_complet)}</p>
                    <p><strong>Grade de Recherche:</strong> {displayValue(chercheurData.grade_recherche || chercheurData.Grade_Recherche)}</p>
                </div>
            </div>

            <button className={styles.editButton} onClick={handleEditClick}>
                <img src="/modifier.svg" alt="Modifier" /> Modifier
            </button>
        </div>
    );
};

export default ProfileCard;