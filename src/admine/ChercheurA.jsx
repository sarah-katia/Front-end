import React, { useState } from 'react'; // Importation correcte de useState
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour la navigation
import DataTable from 'react-data-table-component';
import SidebarA from '../component/nav/SidebarAd';
import Topnav from '../component/nav/Topnav';

const fakeData = [
  { id: '1admin', photo: "https://via.placeholder.com/50", nom: "Kermi Adel", prenom: "Adel", phone: "123456789", email: "adel@example.com", role: "Chercheur" },
  { id: '2admin', photo: "https://via.placeholder.com/50", nom: "Mouloud Koudil", prenom: "Mouloud", phone: "987654321", email: "mouloud@example.com", role: "Assistante" },
  // Ajoute d'autres chercheurs ici
];

function ChercheurA() {
  const navigate = useNavigate();
  const [chercheurs, setChercheurs] = useState(fakeData);
  const [search, setSearch] = useState("");

  const filteredData = chercheurs.filter(item =>
    item.nom.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  );

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
            <div className="chercheurs-content" style={{ width: "100%", height: "100%" }}>
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                responsive
                fixedHeader
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
