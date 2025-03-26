import React from "react";
import { FaEnvelope, FaPhone, FaGoogle, FaUserGraduate, FaUsers, FaUniversity } from "react-icons/fa";
import { BsClipboardData, BsFileEarmarkPerson, BsCheckCircle, BsBook } from "react-icons/bs";
import "./Aboutcard.css";

const AboutCard = ({ researcher }) => {
  return (
    <div className="about-card">
      <div className="about-header">À Propos</div>
      <div className="about-content">
        <div className="about-left">
          <p><FaEnvelope className="icon" /> <strong>E-mail:</strong> <a href={`mailto:${researcher.email}`} className="link">{researcher.email}</a></p>
          <p><FaUserGraduate className="icon" /> <strong>Diplôme:</strong> {researcher.diplome}</p>
          <p><BsClipboardData className="icon" /> <strong>ORCID:</strong> {researcher.orcid}</p>
          <p><BsFileEarmarkPerson className="icon" /> <strong>Qualité:</strong> {researcher.qualité}</p>
          <p><FaUsers className="icon" /> <strong>Équipe:</strong> {researcher.team}</p>
        </div>

        <div className="about-right">
          <p><FaPhone className="icon" /> <strong>N° de téléphone:</strong> {researcher.phone}</p>
          <p><BsBook className="icon" /> <strong>Nombre de Publications:</strong> {researcher.publications}</p>
          <p><BsClipboardData className="icon" /> <strong>Indice-H:</strong> {researcher.hIndex}</p>
          <p><BsCheckCircle className="icon" /> <strong>Statut:</strong> {researcher.status}</p>
          <p><FaUsers className="icon" /> <strong>Chef équipe:</strong> {researcher.isTeamLeader ? "Oui" : "Non"}</p>
        </div>

        {/* Les deux derniers éléments en pleine largeur */}
        <p className="full-width"><FaUniversity className="icon" /> <strong>Établissement d'origine:</strong> {researcher.institution}</p>
        <p className="full-width"><FaGoogle className="icon" /> <strong>Lien Google Scholar:</strong> <a href={researcher.googleScholar} className="link" target="_blank" rel="noopener noreferrer">{researcher.googleScholar}</a></p>
      </div>
    </div>
  );
};

export default AboutCard;
