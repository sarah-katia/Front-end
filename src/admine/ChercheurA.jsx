import React, { useState } from 'react'
import SidebarA from '../component/nav/SidebarA'
import Topnav from '../component/nav/Topnav'
import DataTable from 'react-data-table-component' // N'oubliez pas d'importer DataTable

const fakeData = [
  { id: 1, photo: "https://via.placeholder.com/50", nom: "Kermi Adel", qualite: "Professeur", equipe: "TIIMA" },
  { id: 2, photo: "https://via.placeholder.com/50", nom: "Mouloud Koudil", qualite: "Professeur", equipe: "CoDesign" },
  { id: 3, photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", qualite: "Chercheur", equipe: "IMAGE" },
  { id: 4, photo: "../../assets/Koudil.png", nom: "Sofiane Djelloul", qualite: "Doctorant", equipe: "OPI" },
  { id: 5, photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", qualite: "Chercheur", equipe: "IMAGE" },
  { id: 6, photo: "../../assets/Koudil.png", nom: "Sofiane Djelloul", qualite: "Doctorant", equipe: "OPI" },
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
    { name: "Photo", selector: (row) => <img src={row.photo} alt="Profile" className="profile-pic" />, width: "140px" },
    { name: "Nom complet", selector: (row) => row.nom, sortable: true },
    { name: "Qualité", selector: (row) => row.qualite, sortable: true },
    { name: "Équipe", selector: (row) => row.equipe, sortable: true },
    { name: "Plus de détails", cell: () => <button className="btn-profile">Voir Profile</button> },
  ];

  return (
    <>
      <SidebarA/>
      <Topnav/>
      <div className="general">
        <div className="right">
          <div className="chercheurs-container">
            <div className="chercheurs-content">
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                className="table"
                customStyles={{
                  table: { style: { width: '100%', minHeight: '750px', backgroundColor: "#fafafa", zIndex: "-1" } },
                  rows: { style: { minHeight: '70px', borderRadius: "10px", marginTop: "14px", fontSize: '15px', padding: '3px', backgroundColor: "#fafafa", border: "1px solid #ccc" } },
                  headCells: { style: { fontSize: "18px", fontWeight: "bold", textAlign: "center", paddingLeft: "40px", backgroundColor: "#fafafa" } },
                  cells: { style: { backgroundColor: "#fafafa", paddingLeft: "40px", paddingRight: "20px" } },
                  pagination: { 
                    style: { display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" },
                    pageButtonsStyle: { backgroundColor: "#f1f1f1", border: "1px solid #ccc", color: "#333", padding: "5px 10px", margin: "0 5px", cursor: "pointer", borderRadius: "5px", transition: "background-color 0.3s" },
                    activePageStyle: { backgroundColor: "#1976b4", color: "white" },
                    nextButtonStyle: { borderRadius: "5px" },
                    previousButtonStyle: { borderRadius: "5px" }
                  },
                  responsiveWrapper: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      overflowX: "auto",
                      minWidth: "100%",
                      maxWidth: "100%",
                    }
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

export default ChercheurA