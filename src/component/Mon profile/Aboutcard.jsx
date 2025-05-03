import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaGoogle, FaUserGraduate, FaUsers, FaUniversity } from "react-icons/fa";
import { BsClipboardData, BsFileEarmarkPerson, BsCheckCircle, BsBook } from "react-icons/bs";
import aboutStyles from "./Aboutcard.module.css";

const AboutCard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Récupérer les données utilisateur du localStorage
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Données utilisateur récupérées:", parsedUser);
        setUserData(parsedUser);
      } else {
        setError("Aucune donnée utilisateur trouvée dans le localStorage");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError("Erreur lors du chargement des données utilisateur");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour afficher "Non disponible $" quand une donnée n'est pas disponible
  const displayValue = (value) => {
    return value ? value : "Non disponible";
  };

  // Affichage pendant le chargement
  if (loading) {
    return <div className={aboutStyles.loading}>Chargement des informations...</div>;
  }

  // Affichage en cas d'erreur
  if (error || !userData) {
    return <div className={aboutStyles.error}>
      {error || "Impossible de charger les informations du chercheur"}
      <p>Veuillez vous connecter pour accéder à vos informations.</p>
    </div>;
  }

  // Vérifier si les données du chercheur existent
  if (!userData.chercheur) {
    return <div className={aboutStyles.warning}>
      <h3>Information</h3>
      <p>Les données de chercheur ne sont pas disponibles pour ce compte.</p>
      <p>Email: {displayValue(userData.Mails)}</p>
      <p>Rôle: {displayValue(userData.Rôle)}</p>
      <p>Téléphone: {displayValue(userData.Tél)}</p>
    </div>;
  }

  // Accéder aux informations de chercheur
  const { chercheur } = userData;

  return (
    <div className={aboutStyles.aboutCard}>
      <div className={aboutStyles.aboutHeader}>À Propos</div>
      <div className={aboutStyles.aboutContent}>
        <div className={aboutStyles.aboutLeft}>
          <p><FaEnvelope className={aboutStyles.icon} /> <strong>E-mail:</strong> <a href={`mailto:${userData.Mails}`} className={aboutStyles.link}>{displayValue(userData.Mails)}</a></p>
          <p><FaUserGraduate className={aboutStyles.icon} /> <strong>Diplôme:</strong> {displayValue(chercheur.diplome)}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>ORCID:</strong> {displayValue(chercheur.orcid)}</p>
          <p><BsFileEarmarkPerson className={aboutStyles.icon} /> <strong>Qualité:</strong> {displayValue(chercheur.qualite)}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Équipe:</strong> {displayValue(chercheur.equipe)}</p>
        </div>

        <div className={aboutStyles.aboutRight}>
          <p><FaPhone className={aboutStyles.icon} /> <strong>N° de téléphone:</strong> {displayValue(userData.Tél || chercheur.tel)}</p>
          <p><BsBook className={aboutStyles.icon} /> <strong>Nombre de Publications:</strong> {displayValue(chercheur.publications_count)}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>Indice-H:</strong> {displayValue(chercheur.hindex)}</p>
          <p><BsCheckCircle className={aboutStyles.icon} /> <strong>Statut:</strong> {displayValue(chercheur.statut)}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Chef équipe:</strong> {chercheur.is_team_leader ? "Oui" : "Non disponible"}</p>
        </div>

        <p className={aboutStyles.fullWidth}><FaUniversity className={aboutStyles.icon} /> <strong>Établissement d'origine:</strong> {displayValue(chercheur.etablissement_origine)}</p>
        
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien Google Scholar:</strong> {
          chercheur.lien_googlescholar ? 
          <a href={chercheur.lien_googlescholar} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">{chercheur.lien_googlescholar}</a> : 
          "Non disponible"
        }</p>
        
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien DBLP:</strong> {
          chercheur.lien_dblp ? 
          <a href={chercheur.lien_dblp} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">{chercheur.lien_dblp}</a> : 
          "Non disponible"
        }</p>
      </div>
    </div>
  );
};

export default AboutCard;