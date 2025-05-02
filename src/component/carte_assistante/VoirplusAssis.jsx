import React from 'react'
import CarteAssis from './CarteAssis'
import SidebarDi from '../nav/SidebarDi'
import Topnav from '../nav/Topnav'
import TabsHeader from '../gestionassi/Tabsheader'

function VoirplusAssis() {
  return (
    <div>
        <Topnav/>
        <SidebarDi/>
       
          <TabsHeader   tabs={[
            { label: "Chercheurs", path: "/directrice/chercheurDi" },
            { label: "Publications", path: "/directrice/publicationDi" },
            { label: "Assistante", path: "/directrice/Assistante" },
          
          ]} />
        <CarteAssis/>
      
    </div>
  )
}

export default VoirplusAssis
