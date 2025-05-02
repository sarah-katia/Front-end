import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {  FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../nav/SidebarDi";
import Topnav from "../nav/Topnav";
import TabsHeader from "../gestionassi/Tabsheader";
import Filters from "../table/Filtre";
import styling from "./assistante.module.css";

const fakeData = [
  { id: 1, photo: "https://via.placeholder.com/50", nom: "Bahri Assia", email: "Bahri@example.com", qualite: "professeur", equipe: "IOT" },
  { id: 2, photo: "https://via.placeholder.com/50", nom: "Kermi Adel", email: "kermi.adel@example.com", qualite: "Professeur", equipe: "TIIMA" },
  { id: 3, photo: "https://via.placeholder.com/50", nom: "Mouloud Koudil", email: "koudil.mouloud@example.com", qualite: "Professeur", equipe: "CoDesign" },
  { id: 4, photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", email: "bensalem.ahmed@example.com", qualite: "Chercheur", equipe: "IMAGE" },
  { id: 5, photo: "../../assets/Koudil.png", nom: "Toufik Djellal", email: "sofiane.djelloul@example.com", qualite: "Doctorant", equipe: "OPI" },
  { id: 6, photo: "https://via.placeholder.com/50", nom: "Imene Belkacem", email: "imene.belkacem@example.com", qualite: "Doctorante", equipe: "EIAH" },
];

const Assi = () => {
  const [chercheurs, setChercheurs] = useState(fakeData);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (event) => setSearch(event.target.value);


  const filteredData = chercheurs.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "Photo",
      selector: (row) => <img src={row.photo} alt="Profile" className={styling.profilePic} />,
      width: "140px",
    },
    {
      name: "Nom complet",
      selector: (row) => row.nom,
      sortable: true,
      width: "240px",
    },
    {
      name: "Email",
      selector: (row) => (
        <a href={`mailto:${row.email}`} className={styling.emailLink}>
          {row.email}
        </a>
      ),
      sortable: true,
      width: "280px",
    },
    {
      name: "Plus de détails",
      cell: (row) => (
        <div className={styling.actions}>
          <button className={styling.viewBtn}>Voir Profil</button>
        </div>
      ),
      width: "260px",
      center: true,
    },
  ];


  return (
    <>
      <NavBar />
      <Topnav />
      <TabsHeader   tabs={[
    { label: "Chercheurs", path: "/directrice/chercheurDi" },
    { label: "Publications", path: "/directrice/publicationDi" },
    { label: "Assistante", path: "/directrice/Assistante" },
  ]} />

  
      <div className={styling.Container}>
        <div className={styling.Content}>
          <div className={styling.filtersHeader}>
            <div className={styling.searchBar}>
              <FaSearch />
              <input
                type="text"
                placeholder="Rechercher"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <button className={styling.addBtn} onClick={() => navigate("/AjouterAssis")}>
              + Ajouter une assistante
            </button>
          </div>

          <div className={styling.tableContainer}>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              customStyles={{
                table: {
                  style: {
                    width: "100%",
                    minHeight: "750px",
                    minWidth: "920px",
                    backgroundColor: "#fafafa",
                  },
                },
                rows: {
                  style: {
                    minHeight: "60px",
                    fontSize: "14px",
                    backgroundColor: "#fafafa",
                    borderBottom: "1px solid #ccc",
                  },
                },
                headCells: {
                  style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#fafafa",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  },
                },
                cells: {
                  style: {
                    backgroundColor: "#fafafa",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    whiteSpace: "nowrap",
                  },
                },
              }}
            />
          </div>

          {showFilters && (
            <div className={styling.filterOverlay}>
              <div className={styling.filterModal}>
                <button className={styling.closeBtn} onClick={() => setShowFilters(false)}>
                  ✖
                </button>
                <Filters onApply={() => setShowFilters(false)} />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Assi;
