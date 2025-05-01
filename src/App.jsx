import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Flogin from './login/Flogin';
import Mdpoublier from './login/Mdpoublier';
import Nvmdp from './login/Nvmdp';
import Accueil from './component/Accueil/Accueil';
import ProfilePage from './component/Mon profile/PageProfile';
import ModifierPage from './component/modifier/PageModifier';
import Cherch from './component/gestiondir/chercheur';
import Pub from './component/gestiondir/publication';
import Add from './component/gestiondir/ajouter-chercheur';
import Prrofil from './component/assistante/profilAss';
import EditAssistantProfile from './component/assistante/editassi';
import koudilpic from './assets/koudil.png';
import Page_recherche1 from './component/table/Page_recherche1';
import Page_recherche2 from './component/table/Page_recherche2';
import Page_visiteur1 from './component/visiteur/Page_visiteur1';
import Page_visiteur2 from './component/visiteur/Page_visiteur2';
import AccueilA from './component/assistante/AccueilA';
import ChercheurA from './admine/ChercheurA';
import Confirmation from './admine/Confimation';
import AccueilDi from './component/Accueil/AccueilDi';
import Dashboard from './component/Dashboard/dashboard';
import VoirplusAssis from './component/carte_assistante/VoirplusAssis';
import Topnav from './component/nav/Topnav';
import ModifierAssis from './component/carte_assistante/ModifierAssis';
function App() {
  const [connectedUser, setConnectedUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setConnectedUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    
    <Router>
       

      <Routes>
      <Route path="/Topnav" element={<Topnav user={connectedUser} />} />
        <Route path="/Flogin" element={<Flogin />} />
        <Route path="/Nvmdp" element={<Nvmdp />} />
        <Route path="/Mdpoublier" element={<Mdpoublier />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/gestiondir/chercheur" element={<Cherch />} />
        <Route path="/gestiondir/publication" element={<Pub />} />
        <Route path="/ajouter-chercheur" element={<Add />} />
        <Route path="/AccueilA" element={<AccueilA />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Pages qui utilisent les infos de l'utilisateur connecté */}
        <Route path="/profilAss" element={<Prrofil chercheur={connectedUser} />} />
        <Route path="/PageProfile" element={<ProfilePage chercheur={connectedUser} />} />
        <Route path="/component/modifier/*" element={<ModifierPage chercheur={connectedUser} />} />

        {/* Visiteurs */}
        <Route path="/Page_recherche1" element={<Page_recherche1 />} />
        <Route path="/Page_recherche2" element={<Page_recherche2 />} />
        <Route path="/Page_visiteur1" element={<Page_visiteur1 />} />
        <Route path="/Page_visiteur2" element={<Page_visiteur2 />} />

        <Route path="/ChercheurA" element={<ChercheurA />} />
        <Route path="/Confirmation" element={<Confirmation />} />
        <Route path="/AccueilDi" element={<AccueilDi />} />

        <Route path="/VoirplusAssis" element={<VoirplusAssis />} />
        <Route path="/ModifierAssis" element={<ModifierAssis />} />

      </Routes>
    </Router>
  );
}

export default App;
