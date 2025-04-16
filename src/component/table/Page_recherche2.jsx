import React from 'react'
import Sidebar from '../nav/Sidebar'
import Topnav from '../nav/Topnav'
import TabBar from './TabBar'
import Table_pub from './Table_pub'
function Page_recherche2() {
  return (
    <div>
        <Sidebar/>
        <Topnav/>
        <TabBar  />
      
      <Table_pub/>
    </div>
  )
}

export default Page_recherche2
