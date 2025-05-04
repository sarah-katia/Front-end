import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import SidebarA from '../component/nav/SidebarAd';
import Topnav from '../component/nav/Topnav';

function ChercheurA() {
  const navigate = useNavigate();
  const [chercheurs, setChercheurs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les chercheurs depuis l'API
  useEffect(() => {
    const fetchChercheurs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/chercheur/');
        
        if (response.data && response.data.data) {
          // Mapping des données de l'API pour correspondre à la structure actuelle
          const formattedData = response.data.data.map(chercheur => ({
            id: chercheur.id || chercheur._id,
            photo: chercheur.photo || "https://via.placeholder.com/50",
            nom: chercheur.nom_complet || `${chercheur.nom || ''} ${chercheur.prenom || ''}`,
            prenom: chercheur.prenom || '',
            phone: chercheur.phone || chercheur.Tél || '',
            email: chercheur.email || chercheur.Mails || '',
            role: chercheur.role || chercheur.Rôle || ''
          }));
          
          setChercheurs(formattedData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des chercheurs:", error);
        setLoading(false);
      }
    };

    fetchChercheurs();
  }, []);

  const filteredData = chercheurs.filter(item =>
    item.nom.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  // Gestion du changement dans la barre de recherche
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const columns = [
    { name: "Photo", selector: (row) => <img src={row.photo} alt="Profile" className="profile-pic" />, width: "15%" },
    { name: "Nom complet", selector: (row) => row.nom, sortable: true, width: "30%" },
    { name: "Rôle", selector: (row) => row.role, sortable: true, width: "25%" },
    { 
      name: "Plus de détails", 
      cell: (row) => (
        <button 
          className="btn-profile" 
          onClick={() => navigate('/Voirplus', { state: { chercheur: row } })}
        >
          Voir Profil
        </button>
      ), 
      width: "20%" 
    },
  ];

  return (
    <>
      <SidebarA />
      <Topnav />
      <div className="general" style={{ width: "92rem", height: "100vh", padding: "0", margin: "0", backgroundColor: "#fafafa" }}>
        <div className="right" style={{ width: "100%", height: "100%" }}>
          <div className="chercheurs-container" style={{ width: "100%", height: "100%", padding: "1%" }}>
            {/* Barre de recherche ajoutée ici */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' , marginLeft:'18rem'}}>Recherche : </h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Rechercher par nom ou rôle..."
                  value={search}
                  onChange={handleSearch}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    width: '250px',
                    fontSize: '14px'
                    , marginLeft:'1rem'
                  }}
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    marginLeft: '-30px',
                    color: '#666'
                  }}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            <div className="chercheurs-content" style={{ width: "100%", height: "100%" }}>
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                responsive
                fixedHeader
                progressPending={loading}
                progressComponent={<div>Chargement des données...</div>}
                noDataComponent={<div style={{ padding: '24px' }}>Aucun chercheur trouvé</div>}
                customStyles={{
                  table: { style: { width: '100%', height: '100%', backgroundColor: "#fafafa" } },
                  rows: { style: { minHeight: '70px', fontSize: '15px', backgroundColor: "#fff", borderBottom: "1px solid #ddd" } },
                  headCells: { style: { fontSize: "18px", fontWeight: "bold", backgroundColor: "#fafafa", textAlign: "center" } },
                  cells: { style: { paddingLeft: "2%", paddingRight: "2%", textAlign: "center" } },
                  pagination: {
                    style: { justifyContent: "center", alignItems: "center", padding: "20px" },
                    pageButtonsStyle: { backgroundColor: "#e0e0e0", borderRadius: "5px", margin: "0 5px", padding: "8px 12px", border: "none", cursor: "pointer" },
                    activePageStyle: { backgroundColor: "#1976d2", color: "white" },
                  },
                  responsiveWrapper: {
                    style: { display: "flex", flexDirection: "column", width: "100%", overflowX: "auto" }
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChercheurA;