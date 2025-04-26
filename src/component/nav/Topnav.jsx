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
      case "/Page_recherche1":
        return "Liste des chercheurs";
        
      case "/Page_recherche2":
        return "Liste des publications";

      case "/Accueil":
        case "/AccueilA":
          case "/AccueilDi":
        return "Accueil";

      case "/PageProfile":
      case "/profilAss":
        case "/ProfilDi":

        return "Mon profil"; 

        case "/Confirmation":
        return "Confirmation"; 

      case "/Publications":
        return "Mes publications";
        case "/ChercheurA":
        return "Liste des utilisateurs";

      case "/component/modifier/personal":
      case "/component/modifier/securite":
      case "/editassi":
        return "Modification";

      case "/gestiondir/chercheur":
      case "/gestiondir/publication":
        return "Gestion";

      case "/ajouter-chercheur":
        return "Ajouter chercheur";

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