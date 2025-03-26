import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaUser, FaBook } from "react-icons/fa";
import logo from "../../assets/LMCSblanc.png";
import "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className="navbar">
      <div className="logo-container">
        <img src={logo} alt="LMCS Logo" className="logo1" />
      </div>
      <ul className="nav-links">
        <li className={location.pathname === "/Accueil" ? "active" : ""}>
          <Link to="/" className="nav-item">
            <FaHome className="icon" /><span className="text">Accueil</span> 
          </Link>
        </li>
        <li className={location.pathname === "/Table_chercheur" ? "active" : ""}>
          <Link to="/" className="nav-item">
            <FaSearch className="icon" /> <span className="text">Recherche</span> 
          </Link>
        </li>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/" className="nav-item">
            <FaUser className="icon" /> <span className="text">Mon profile</span> 
          </Link>
        </li>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/" className="nav-item">
            <FaBook className="icon" /> <span className="text">Mes publications</span> 
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
