import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaUser, FaBook } from "react-icons/fa";
import logo from "../../assets/LMCSblanc.png";
import prvstyle from "./Sidebar.module.css";

const Sidebar = () => {

  const location = useLocation(); 
  const isActive = (paths) => paths.some((p) => location.pathname.startsWith(p));


  return (
    <div className={prvstyle.navbar}>
      <div className={prvstyle.logocontainer}>
        <img src={logo} alt="LMCS Logo" className={prvstyle.logo1} />
      </div>

      <ul className="nav-links">
        <li className={location.pathname === "/Accueil" ? "active" : ""}>
          <Link to="/Accueil" className="nav-item">
            <FaHome className="icon" /><span className="text">Accueil</span> 
          </Link>
        </li>
<li className={
  location.pathname === "/Page_recherche1" || 
  location.pathname === "/Page_recherche2" ? "active" : ""
}>          <Link to="/Page_recherche1" className="nav-item">
            <FaSearch className="icon" /> <span className="text">Recherche</span> 
          </Link>
        </li>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/Mon profile" className="nav-item">
            <FaUser className="icon" /> <span className="text">Mon profile</span> 

          </Link>
        </li>
        <li>
        <Link
            to="/"
            className={`${prvstyle.navitem} ${location.pathname === "/" ? prvstyle.active : ""}`}
          >
            <FaBook className={prvstyle.icon} /> <span className={prvstyle.text}>Mes publications</span> 
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
