import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
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
];

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

function Dashboard() {
  const navigate = useNavigate();

  const handleIntervalClick = () => {
    navigate('/generer');
  };

  return (
    <div className={styles.dashboardwrapper}>
      <Sidebar />
      <div className={styles.dashboardcontent}>
        <Topnav />
        <div className={styles.dashboardcontainer}>

          <div className={styles.dashboardactions}>
            <button className={styles.btnupdate}>Mise à jour</button>
            <button className={styles.btninterval} onClick={handleIntervalClick}>
              Statistique à intervalle
            </button>
          </div>

          <div className={styles.dashboardcards}>
            <PourcentageCard data={pourcentage} />
            <div className={styles.smallones}>
              <StatistiqueCard title="Chercheurs" number="45" />
              <StatistiqueCard title="Publications" number="120" />
            </div>
          </div>

          <div className={styles.dashboardCharts}>
            <DiagrammeRond title="Publications par équipe de recherche" data={fakeDataPublications} />
            <DiagrammeRond title="Chercheurs par équipe de recherche" data={fakeDataPublications} />
          </div>

          <div className={styles.dashboardCharts}>
            <GroupedBarChart title="Nombre de publications (6 dernières années)" data={data} />
            <DiagrammeBarre data={fakeDataChercheurs} />
          </div>

          <div className={styles.dashboardCharts}>
            <DiagrammeRond title="Publications classée sur Scimago" data={fakeDataPublications} />
            <DiagrammeRond title="Publications classée sur CORE" data={fakeDataPublications} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
