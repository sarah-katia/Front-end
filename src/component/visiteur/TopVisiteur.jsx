import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaCaretDown , FaSignOutAlt} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Koudil from "../../assets/Koudil.png" ; 
import "./TopVisiteur.css";

const TopVisiteur = () => {


  const getTitle = () => {
    switch (location.pathname) {
      case "/Page_visiteur1":
        return "Liste des chercheurs";
        case "/Page_visiteur2":
          return "Liste des publications";
     
      default:
        return "Recherche";
    }
  };

  return (
    <div className="top-navV">
      <h2 className="page-titleV">{getTitle()}</h2>
      
      </div>
  );
};

export default TopVisiteur;