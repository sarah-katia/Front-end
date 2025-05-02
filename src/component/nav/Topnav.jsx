import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCaretDown, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./Topnav.css";

const Topnav = ({ connectedUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Utiliser directement connectedUser pour obtenir le nom complet
  const [nomComplet, setNomComplet] = useState("");

  useEffect(() => {
    if (connectedUser && connectedUser.nom_complet) {
      setNomComplet(connectedUser.nom_complet); // On récupère le nom complet à partir de connectedUser
    }
  }, [connectedUser]); // Cela s'exécute chaque fois que connectedUser change

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion...");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Rediriger vers la page de connexion
    navigate("/Flogin");
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/Page_recherche1":
        return "Liste des chercheurs";
      case "/Page_recherche2":
        return "Liste des publications";
      
      case "/dashboard":
      case "/generer":
      case "/statresults":
        return "Dashboard";

        
        case "/Accueil":
          case "/AccueilA":
          case "/AccueilDi":
            return "Accueil";
      

        case "/VoirplusAssis":
          case "/ModifierAssis": 
          case "/AjouterAssis":
          return "Assistante";

     

      case "/PageProfile":
      case "/profilAss":
      case "/ProfilDi":
        case "/ProfilAdmin":
        return "Mon profil";

      case "/Confirmation":
        return "Confirmation";

      case "/Publications":
        return "Mes publications";
      case "/ChercheurA":
        case "/Voirplus":
          case "/ModifVoirplus":
        return "Liste des utilisateurs";
      case "/component/modifier/personal":
      case "/component/modifier/securite":
      case "/editassi":
      case "/editDi":
        case "/ModifierAdmin":
          
        return "Modification";

        case "/gestionassi/chercheur":
          case "/gestionassi/publication":
          case "/directrice/Assistante":
          case "/directrice/publicationDi":
          case "/directrice/chercheurDi":
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
        <FaUserCircle className="profile-icon" />
        <span>{nomComplet}</span> {/* Affiche le nom complet */}
        <FaCaretDown className="dropdown-icon" />
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="user-info">
              <FaUserCircle className="large-profile-icon" />
              <h3>{nomComplet}</h3> {/* Affiche le nom complet */}
            </div>
            <button onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" /> <span>Se déconnecter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topnav;
