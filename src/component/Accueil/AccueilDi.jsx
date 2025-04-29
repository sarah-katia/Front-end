import React from 'react'
import SidebarDi from '../nav/SidebarDi'
import Topnav from '../nav/Topnav'
import { Link } from "react-router-dom";
import logo from "../../assets/LMCS.png"; 
function AccueilDi() {
  return (
    <div>
      <SidebarDi/>
      <div>
        <Topnav/>
        
        <div className="home-containerA">
          <img src={logo} alt="LMCS Logo" className="home-logoA" />
          <h1>Bienvenue sur la plateforme LMCS</h1>
          <p>
          Vous pouvez consulter la liste de tous les chercheurs,

          modifier leurs comptes et ajouter de nouveaux profils,
          ainsi que faire la mise à jour et des statistiques
         </p>
          
          <div className="home-buttonsA">
           
            <div className="button-rowA">
              <Link to="/AccueilDi"><button className="btn">Recherche d'un chercheur du laboratoire</button></Link>
              <Link to="/AccueilDi"><button className="btn">Voir les statistiques du laboratoire</button></Link>
              <Link to="/AccueilDi"><button className="btn">Ajouter un chercheur</button></Link>
            </div>
            
            
            <div className="button-rowA">
              <Link to="/AccueilDi"><button className="btn">Faire la mise à jour</button></Link>
              <Link to="/AccueilDi"><button className="btn">Ajouter une publication</button></Link>
              <Link to="/AccueilDi"><button className="btn">Modifier un profil chercheur/publication</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccueilDi
