import React from 'react'
import Topnav from '../nav/Topnav'
import Sidebar from '../nav/Sidebar'
import Table_chercheur from './Table_chercheur'
import TabBar from './TabBar'
function Page_recherche1() {
  return (
    <div>
      <Topnav/>
<Sidebar/>
<TabBar/>



<Table_chercheur/>
    </div>
  )
}

export default Page_recherche1
