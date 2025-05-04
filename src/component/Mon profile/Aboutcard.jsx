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

  // Fonction pour afficher "Non disponible" quand une donnée n'est pas disponible
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

  // Si les données ne sont pas dans le format attendu (pas de propriété chercheur)
  // On suppose que les données sont directement à la racine de l'objet
  const chercheurData = userData.chercheur || userData;

  return (
    <div className={aboutStyles.aboutCard}>
      <div className={aboutStyles.aboutHeader}>À Propos</div>
      <div className={aboutStyles.aboutContent}>
        <div className={aboutStyles.aboutLeft}>
          <p><FaEnvelope className={aboutStyles.icon} /> <strong>E-mail:</strong> <a href={`mailto:${userData.Mails || chercheurData.Mails}`} className={aboutStyles.link}>{displayValue(userData.Mails || chercheurData.Mails)}</a></p>
          <p><FaUserGraduate className={aboutStyles.icon} /> <strong>Diplôme:</strong> {displayValue(chercheurData.Diplôme || chercheurData.diplome)}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>ORCID:</strong> {displayValue(chercheurData.Orcid || chercheurData.orcid)}</p>
          <p><BsFileEarmarkPerson className={aboutStyles.icon} /> <strong>Qualité:</strong> {displayValue(chercheurData.Qualité || chercheurData.qualite)}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Équipe:</strong> {displayValue(chercheurData.Equipe || chercheurData.equipe)}</p>
        </div>

        <div className={aboutStyles.aboutRight}>
          <p><FaPhone className={aboutStyles.icon} /> <strong>N° de téléphone:</strong> {displayValue(userData.Tél || chercheurData.Tél || chercheurData.tel)}</p>
          <p><BsBook className={aboutStyles.icon} /> <strong>Nombre de Publications:</strong> {displayValue(chercheurData.publications_count)}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>Indice-H:</strong> {displayValue(chercheurData.Hindex || chercheurData.hindex)}</p>
          <p><BsCheckCircle className={aboutStyles.icon} /> <strong>Statut:</strong> {displayValue(chercheurData.Statut || chercheurData.statut)}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Chef équipe:</strong> {
            (chercheurData.Chef_Equipe !== undefined || chercheurData.is_team_leader !== undefined) ? 
            ((chercheurData.Chef_Equipe || chercheurData.is_team_leader) ? "Oui" : "Non") : 
            "Non disponible"
          }</p>
        </div>

        <p className={aboutStyles.fullWidth}><FaUniversity className={aboutStyles.icon} /> <strong>Établissement d'origine:</strong> {displayValue(chercheurData.Etablissement_origine || chercheurData.etablissement_origine)}</p>
        
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien Google Scholar:</strong> {
          chercheurData.Lien_GoogleScholar || chercheurData.lien_googlescholar ? 
          <a href={chercheurData.Lien_GoogleScholar || chercheurData.lien_googlescholar} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">
            {chercheurData.Lien_GoogleScholar || chercheurData.lien_googlescholar}
          </a> : 
          "Non disponible"
        }</p>
        
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien DBLP:</strong> {
          chercheurData.Lien_DBLP || chercheurData.lien_dblp ? 
          <a href={chercheurData.Lien_DBLP || chercheurData.lien_dblp} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">
            {chercheurData.Lien_DBLP || chercheurData.lien_dblp}
          </a> : 
          "Non disponible"
        }</p>
      </div>
    </div>
  );
};

export default AboutCard;