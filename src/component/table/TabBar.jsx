import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './tabBar.css';

const TabBar = () => {
  const location = useLocation();

  return (
    <div className="tab-bar">
      <NavLink
        to="/Page_recherche1"
        className={`tab ${location.pathname === '/Page_recherche1' ? 'active' : ''}`}
      >
        Chercheurs
      </NavLink>

      <NavLink
        to="/Page_recherche2"
        className={`tab ${location.pathname === '/Page_recherche2' ? 'active' : ''}`}
      >
        Publications
      </NavLink>

      <div className="tab-indicator"></div>
    </div>
  );
};

export default TabBar;
