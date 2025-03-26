import React from "react";
import { useNavigate } from "react-router-dom"; //  Import du hook `useNavigate`
import "./ProfileCard.css"; // Assurez-vous d'importer le fichier CSS

{/*import editIcon from "../assets/modifier.svg";*/}

const ProfileCard = ({ name, firstName, grade, imageUrl }) => {
    const navigate = useNavigate(); //  Hook pour la navigation
  
    const handleEditClick = () => {
      navigate("/component/modifier/personal "); //  Redirection vers la page de modification
    };


  return (
    <div className="profile-card">
              {/* Titre bleu "Mon Profile" */}
         <div className="profile-title">Mon Profile</div>

      <div className="profile-header">
        <img src={imageUrl} alt="Profil" className="profile-image" />
        <div className="profile-info">
          <p><strong>Nom:</strong> {name}</p>
          <p><strong>Prénom:</strong> {firstName}</p>
          <p><strong>Grade:</strong> {grade}</p>
        </div>
      </div>
      <button className="edit-button" onClick={handleEditClick} >
         <img src="/modifier.svg" alt="Modifier" />Modifier
      </button>
    </div>
  );
};

export default ProfileCard;
