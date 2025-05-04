import './results.css';
import { useNavigate, useLocation } from 'react-router-dom';
import DiagrammeRond from '../Dashboard/charts/DiagrammeRond';
import DiagrammeBarre from '../Dashboard/charts/DiagrammeBarre';
import GroupedBarChart from './charts/GroupedBarChart';
import Sidebar from '../nav/SidebarDi';
import Topnav from '../nav/Topnav';
import LineChartComponent from './charts/LineChartComponent'; // À créer

const fakeDataPublications = [
  { name: 'Articles', value: 40 },
  { name: 'Conférences', value: 30 },
  { name: 'Chapitres', value: 50 },
  { name: 'Livres', value: 10 },
];

const fakeDataChercheurs = [
  { name: 'Mouloud Koudil', value: 10 },
  { name: 'Kermi Adel', value: 20 },
  // ...
];

const allYearData = [
  { name: '2019', publications: 10 },
  { name: '2020', publications: 30 },
  { name: '2021', publications: 8 },
  { name: '2022', publications: 10 },
  { name: '2023', publications: 20 },
  { name: '2024', publications: 5 },
];

function Statresults() {
  const navigate = useNavigate();
  const { critere, dateDebut, dateFin } = useLocation().state || {};

  const yearData = allYearData.filter(d => {
    const y = parseInt(d.name, 10);
    return (!dateDebut || y >= dateDebut) && (!dateFin || y <= dateFin);
  });

// 2) Titre dynamique = critère + éventuellement intervalle
const yearChartTitle =
  dateDebut && dateFin
    ? `${critere} (${dateDebut} - ${dateFin})`
    : critere;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        <Topnav />
        <div className="dashboard-container">

          <div className="dashboard-charts">
            {/* 1. Diagramme rond + barres pour la majorité */}
            {[
              'Nombre de publication par equipe',
              'Nombre de publication par date',
              'Meilleur classement des pubs selon les quatres sites',
              'Nombre de chercheur par grade de recherche',
              'Nombre de chercheur par equipe'
            ].includes(critere) && (
              <>
                <DiagrammeRond title={yearChartTitle} data={fakeDataPublications} />
                <DiagrammeBarre title={yearChartTitle} data={fakeDataPublications} />
              </>
            )}

            {/* 2. H-index : uniquement barres */}
            {critere === 'Chercheur avec le meilleur H-index' && (
              <DiagrammeBarre title={yearChartTitle} data={fakeDataChercheurs} />
            )}

            {/* 3. Taux de croissance : courbe */}
            {critere === 'Taux de croissance des pubs entre chaque deux ans' && (
              <div className="linechart">
                {/* Remplace ci-dessous par ton vrai composant */}
                <LineChartComponent title={yearChartTitle} data={yearData} /> 
              </div>
            )}
          </div>

          <div className="dashboard-actions">
            <button type="button" onClick={() => navigate(-1)}>Annuler</button>
            <button className="btn-interval">Importer en Excel</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Statresults;
