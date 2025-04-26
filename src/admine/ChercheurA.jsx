import React, { useState } from 'react';
import SidebarA from '../component/nav/SidebarA';
import Topnav from '../component/nav/Topnav';
import DataTable from 'react-data-table-component';

const fakeData = [
  { id: '1admin', photo: "https://via.placeholder.com/50", nom: "Kermi Adel", qualite: "Professeur", equipe: "TIIMA" },
  { id: '2admin', photo: "https://via.placeholder.com/50", nom: "Mouloud Koudil", qualite: "Professeur", equipe: "CoDesign" },
  { id: '3admin', photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", qualite: "Chercheur", equipe: "IMAGE" },
  { id: '4admin', photo: "../../assets/Koudil.png", nom: "Sofiane Djelloul", qualite: "Doctorant", equipe: "OPI" },
  { id: '5admin', photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", qualite: "Chercheur", equipe: "IMAGE" },
  { id: '6admin', photo: "../../assets/Koudil.png", nom: "Sofiane Djelloul", qualite: "Doctorant", equipe: "OPI" },
];

function ChercheurA() {
  const [chercheurs, setChercheurs] = useState(fakeData);
  const [search, setSearch] = useState("");

  const filteredData = chercheurs.filter(item =>
    item.nom.toLowerCase().includes(search.toLowerCase()) ||
    item.qualite.toLowerCase().includes(search.toLowerCase()) ||
    item.equipe.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "Photo", selector: (row) => <img src={row.photo} alt="Profile" className="profile-pic" />, width: "10%" },
    { name: "Nom complet", selector: (row) => row.nom, sortable: true, width: "25%" },
    { name: "Qualité", selector: (row) => row.qualite, sortable: true, width: "25%" },
    { name: "Équipe", selector: (row) => row.equipe, sortable: true, width: "25%" },
    { name: "Plus de détails", cell: () => <button className="btn-profile">Voir Profile</button>, width: "15%" },
  ];

  return (
    <>
      <SidebarA />
      <Topnav />
      <div className="general" style={{ width: "100rem", height: "100vh", padding: "0", margin: "0", backgroundColor: "#fafafa" }}>
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
  )
}

export default ChercheurA;
