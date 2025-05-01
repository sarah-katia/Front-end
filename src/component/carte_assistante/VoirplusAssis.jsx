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
        <TabsHeader/>
        <CarteAssis/>
      
    </div>
  )
}

export default VoirplusAssis
