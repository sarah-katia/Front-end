import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaTrash , FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../nav/sidebardir";
import Topnav from "../nav/Topnav";
import TabsHeader from "./Tabsheader";
import Filters from "../table/Filtre";
import styling from "./publication.module.css";
import DeleteConfirmationCard from "../cartes/deletecard";

const fakePublications = [
  {
    id: 1,
    auteur: "Kermi adel",
    titre: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
    date: "2024",
    editeur: "Spring US",
  },
  {
    id: 2,
    auteur: "Kermi adel",
    titre: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
    date: "2022",
    editeur: "Spring US",
  },
  {
    id: 3,
    auteur: "Kermi adel",
    titre: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
    date: "2025",
    editeur: "Spring US",
  },
  {
    id: 4,
    auteur: "Kermi adel",
    titre: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
    date: "2024",
    editeur: "Spring US",
  },
  {
    id: 5,
    auteur: "Kermi adel",
    titre: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
    date: "2023",
    editeur: "Spring US",
  },
  {
    id: 6,
    auteur: "Kermi adel",
    titre: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
    date: "2019",
    editeur: "Spring US",
  },
];

const Publications = () => {
  const [publications, setPublications] = useState(fakePublications);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [publicationASupprimer, setPublicationASupprimer] = useState(null);

  const navigate = useNavigate();

  const handleSearch = (event) => setSearch(event.target.value);

  const handleDelete = (id) => {
    const publication = publications.find((p) => p.id === id);
    setPublicationASupprimer(publication);
  };

  const confirmerSuppression = () => {
    setPublications((prev) => prev.filter((p) => p.id !== publicationASupprimer.id));
    setPublicationASupprimer(null);
  };

  const annulerSuppression = () => setPublicationASupprimer(null);

  const filteredData = publications.filter((p) =>
    p.titre.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "Auteur", selector: (row) => row.auteur, sortable: true, width: "160px" },
    { name: "Titre", selector: (row) => row.titre, sortable: true, grow: 2, wrap: true },
    { name: "Date", selector: (row) => row.date, sortable: true, width: "100px" },
    { name: "Éditeur", selector: (row) => row.editeur, sortable: true, width: "120px" },
    {
      name: "Plus",
      cell: (row) => (
        <div className={styling.actions}>
          <button className={styling.viewBtn}>Voir plus</button>
          <button className={styling.deleteBtn} onClick={() => handleDelete(row.id)}>
           <FaTrash />
          </button>
        </div>
      ),
      width: "220px",
    },
  ];

  return (
    <>
      <NavBar />
      <Topnav />
      <TabsHeader   tabs={[
    { label: "Chercheurs", path: "/gestiondir/chercheur" },
    { label: "Publications", path: "/gestiondir/publication" },
  ]} />
  
      <div className={styling.publicationsContainer}>
        <div className={styling.publicationsContent}>
          <div className={styling.filtersHeader}>
            <div className={styling.searchBar}>
              <FaSearch />
              <input
                type="text"
                placeholder="Rechercher une publication"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <button className={styling.filterBtn} onClick={() => setShowFilters(true)}>
              Filtrer
            </button>
          </div>

          <div className={styling.tableContainer}>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              customStyles={{
                table: { style: { backgroundColor: "#fafafa", minHeight: "750px" } },
                rows: {
                  style: {
                    minHeight: "48px",
                    borderBottom: "1px solid #ccc",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                  },
                },
                headCells: {
                  style: {
                    fontWeight: "bold",
                    fontSize: "14px",
                    backgroundColor: "#fafafa",
                  },
                },
                cells: {
                  style: {
                    paddingLeft: "8px",
                    paddingRight: "8px",
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

          <DeleteConfirmationCard
            isVisible={!!publicationASupprimer}
            chercheur={publicationASupprimer}
            onConfirm={confirmerSuppression}
            onCancel={annulerSuppression}
            message={'Voulez-vous vraiment supprimer cette publication ?'}
          />
        </div>
      </div>
    </>
  );
};

export default Publications;