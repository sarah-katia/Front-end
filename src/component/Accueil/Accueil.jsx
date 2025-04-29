import React from 'react'
import Topnav from '../nav/Topnav'
import Sidebar from '../nav/Sidebar'
import { Link } from "react-router-dom";
import logo from "../../assets/LMCS.png"
import './accueil.css'

function Accueil() {
  return (
    <div>
        <Topnav/>
        <Sidebar/>
        <div className="home-container">
      <img src={logo} alt="LMCS Logo" className="home-logo" />
      <h1>Bienvenue sur la plateforme LMCS</h1>
      <p>
        Retrouvez toutes vos publications et explorez votre activité scientifique en un seul endroit.
      </p>
      <div className="home-buttons">
        <Link to="/Page_recherche1" >  <button className="btn">Recherche d'un chercheur du laboratoire</button></Link>

        <Link to="/PageProfile" ><button className="btn1">Voir mon profil</button></Link>
       <Link  to="/" >  <button className="btn2">Voir mes publications</button></Link>

      
      </div>
    </div>
    </div>
  )
}

export default Accueil
