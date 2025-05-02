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

const fakeDataChercheurs = [
  { name: 'Mouloud Koudil', value: 10 },
  { name: 'Kermi Adel', value: 20 },
  // …
];

// toutes tes données annuelles
const allYearData = [
  { name: '2019', publications: 10, projets: 5 },
  { name: '2020', publications: 30, projets: 17 },
  { name: '2021', publications: 8,  projets: 4 },
  { name: '2022', publications: 10, projets: 16 },
  { name: '2023', publications: 20, projets: 12 },
  { name: '2024', publications: 5,  projets: 8 },
];

function Statresults() {
  const navigate = useNavigate();
  const { critere, dateDebut, dateFin } = useLocation().state || {};

  // 1) Filtrer les données annuelles si le critère est “par date”
  let yearData = allYearData;
  if (critere?.includes('date') && dateDebut && dateFin) {
    yearData = allYearData.filter(d => {
      const y = parseInt(d.name, 10);
      return y >= dateDebut && y <= dateFin;
    });
  }

  // 2) Construire un titre dynamique
  const yearChartTitle = critere?.includes('date')
    ? `Nombre de publications de ${dateDebut} à ${dateFin}`
    : 'Nombre de publications (toutes années)';

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        <Topnav />
        <div className="dashboard-container">



          <div className="dashboard-charts">
            {/* Si par équipe, on affiche un camembert */}
            {critere === 'nombre de publication par equipe' && (
              <DiagrammeRond
                title="Répartition des publications par équipe"
                data={fakeDataChercheurs}
              />
            )}

            {/* Si par date, on affiche un bar chart groupé */}
            {critere === 'nombre de publication par date' && (
              <>
              <div className='piechart'>
              <DiagrammeRond title={yearChartTitle} data={fakeDataPublications} />
              </div>
              <GroupedBarChart title={yearChartTitle} data={yearData} />
              </>
            )}
          </div>

          <div className="dashboard-actions">
            <button type="button" onClick={() => navigate(-1)}>
              Annuler
            </button>
            <button className="btn-interval">
              Importer en Excel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Statresults;
