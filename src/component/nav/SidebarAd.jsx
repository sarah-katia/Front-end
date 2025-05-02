import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaCog,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import logo from "../../assets/LMCS.png";
import "./sidebardir.css";

const SidebarA = () => {
  const location = useLocation();


  return (
    <div className="navbar">
      <div className="logo-container">
        <img src={logo} alt="LMCS Logo" className="logo1" />
      </div>
      <ul className="nav-links">
        <li className={location.pathname === "/ChercheurA" ? "active" : ""}>
          <Link to="/ChercheurA" className="nav-item">
            <FaUser className="icon" />
            <span className="text">Utilisateurs</span>
          </Link>
        </li>

        <li className={location.pathname === "/Confirmation" ? "active" : ""}>
          <Link to="/Confirmation" className="nav-item">
            <FaCog className="icon" />
            <span className="text">Confirmation</span>
          </Link>
        </li>
 

        <li className={location.pathname === "/ProfilAdmin" || location.pathname === "/ModifierAdmin" ? "active" : ""}>
  <Link to="/ProfilAdmin" className="nav-item">
    <FaUser className="icon" />
    <span className="text">Mon profil</span>
  </Link>
</li>

       
          

      </ul>
    </div>
  );
};

export default SidebarA;
