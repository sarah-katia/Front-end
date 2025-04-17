import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../table/TabBar.css'

const Tab1 = () => {
  const location = useLocation();

  return (
    <div className="tab-bar">
      <NavLink
        to="/Page_visiteur1"
        className={`tab ${location.pathname === '/Page_visiteur1' ? 'active' : ''}`}
      >
        Chercheurs
      </NavLink>

      <NavLink
        to="/Page_visiteur2"
        className={`tab ${location.pathname === '/Page_visiteur2' ? 'active' : ''}`}
      >
        Publications
      </NavLink>

      <div className="tab-indicator"></div>
    </div>
  );
};

export default Tab1;
