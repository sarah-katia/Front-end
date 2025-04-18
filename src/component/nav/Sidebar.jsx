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
      <li>
        <Link
            to="/Accueil"
            className={`${prvstyle.navitem} ${location.pathname === "/Accueil" ? prvstyle.active : ""}`}
          >
            <FaHome className="icon" /><span className="text">Accueil</span> 
          </Link>
        </li>
        <li>
          <Link
            to="/Page_recherche1"
            className={`${prvstyle.navitem} ${isActive(["/Page_recherche1", "/Page_recherche2"]) ? prvstyle.active : ""}`}
          >
            <FaSearch className="icon" /> <span className="text">Recherche</span> 
          </Link>
        </li>
        <li>
        <Link
    to="/PageProfile"
    className={`${prvstyle.navitem} ${
      isActive(["/PageProfile", "/component/modifier", "/component/securite"]) ? prvstyle.active : ""
    }`}
  >
            <FaUser className="icon" /> <span className="text">Mon profil</span> 

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
