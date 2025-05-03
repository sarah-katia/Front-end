import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCaretDown, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./Topnav.css";

const Topnav = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [nomComplet, setNomComplet] = useState("");
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les données utilisateur du localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      
      // Déterminer le nom complet en fonction de la structure des données
      let fullName = "";
      
      // Vérifier si c'est un chercheur avec nom_complet
      if (parsedUser.chercheur && parsedUser.chercheur.nom_complet) {
        fullName = parsedUser.chercheur.nom_complet;
      } 
      // Vérifier si on a des champs nom et prénom séparés (pour chercheur, directeur, assistant)
      else if (parsedUser.chercheur && parsedUser.chercheur.nom && parsedUser.chercheur.prenom) {
        fullName = `${parsedUser.chercheur.prenom} ${parsedUser.chercheur.nom}`;
      }
      else if (parsedUser.nom && parsedUser.prenom) {
        fullName = `${parsedUser.prenom} ${parsedUser.nom}`;
      }
      // Si c'est un directeur ou assistant
      else if (parsedUser.directeur && parsedUser.directeur.nom && parsedUser.directeur.prenom) {
        fullName = `${parsedUser.directeur.prenom} ${parsedUser.directeur.nom}`;
      }
      else if (parsedUser.assistant && parsedUser.assistant.nom && parsedUser.assistant.prenom) {
        fullName = `${parsedUser.assistant.prenom} ${parsedUser.assistant.nom}`;
      }
      // Fallback: utiliser le nom de la propriété la plus probable si elle existe
      else if (parsedUser.nom_complet) {
        fullName = parsedUser.nom_complet;
      }
      // Si aucun nom n'est trouvé, utiliser le mail ou un placeholder
      else if (parsedUser.Mails || parsedUser.email) {
        fullName = parsedUser.Mails || parsedUser.email;
      }
      else {
        fullName = "Utilisateur";
      }
      
      setNomComplet(fullName);
    }
  }, []);

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
        <span>{nomComplet}</span>
        <FaCaretDown className="dropdown-icon" />
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="user-info">
              <FaUserCircle className="large-profile-icon" />
              <h3>{nomComplet}</h3>
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