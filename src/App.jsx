import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Flogin from './login/Flogin'
import Mdpoublier from './login/Mdpoublier';
import Nvmdp from './login/Nvmdp';
import Accueil from './component/Accueil/accueil';
import Table_chercheur from './component/table/Table_chercheur';
import Filtre from './component/table/filtre';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>   
      <Routes>
     
      <Route path="/Flogin" element={<Flogin />} />
        <Route path="/Nvmdp" element={<Nvmdp />} />
        <Route path="/Mdpoublier" element={<Mdpoublier/>} />
        <Route path="/Table_chercheur" element={<Table_chercheur />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/Filtre" element={<Filtre />} />

      </Routes>
    </Router>
  )
}

export default App
