import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaGoogle, FaUserGraduate, FaUsers, FaUniversity } from "react-icons/fa";
import { BsClipboardData, BsFileEarmarkPerson, BsCheckCircle, BsBook } from "react-icons/bs";
import aboutStyles from "./Aboutcard.module.css";

const AboutCard = () => {
  const [researcher, setResearcher] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // ici 'user' au lieu de 'utilisateur'
    if (storedUser) {
      setResearcher(JSON.parse(storedUser)); // Chargement de l'utilisateur depuis localStorage
    }
  }, []);

  if (!researcher) {
    return <div>Chargement...</div>;  // Affichage pendant le chargement
  }

  // On accède aux informations spécifiques de "chercheur"
  const { chercheur } = researcher;

  return (
    <div className={aboutStyles.aboutCard}>
      <div className={aboutStyles.aboutHeader}>À Propos</div>
      <div className={aboutStyles.aboutContent}>
        <div className={aboutStyles.aboutLeft}>
          <p><FaEnvelope className={aboutStyles.icon} /> <strong>E-mail:</strong> <a href={`mailto:${chercheur.email}`} className={aboutStyles.link}>{chercheur.email}</a></p>
          <p><FaUserGraduate className={aboutStyles.icon} /> <strong>Diplôme:</strong> {chercheur.diplome}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>ORCID:</strong> {chercheur.orcid}</p>
          <p><BsFileEarmarkPerson className={aboutStyles.icon} /> <strong>Qualité:</strong> {chercheur.qualite}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Équipe:</strong> {chercheur.equipe}</p>
        </div>

        <div className={aboutStyles.aboutRight}>
          <p><FaPhone className={aboutStyles.icon} /> <strong>N° de téléphone:</strong> {chercheur.tel}</p>
          <p><BsBook className={aboutStyles.icon} /> <strong>Nombre de Publications:</strong> {chercheur.hindex}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>Indice-H:</strong> {chercheur.hindex}</p>
          <p><BsCheckCircle className={aboutStyles.icon} /> <strong>Statut:</strong> {chercheur.statut}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Chef équipe:</strong> {chercheur.is_team_leader ? "Oui" : "Non"}</p>
        </div>

        <p className={aboutStyles.fullWidth}><FaUniversity className={aboutStyles.icon} /> <strong>Établissement d'origine:</strong> {chercheur.etablissement_origine}</p>
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien Google Scholar:</strong> <a href={chercheur.lien_googlescholar} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">{chercheur.lien_googlescholar}</a></p>
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien DBLP:</strong> <a href={chercheur.lien_dblp || chercheur.lien_googlescholar} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">{chercheur.lien_dblp || chercheur.lien_googlescholar}</a></p>
      </div>
    </div>
  );
};

export default AboutCard;
