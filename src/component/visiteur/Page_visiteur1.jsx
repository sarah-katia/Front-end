import React from 'react'
import SideVisiteur from './SideVisiteur'
import TopVisiteur from './TopVisiteur'
import Table_chercheur from '../table/Table_chercheur'
import Tab1 from './Tab1'
function Page_visiteur1() {
  return (
    <div>
      <SideVisiteur/>
      <TopVisiteur/>
      <Tab1/>
      <Table_chercheur/>
     
    </div>
  )
}

export default Page_visiteur1
