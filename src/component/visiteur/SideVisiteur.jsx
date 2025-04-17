import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaUser, FaBook } from "react-icons/fa";
import logo from "../../assets/LMCSblanc.png";
import "./SideVisiteur.css";

const SideVisiteur = () => {
  return (
    <div className="navbarV">
      <div className="logo-containerV">
        <img src={logo} alt="LMCS Logo" className="logo1V" />
      </div>
      <ul className="nav-linksV">
        <li className={location.pathname === "/Accueil" ? "active" : ""}>
          <Link to="/" className="nav-itemV">
            <FaHome className="icon" /><span className="text">Page d'acceuil</span> 
          </Link>
        </li>
<li className={
  location.pathname === "/Page_visiteur1" || 
  location.pathname === "/Page_visiteur2" ? "active" : ""
}>          <Link to="/Page_recherche1" className="nav-itemV">
            <FaSearch className="icon" /> <span className="text">Recherche</span> 
          </Link>
        </li>
      
      </ul>
    </div>
  );
};

export default SideVisiteur
