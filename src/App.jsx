import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Flogin from './login/Flogin';
import Mdpoublier from './login/Mdpoublier';
import Nvmdp from './login/Nvmdp';

import Accueil from './component/Accueil/Accueil';
import ProfilePage from './component/Mon profile/PageProfile';
import ModifierPage from './component/modifier/PageModifier';
import Cherch from './component/gestionassi/chercheur';
import Pub from './component/gestionassi/publication';
import Add from './component/gestionassi/ajouter-chercheur';

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
import ProfilDi from './component/directrice/profilDi';
import EditDirectrice from './component/directrice/editDi';
import ChercheurTable from './component/directrice/chercheurDi';
import PubTable from './component/directrice/publicationDi';
import AssiTable from './component/directrice/Assistante';
import Dashboard from './component/Dashboard/dashboard';
import Generer from './component/Dashboard/generer';
import Resultats from './component/Dashboard/statresults';




import VoirplusAssis from './component/carte_assistante/VoirplusAssis';
import Topnav from './component/nav/Topnav';
import ModifierAssis from './component/carte_assistante/ModifierAssis';

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

        <Route path="/gestionassi/chercheur" element={<Cherch />} />
        <Route path="/gestionassi/publication" element={<Pub />} />
        <Route path="/ajouter-chercheur" element={<Add />} />
        <Route path="/AccueilA" element={<AccueilA />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generer" element={<Generer />} />
        <Route path="/statresults" element={<Resultats />} />

        <Route path="/editassi" element={< EditAssistantProfile assistant={{
                                                                    nom: "Sarah",
                                                                    prenom: "Katia",
                                                                    email: "assistante@esi.dz",
                                                                    telephone: "0654545258",
                                                                    role: "Assistante"
                                                                    }} />} />

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

        <Route path="/directrice/chercheurDi" element={<ChercheurTable />} />
        <Route path="/directrice/publicationDi" element={<PubTable />} />
        <Route path="/directrice/Assistante" element={<AssiTable />} />
        <Route path="/AccueilDi" element={<AccueilDi />} />

        <Route path="/profilDi" element={< ProfilDi chercheur={chercheurActif} />} />
        <Route path="/editDi" element={< EditDirectrice assistant={{
                                                                            nom: "Benatchba",
                                                                            prenom: "Karima",
                                                                            email: "directrice@esi.dz",
                                                                            telephone: "06 98 30 05 04 ",
                                                                            role: "Directrice"
                                                                            }} />} />




        <Route path="/VoirplusAssis" element={<VoirplusAssis />} />
        <Route path="/ModifierAssis" element={<ModifierAssis />} />


      </Routes>
    </Router>
  );
}


export default App;
