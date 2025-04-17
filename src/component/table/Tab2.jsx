import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../visiteur/TabVisiteur.css'

const Tab2 = () => {
  const location = useLocation();

  return (
    <div className="tab-barV">
      <NavLink
        to="/Page_recherche1"
        className={`tabV ${location.pathname === '/Page_recherche1' ? 'active' : ''}`}
      >
        Chercheurs
      </NavLink>

      <NavLink
        to="/Page_recherche2"
        className={`tabV ${location.pathname === '/Page_recherche2' ? 'active' : ''}`}
      >
        Publications
      </NavLink>

      <div className="tab-indicatorV"></div>
    </div>
  );
};

export default Tab2;
