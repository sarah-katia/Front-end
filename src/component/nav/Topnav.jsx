import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCaretDown , FaSignOutAlt} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Koudil from "../../assets/Koudil.png" ; 
import "./Topnav.css";

const Topnav = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Récupérer les infos de l'utilisateur (depuis localStorage ou API)
  const [user, setUser] = useState({
    nom: "Koudil",
    prenom: "Mouloud",
    photo: Koudil, 

   
  });

  useEffect(() => {
    // Simuler une récupération depuis localStorage (remplace ça par une API si besoin)
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion...");
    localStorage.removeItem("user"); // Supprime l'utilisateur stocké
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/Table_chercheur":
        return "Liste des chercheurs";
      case "/Accueil":
        return "Accueil";
      case "/Mon profile":
        return "Mon profile"; 
      case "/Publications":
        return "Mes publications";
      default:
        return "Page introuvable";
    }
  };

  return (
    <div className="top-nav">
      <h2 className="page-title">{getTitle()}</h2>
      <div
        className="profile-dropdown"
        ref={dropdownRef}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.photo ? (
          <img src={user.photo} alt="Profil" className="profile-photo" />
        ) : (
          <FaUserCircle className="profile-icon" />
        )}
        <span >{user.nom } {user.prenom}</span>
        <FaCaretDown className="dropdown-icon" />
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="user-info">
              <img src={user.photo} alt="Profil" className="large-profile-photo" />
              <h3>{user.nom} {user.prenom}</h3>
            </div>
            <button onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> <span>Se déconnecter</span> </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topnav;