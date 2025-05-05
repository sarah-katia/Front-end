import React from 'react';
import Topnav from '../nav/Topnav';
import Sidebardirectrice from '../nav/SidebarDi';
import Sidebarchercheur from '../nav/Sidebar';
import Sidebarassistante from '../nav/sidebarAssi';
import { useLocation } from 'react-router-dom';
import Publication from './publication';

function VoirplusPub() {
  const location = useLocation();
  const sidebarType = location.state?.Sidebar || 'assistante';

  let SidebarComponent;
  switch (sidebarType) {
    case 'assistante':
      SidebarComponent = Sidebarassistante;
      break;
    case 'directrice':
      SidebarComponent = Sidebardirectrice;
      break;
    case 'chercheur':
      SidebarComponent = Sidebarchercheur;
      break;
    default:
      SidebarComponent = Sidebarassistante;
  }

  return (
    <div>
      <Topnav />
      <SidebarComponent />
      <Publication />
    </div>
  );
}

export default VoirplusPub;
