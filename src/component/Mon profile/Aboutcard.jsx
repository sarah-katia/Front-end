import React from "react";
import { FaEnvelope, FaPhone, FaGoogle, FaUserGraduate, FaUsers, FaUniversity } from "react-icons/fa";
import { BsClipboardData, BsFileEarmarkPerson, BsCheckCircle, BsBook } from "react-icons/bs";
import aboutStyles from "./Aboutcard.module.css";

const AboutCard = ({ researcher }) => {
  return (
    <div className={aboutStyles.aboutCard}>
      <div className={aboutStyles.aboutHeader}>À Propos</div>
      <div className={aboutStyles.aboutContent}>
        <div className={aboutStyles.aboutLeft}>
          <p><FaEnvelope className={aboutStyles.icon} /> <strong>E-mail:</strong> <a href={`mailto:${researcher.email}`} className={aboutStyles.link}>{researcher.email}</a></p>
          <p><FaUserGraduate className={aboutStyles.icon} /> <strong>Diplôme:</strong> {researcher.diplome}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>ORCID:</strong> {researcher.orcid}</p>
          <p><BsFileEarmarkPerson className={aboutStyles.icon} /> <strong>Qualité:</strong> {researcher.qualité}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Équipe:</strong> {researcher.team}</p>
        </div>

        <div className={aboutStyles.aboutRight}>
          <p><FaPhone className={aboutStyles.icon} /> <strong>N° de téléphone:</strong> {researcher.phone}</p>
          <p><BsBook className={aboutStyles.icon} /> <strong>Nombre de Publications:</strong> {researcher.publications}</p>
          <p><BsClipboardData className={aboutStyles.icon} /> <strong>Indice-H:</strong> {researcher.hIndex}</p>
          <p><BsCheckCircle className={aboutStyles.icon} /> <strong>Statut:</strong> {researcher.status}</p>
          <p><FaUsers className={aboutStyles.icon} /> <strong>Chef équipe:</strong> {researcher.isTeamLeader ? "Oui" : "Non"}</p>
        </div>

        <p className={aboutStyles.fullWidth}><FaUniversity className={aboutStyles.icon} /> <strong>Établissement d'origine:</strong> {researcher.institution}</p>
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien Google Scholar:</strong> <a href={researcher.googleScholar} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">{researcher.googleScholar}</a></p>
        <p className={aboutStyles.fullWidth}><FaGoogle className={aboutStyles.icon} /> <strong>Lien DBLP:</strong> <a href={researcher.googleScholar} className={aboutStyles.link} target="_blank" rel="noopener noreferrer">{researcher.googleScholar}</a></p>
      </div>
    </div>
  );
};

export default AboutCard;
