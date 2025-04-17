import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './TabVisiteur.css';

const TabVisiteur = () => {
  const location = useLocation();

  return (
    <div className="tab-barV">
      <NavLink
        to="/Page_visiteur1"
        className={`tabV ${location.pathname === '/Page_visiteur1' ? 'active' : ''}`}
      >
        
        Chercheurs
      </NavLink>

      <NavLink
        to="/Page_visiteur2"
        className={`tabV ${location.pathname === '/Page_visiteur2' ? 'active' : ''}`}
      >
        Publications
      </NavLink>

      <div className="tab-indicatorV"></div>
    </div>
  );
};

export default TabVisiteur;
