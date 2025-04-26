import React, { useState } from 'react';
import SidebarA from '../component/nav/SidebarA';
import Topnav from '../component/nav/Topnav';
import DataTable from 'react-data-table-component';
import './Confirmation.css'; // Ajoute ce fichier CSS pour l'animation

const fakeData = [
  { id: '1admin', photo: "https://via.placeholder.com/50", nom: "Kermi Adel", role: "Chercheur" },
  { id: '2admin', photo: "https://via.placeholder.com/50", nom: "Mouloud Koudil", role: "Assistante" },
  { id: '3admin', photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", role: "Chercheur" },
  { id: '4admin', photo: "../../assets/Koudil.png", nom: "Sofiane Djelloul", role: "Assistante"},
  { id: '5admin', photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", role: "Assistante"},
  { id: '6admin', photo: "../../assets/Koudil.png", nom: "Sofiane Djelloul", role: "Directrice"},
];

function Confirmation() {
  const [chercheurs, setChercheurs] = useState(fakeData);
  const [search, setSearch] = useState("");
  const [removingIds, setRemovingIds] = useState([]); // Pour animation de suppression

  const handleRefuser = (id) => {
    setRemovingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setChercheurs((prev) => prev.filter((item) => item.id !== id));
    }, 500); // attendre que l'animation se termine (500ms)
  };

  const handleAccepter = (id) => {
    alert(`Chercheur avec ID ${id} accepté un email avec son mot de passe à ete envoyer a sa boite email !`);
  };

  const filteredData = chercheurs.filter(item =>
    item.nom.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "Photo", selector: (row) => <img src={row.photo} alt="Profile" className="profile-pic" />, width: "15%" },
    { name: "Nom complet", selector: (row) => row.nom, sortable: true, width: "30%" },
    { name: "Rôle", selector: (row) => row.role, sortable: true, width: "30%" },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button className="btn-accept" onClick={() => handleAccepter(row.id)}>Accepter</button>
          <button className="btn-refuse" onClick={() => handleRefuser(row.id)}>Refuser</button>
        </div>
      ),
      width: "25%" 
    },
  ];

  return (
    <>
      <SidebarA />
      <Topnav />
      <div className="confirmation" style={{ width: "92rem", height: "100vh", padding: "0", margin: "0", backgroundColor: "#fafafa" }}>
        <div className="right" style={{ width: "100%", height: "100%" }}>
          <div className="chercheurs-container" style={{ width: "100%", height: "100%", padding: "1%" }}>
            <div className="chercheurs-content" style={{ width: "100%", height: "100%" }}>
              <DataTable
                columns={columns}
                data={filteredData.map(row => ({
                  ...row,
                  isRemoving: removingIds.includes(row.id)
                }))}
                pagination
                responsive
                fixedHeader
                noDataComponent={<div style={{ padding: "20px", fontSize: "18px", color: "#555" }}>Aucune demande d'ajout n'a été faite pour le moment.</div>}

                customStyles={{
                  table: { style: { width: '100%', height: '100%', backgroundColor: "#fafafa" } },
                  rows: {
                    style: {
                      minHeight: '70px',
                      fontSize: '15px',
                      backgroundColor: "#fff",
                      borderBottom: "1px solid #ddd",
                      transition: "transform 0.5s ease, opacity 0.5s ease",
                      transform: (row) => row.isRemoving ? "translateX(-100%)" : "translateX(0)",
                      opacity: (row) => row.isRemoving ? 0 : 1,
                    }
                  },
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

export default Confirmation;
