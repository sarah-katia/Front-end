import React from 'react'
import Sidebardir from "../nav/sidebardir";
import Topnav from '../nav/Topnav';
import { Link } from "react-router-dom";
import logo from "../../assets/LMCS.png"; 
import './AccueilA.css'


function AccueilA() {
    return (
      <div>
        <Sidebardir/>
        <Topnav/>
        
        <div className="home-containerA">
          <img src={logo} alt="LMCS Logo" className="home-logoA" />
          <h1>Bienvenue sur la plateforme LMCS</h1>
          <p>
          Vous pouvez consulter la liste de tous les chercheurs,

modifier leurs comptes et ajouter de nouveaux profils.
         </p>
          
          <div className="home-buttonsA">
           
            <div className="button-rowA">
              <Link to="/gestiondir/chercheur"><button className="btn">Recherche d'un chercheur du laboratoire</button></Link>
              <Link to="/profilAss"><button className="btn">Voir mon profile</button></Link>
              <Link to="/ajouter-chercheur"><button className="btn">Ajouter un chercheur</button></Link>
            </div>
            
            
            <div className="button-rowA">
              <Link to="/gestiondir/publication"><button className="btn">Rechercher une publication</button></Link>
              <Link to="/AccueilA"><button className="btn">Ajouter une publication</button></Link>
              <Link to="/AccueilA"><button className="btn">Modifier un profile chercheur/publication</button></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default AccueilA
