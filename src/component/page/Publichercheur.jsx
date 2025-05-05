import React from 'react'
import Topnav from '../nav/Topnav'
import Sidebar from '../nav/Sidebar'
import Cartepubli from './cartepubli' 

import ProfileCard from '../Mon profile/Profilecard'
import pageStyle from './Publichercheur.module.css';  
import Card from '../cartes/mespublicationsBUTTON'
function Publichercheur() {
  return (
    <div>
    <Sidebar />  
    <div>
      <Topnav />  
      <div className={pageStyle.pageProfile}>
        <ProfileCard />
   { /*/<Cartepubli/>*/}  
<Card/>
      </div>
    </div>
  </div>
  )
}

export default Publichercheur
