import React from 'react'
import Topnav from '../nav/Topnav'
import SidebarDi from '../nav/SidebarDi'
import CarteAjouterAssis from './CarteAjouterAssis'
import TabsHeader from '../gestionassi/Tabsheader'

function AjouterAssis() {
  return (
    <div>
      <Topnav/>
      <SidebarDi/>
        <TabsHeader   tabs={[
          { label: "Chercheurs", path: "/directrice/chercheurDi" },
          { label: "Publications", path: "/directrice/publicationDi" },
          { label: "Assistante", path: "/directrice/Assistante" },
        ]} />
      <CarteAjouterAssis/>
    </div>
  )
}

export default AjouterAssis
