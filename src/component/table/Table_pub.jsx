import { useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch, FaFilter } from "react-icons/fa";
import "./Table_pub.css";
import Filtrepub from "./filtrepub";

// Fake publications data
const fakePublications = [
  {
    id: 1,
    auteur: "Mouloud Koudil",
    titre: "A novel active learning method using SVM for text classification",
    annee: "2023",
  },
  {
    id: 2,
    auteur: "Mouloud Koudil",
    titre: "A novel active learning method using SVM for text classification",
    annee: "2023",
  },
  {
    id: 3,
    auteur: "Ahmed Bensalem",
    titre: "Deep learning approaches for image segmentation in medical applications",
    annee: "2022",
  },
  {
    id: 4,
    auteur: "Sofiane Djelloul",
    titre: "Optimization techniques for resource allocation in cloud computing",
    annee: "2021",
  },
  {
    id: 5,
    auteur: "Karima Adel",
    titre: "Security challenges in Internet of Things: A comprehensive survey",
    annee: "2022",
  },
  {
    id: 6,
    auteur: "Mouloud Koudil",
    titre: "A novel active learning method using SVM for text classification",
    annee: "2023",
  },
];

const Table_pub = () => {
  const [publications, setPublications] = useState(fakePublications);
  const [search, setSearch] = useState("");
  const [filterAuteur, setFilterAuteur] = useState("");
  const [filterAnnee, setFilterAnnee] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  // Gérer l'application des filtres et fermer le modal
  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    
    // On peut aussi extraire des filtres spécifiques si nécessaire
    if (appliedFilters.anneePublication) {
      const year = new Date(appliedFilters.anneePublication).getFullYear().toString();
      setFilterAnnee(year);
    }
    
    // Fermer la fenêtre de filtres après application
    setShowFilters(false);
  };

  // Filtrer les données en fonction de la recherche et des filtres
  const filteredData = publications.filter(
    (p) =>
      (p.titre.toLowerCase().includes(search.toLowerCase()) ||
        p.auteur.toLowerCase().includes(search.toLowerCase())) &&
      (filterAuteur ? p.auteur === filterAuteur : true) &&
      (filterAnnee ? p.annee === filterAnnee : true)
  );

  const columns = [
    { name: "Auteur", selector: (row) => row.auteur, sortable: true },
    { name: "Titre", selector: (row) => row.titre, sortable: true, grow: 2 },
    { name: "Année de publication", selector: (row) => row.annee, sortable: true },
    {
      name: "Plus de détails",
      cell: () => <button className="btn-voir-plus">Voir plus</button>,
      center: true,
    },
  ];

  return (
    <div className="publications-container">
      <div className="filters2">
        <div className="search-bar2">
          <FaSearch className="logo-recherche" />
          <input
            type="text"
            placeholder="Rechercher une publication "
            value={search}
            onChange={handleSearch}
          />
        </div>
        <button onClick={() => setShowFilters(true)} className="plus">
          <FaFilter className="filtree2" /> Plus de filtres
        </button>
      </div>

      {/* Affichage des filtres actifs */}
      <div className="active-filters">
        {filterAnnee && <span>Année: {filterAnnee}</span>}
        {filters.typePublication && <span>Type: {filters.typePublication}</span>}
        {filters.thematique && <span>Thématique: {filters.thematique}</span>}
        {!filterAnnee && !filters.typePublication && !filters.thematique && 
          <span>Aucun filtre actif</span>}
      </div>

      <div className="publications-content" style={{ position: "relative" }}>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={6}
          paginationRowsPerPageOptions={[6, 10, 15]}
          className="table"
          customStyles={{
            table: {
              style: {
                width: "100%",
                minHeight: "36rem",
                backgroundColor: "#fafafa",
                zIndex: "1",
              },
            },
            rows: {
              style: {
                minHeight: "60px",
                borderRadius: "10px",
                marginTop: "10px",
                fontSize: "15px",
                padding: "2px",
                backgroundColor: "#fafafa",
                border: "1px solid #ccc",
              },
            },
            headCells: {
              style: {
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                paddingLeft: "40px",
                backgroundColor: "#fafafa",
                paddingTop: "8px",
                paddingBottom: "8px",
              },
            },
            cells: {
              style: {
                backgroundColor: "#fafafa",
                paddingLeft: "40px",
                paddingRight: "20px",
                paddingTop: "8px",
                paddingBottom: "8px",
              },
            },
            pagination: {
              style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                marginTop: "10px",
                paddingBottom: "5px",
              },
              pageButtonsStyle: {
                backgroundColor: "#f1f1f1",
                border: "1px solid #ccc",
                color: "#333",
                padding: "4px 8px",
                margin: "0 3px",
                cursor: "pointer",
                borderRadius: "5px",
                transition: "background-color 0.3s",
              },
              activePageStyle: {
                backgroundColor: "#1976b4",
                color: "white",
              },
              nextButtonStyle: {
                borderRadius: "5px",
              },
              previousButtonStyle: {
                borderRadius: "5px",
              },
            },
            responsiveWrapper: {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowX: "auto",
                minWidth: "100%",
                maxWidth: "100%",
              },
            },
          }}
        />

        {showFilters && (
          <div className="filter-overlay" style={{ 
            position: "absolute", 
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          
          }}>
            <div style={{
             
              borderRadius: "8px",
              padding: "15px",
            
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto"
            }}>
              <Filtrepub onApply={handleApplyFilters} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table_pub;