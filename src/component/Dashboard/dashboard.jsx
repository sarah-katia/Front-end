import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Dashboard.module.css';
import DiagrammeRond from '../Dashboard/charts/DiagrammeRond';
import DiagrammeBarre from '../Dashboard/charts/DiagrammeBarre';
import StatistiqueCard from '../Dashboard/cards/StatistiqueCard';
import PourcentageCard from '../Dashboard/cards/PourcentageCard';
import GroupedBarChart from './charts/GroupedBarChart';
import Sidebar from '../nav/SidebarDi';
import Topnav from '../nav/Topnav';

const API_BASE_URL = 'http://localhost:3001/dashboard';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalChercheurs: 0, totalPublications: 0 });
  const [publicationsByTeam, setPublicationsByTeam] = useState([]);
  const [chercheursByTeam, setChercheursByTeam] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [topChercheurs, setTopChercheurs] = useState([]);
  const [pourcentagePublications, setPourcentagePublications] = useState([]);
  const [scimagoPublications, setScimagoPublications] = useState([]);
  const [corePublications, setCorePublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          statsResponse,
          publicationsByTeamResponse,
          chercheursByTeamResponse,
          yearlyStatsResponse,
          topChercheursResponse,
          pourcentageResponse,
          scimagoResponse,
          coreResponse,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/stats`),
          axios.get(`${API_BASE_URL}/publications-by-team`),
          axios.get(`${API_BASE_URL}/chercheurs-by-team`),
          axios.get(`${API_BASE_URL}/yearly-stats`),
          axios.get(`${API_BASE_URL}/top-chercheurs`),
          axios.get(`${API_BASE_URL}/pourcentage-publications`),
          axios.get(`${API_BASE_URL}/scimago-publications`),
          axios.get(`${API_BASE_URL}/core-publications`)
        ]);

        setStats(statsResponse.data);
        setPublicationsByTeam(publicationsByTeamResponse.data);
        setChercheursByTeam(chercheursByTeamResponse.data);
        setYearlyStats(yearlyStatsResponse.data);
        setTopChercheurs(topChercheursResponse.data);
        setPourcentagePublications(pourcentageResponse.data);
        setScimagoPublications(scimagoResponse.data);
        setCorePublications(coreResponse.data);
      } catch (err) {
        setError('Erreur lors du chargement des données du tableau de bord');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleIntervalClick = () => {
    navigate('/generer');
  };

  if (loading) {
    return <div className={styles.dashboardwrapper}>Chargement...</div>;
  }

  if (error) {
    return <div className={styles.dashboardwrapper}>{error}</div>;
  }

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
            <PourcentageCard data={pourcentagePublications} />
            <div className={styles.smallones}>
              <StatistiqueCard title="Chercheurs" number={stats.totalChercheurs} />
              <StatistiqueCard title="Publications" number={stats.totalPublications} />
            </div>
          </div>
          <div className={styles.dashboardCharts}>
            <DiagrammeRond title="Publications par équipe de recherche" data={publicationsByTeam} />
            <DiagrammeRond title="Chercheurs par équipe de recherche" data={chercheursByTeam} />
          </div>
          <div className={styles.dashboardCharts}>
            <GroupedBarChart title="Nombre de publications (6 dernières années)" data={yearlyStats} />
            <DiagrammeBarre data={topChercheurs} />
          </div>
          <div className={styles.dashboardCharts}>
            <DiagrammeRond title="Publications classée sur Scimago" data={scimagoPublications} />
            <DiagrammeRond title="Publications classée sur CORE" data={corePublications} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;