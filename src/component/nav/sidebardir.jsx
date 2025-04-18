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

  // ✅ Nouveau : détecter si un sous-menu de Gestion est actif
  const isSubGestionActive =
    location.pathname === "/gestiondir/chercheur" ||
    location.pathname === "/gestiondir/publication";

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

        <li className={
          location.pathname === "/Page_recherche1" || 
          location.pathname === "/Page_recherche2" ? prvstyle.active : ""}
          >
                      <Link to="/Page_recherche1" className="nav-item">
            <FaSearch className="icon" />
            <span className="text">Recherche</span>
          </Link>
        </li>

        <li className={location.pathname === "/PageProfile" ? "active" : ""}>
          <Link to="/PageProfile" className="nav-item">
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
            <li className={location.pathname === "/gestiondir/chercheur" ? "active" : ""}>
              <Link to="/gestiondir/chercheur" className="nav-item sub-item">
                <FaUser className="icon" />
                <span className="text">Chercheurs</span>
              </Link>
            </li>
            <li className={location.pathname === "/gestiondir/publication" ? "active" : ""}>
              <Link to="/gestiondir/publication" className="nav-item sub-item">
                <FaBook className="icon" />
                <span className="text">Publications</span>
              </Link>
            </li>
          </>
        )}

        <li className={location.pathname === "/Dashboard" ? "active" : ""}>
          <Link to="/Dashboard" className="nav-item">
            <FaTable className="icon" />
            <span className="text">Dashboard</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
