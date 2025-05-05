import { useEffect, useState } from 'react';
import Sidebar from '../nav/Sidebar';
import Topnav from '../nav/Topnav';
import MonProfil from './Aboutcard';
import Card from '../cartes/mespublicationsBUTTON';
import './MesPubli.css';

export default function Ajouterjournak() {
  const [chercheur, setChercheur] = useState(null);
  
  return (
    <div className="layout-container">
      {/* Sidebar - Fixed width */}
      <div className="sidebar-container">
        <Sidebar />
      </div>
      
      <div className="main-wrapper">
        {/* Top Navigation - Fixed height */}
        <header className="top-nav-container">
          <Topnav />
        </header>
        
        {/* Main Content */}
        <main className="main-content">
          {/* Content Area */}
          <div className="content-area">
            {/* MonProfil Component */}
            <div className="profile-card">
              <MonProfil />
            </div>
            
            {/* Card Component */}
            <div className="publication-card">
              <Card />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}