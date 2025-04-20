import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaUser,
  FaBook,
  FaCog,
  FaTable,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import logo from "../../assets/LMCS.png";
import "./sidebardir.css";

const Sidebar = () => {
  const location = useLocation();
  const chercheurPaths = [
    "/gestiondir/chercheur",
    "/ajouter-chercheur"
  ];
  
  const publicationPaths = [
    "/gestiondir/publication",
    "/ajouter-publication"
  ];
  
  const isChercheurActive = chercheurPaths.includes(location.pathname);
  const isPublicationActive = publicationPaths.includes(location.pathname);

    // ✅ Nouveau : détecter si un sous-menu de Gestion est actif
  const isSubGestionActive = isChercheurActive || isPublicationActive;

  // ✅ Modification : ouvrir Gestion par défaut si un sous-item est actif
  const [isGestionOpen, setIsGestionOpen] = useState(isSubGestionActive);

  // ✅ Mettre à jour si l'utilisateur navigue
  useEffect(() => {
    if (isSubGestionActive) {
      setIsGestionOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="navbar">
      <div className="logo-container">
        <img src={logo} alt="LMCS Logo" className="logo1" />
      </div>
      <ul className="nav-links">
        <li className={location.pathname === "/Accueil" ? "active" : ""}>
          <Link to="/Accueil" className="nav-item">
            <FaHome className="icon" />
            <span className="text">Accueil</span>
          </Link>
        </li>


        <li className={  ["/profilAss", "/editassi"].includes(location.pathname) ? "active" : ""}>
          <Link to="/profilAss" className="nav-item">
            <FaUser className="icon" />
            <span className="text">Mon profil</span>
          </Link>
        </li>

        {/* ✅ Toggle Gestion + ajout de classe "active" si sous-menu actif */}
        <li
          onClick={() => setIsGestionOpen(!isGestionOpen)}
          className={`dropdown-toggle ${isSubGestionActive ? "active" : ""}`}
        >
          <div className="nav-item">
            <FaCog className="icon" />
            <span className="text">Gestion</span>
            {isGestionOpen ? (
              <IoIosArrowUp className="arrow" />
            ) : (
              <IoIosArrowDown className="arrow" />
            )}
          </div>
        </li>

        {/* ✅ Sous-menus de Gestion */}
        {isGestionOpen && (
          <>
<li className={isChercheurActive ? "active" : ""}>
  <Link to="/gestiondir/chercheur" className="nav-item sub-item">
    <FaUser className="icon" />
    <span className="text">Chercheurs</span>
  </Link>
</li>

<li className={isPublicationActive ? "active" : ""}>
  <Link to="/gestiondir/publication" className="nav-item sub-item">
    <FaBook className="icon" />
    <span className="text">Publications</span>
  </Link>
</li>
          </>
        )}

      </ul>
    </div>
  );
};

export default Sidebar;
