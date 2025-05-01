import './results.css';
import { useNavigate, useLocation } from 'react-router-dom';
import DiagrammeRond from '../Dashboard/charts/DiagrammeRond';
import DiagrammeBarre from '../Dashboard/charts/DiagrammeBarre';
import GroupedBarChart from './charts/GroupedBarChart';
import Sidebar from '../nav/SidebarDi';
import Topnav from '../nav/Topnav';

const fakeDataPublications = [
  { name: 'Articles', value: 40 },
  { name: 'Conférences', value: 30 },
  { name: 'Chapitres', value: 50 },
  { name: 'Livres', value: 10 },
];

const pourcentage = [
    { name: 'Articles', value: 90 },
    { name: 'Conférences', value: 50 },
    { name: 'Livres', value: 20 }
]

const fakeDataChercheurs = [
  { name: 'Mouloud Koudil', value: 10 },
  { name: 'Kermi Adel', value: 20 },
  { name: 'SiTayeb Fatima', value: 5 },
  { name: 'BenBouzid Mohamed', value: 30 },
  { name: 'AYA SOFIA', value: 15 },
  { name: 'Khelouat Boualem', value: 10 },
  { name: 'Artabaz Saliha', value: 20 },
  { name: 'Equipe C', value: 5 }, 
  { name: 'Equipe A', value: 10 }
];

const data = [
    { name: '2019', publications: 10, projets: 5 },
    { name: '2020', publications: 30, projets: 17 },
    { name: '2021', publications: 8,  projets: 4 },
    { name: '2022', publications: 10, projets: 16 },
    { name: '2023', publications: 20, projets: 12 },
    { name: '2024', publications: 5,  projets: 8 },
  ];



function Statresults() {

  const navigate = useNavigate(); 
  const location = useLocation();

  const { critere, dateDebut, dateFin } = location.state || {};

  console.log("Critère :", critere);
  console.log("Date début :", dateDebut);
  console.log("Date fin :", dateFin);
  

  return (

    <div className="dashboard-wrapper">
      <Sidebar />
    <div className="dashboard-content">
      <Topnav />
    <div className="dashboard-container">

      {/* Diagrammes principaux */}

      <div className="dashboard-charts">
      <div className="piechart">
      <DiagrammeRond title="Publications classée sur Scimago" data={fakeDataPublications} />
      </div>
      <GroupedBarChart title="Nombre de publications (6 dernières années)" data={data} />
      </div>


      <div className="dashboard-actions">
            <button type="button" onClick={() => navigate(-1)} >Annuler</button>
            <button className="btn-interval" >Importer En Excel</button>
        </div>
      
      </div>
     </div>
    </div>
  );
}

export default Statresults;
