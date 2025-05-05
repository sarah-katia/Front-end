import React from 'react'
import Topnav from '../nav/Topnav'
import Sidebar from '../nav/Sidebar'
import Cartepubli from './cartepubli'
import Pluschercheur from './Pluschercheur'
import pageStyle from './Publichercheur.module.css'; 
function PChercheurplus() {
  return (
    <div>
     <div>
    <Sidebar />  
    <div>
      <Topnav />  
      <div className={pageStyle.pageProfile}>
        <Pluschercheur />
   { /*/<Cartepubli/>*/}  
<Cartepubli/>
      </div>
    </div>
  </div>
     
    </div>
  )
}

export default PChercheurplus
