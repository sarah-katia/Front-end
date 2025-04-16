import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Flogin from './login/Flogin'
import Mdpoublier from './login/Mdpoublier';
import Nvmdp from './login/Nvmdp';
import Accueil from './component/Accueil/Accueil';
import Table_chercheur from './component/table/Table_chercheur';
import Filtre from './component/table/filtre';
import ProfilePage from './component/Mon profile/PageProfile';
import ModifierPage from './component/modifier/PageModifier';
import Sidebar from './component/nav/Sidebar';
import koudilpic from './assets/koudil.png';
import Page_recherche1 from './component/table/Page_recherche1';
import Page_recherche2 from './component/table/Page_recherche2';
function App() {
  const [count, setCount] = useState(0)
  const chercheurActif = {
    nom: "Koudil",
    prenom: "Mouloud",
    grade: "Directeur de recherche",
    photo: koudilpic,
    email: "m_koudil@esi.dz",
    phone: "0698 30 05 04",
    diplome: "Doctorat d'État",
    publications: 79,
    id:230084,
    orcid: "0000-0001-9022",
    hIndex: 16,
    qualité: "Enseignant chercheur",
    status: "Actif",
    team: "Codesign",
    isTeamLeader: "Oui",
    institution: "ESI (Ecole Nationale Supérieure d'Informatique)",
    googleScholar: "https://scholar.google.com/citations?user=9Zbx-EYAAAAJ&hl=fr",
  };

  
  return (
    <Router>   
      <Routes>
      <Route path="/Flogin" element={<Flogin />} />
        <Route path="/Nvmdp" element={<Nvmdp />} />
        <Route path="/Mdpoublier" element={<Mdpoublier/>} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/Mon profile" element={<ProfilePage chercheur={chercheurActif} />} />
        <Route path="/component/modifier/*" element={<ModifierPage chercheur={chercheurActif} />} />
        <Route path="/Page_recherche1" element={<Page_recherche1 />} />
        <Route path="/Page_recherche2" element={<Page_recherche2 />} />

      </Routes>
    </Router>
  )
}

export default App
