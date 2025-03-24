import React from 'react'
import Topnav from '../nav/Topnav'
import Sidebar from '../nav/Sidebar'
function Accueil() {
  return (
    <div>
        <Topnav/>
        <Sidebar/>
        <div className="home-container">
      <img src="/logo.png" alt="LMCS Logo" className="home-logo" />
      <h1>Bienvenue sur la plateforme LMCS</h1>
      <p>
        Retrouvez toutes vos publications et explorez votre activité scientifique en un seul endroit.
      </p>
      <div className="home-buttons">
        <button className="btn">Recherche d'un chercheur du laboratoire</button>
        <button className="btn">Voir mon profile</button>
        <button className="btn">Voir mes publications</button>
      </div>
    </div>
    </div>
  )
}

export default Accueil
