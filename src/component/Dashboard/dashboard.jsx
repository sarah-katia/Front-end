import './Dashboard.css';
import DiagrammeRond from '../Dashboard/charts/DiagrammeRond';
import DiagrammeBarre from '../Dashboard/charts/DiagrammeBarre';
import StatistiqueCard from '../Dashboard/cards/StatistiqueCard';
import PourcentageCard from '../Dashboard/cards/PourcentageCard';
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
  { name: 'Equipe A', value: 10 },
  { name: 'Equipe B', value: 20 },
  { name: 'Equipe C', value: 5 },
  { name: 'MARAM', value: 30 },
  { name: 'AYA SOFIA', value: 15 },
  { name: 'Equipe A', value: 10 },
  { name: 'Equipe B', value: 20 },
  { name: 'Equipe C', value: 5 }, 
  { name: 'Equipe A', value: 10 },
  { name: 'Equipe B', value: 20 },
  { name: 'Equipe C', value: 5 }
];

const data = [
    { name: 'Equipe A', publications: 10, projets: 5 },
    { name: 'Equipe B', publications: 30, projets: 12 },
    { name: 'Equipe C', publications: 5,  projets: 8 },
    { name: 'Equipe A', publications: 10, projets: 5 },
    { name: 'Equipe B', publications: 20, projets: 12 },
    { name: 'Equipe C', publications: 5,  projets: 8 },
    { name: 'Equipe A', publications: 10, projets: 5 },
    { name: 'Equipe B', publications: 30, projets: 12 },
    { name: 'Equipe C', publications: 5,  projets: 8 },
    
  ];

function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
    <div className="dashboard-content">
      <Topnav />
    <div className="dashboard-container">

        <div className="dashboard-actions">
            <button className="btn-update">Mise à jour</button>
            <button className="btn-interval">Statique à intervalle</button>
        </div>

      {/* Cartes chiffres */}
      <div className="dashboard-cards">
        <PourcentageCard data={pourcentage} />
        <div className="small-ones">
        <StatistiqueCard title="Chercheurs" number="45" />
        <StatistiqueCard title="Publications" number="120" />
        </div>

      </div>

      {/* Diagrammes principaux */}
      <div className="dashboard-charts">
        <DiagrammeRond title="Publications par équipe de recherche" data={fakeDataPublications} />
        <DiagrammeRond title="Chercheurs par équipe de recherche" data={fakeDataPublications} />
      </div>

      <div className="dashboard-charts">
      <GroupedBarChart data={data} />
      <DiagrammeBarre data={fakeDataChercheurs} />
      </div>

      <div className="dashboard-charts">
        <DiagrammeRond title="Publications par équipe de recherche" data={fakeDataPublications} />
        <DiagrammeRond title="Chercheurs par équipe de recherche" data={fakeDataPublications} />
      </div>
      
      </div>
     </div>
    </div>
  );
}

export default Dashboard;
