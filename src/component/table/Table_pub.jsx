

import { useState } from "react"
import DataTable from "react-data-table-component"
import { FaSearch, FaFilter } from "react-icons/fa"
import "./Table_pub.css"

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
]

const Table_pub = () => {
  const [publications, setPublications] = useState(fakePublications)
  const [search, setSearch] = useState("")
  const [filterAuteur, setFilterAuteur] = useState("")
  const [filterAnnee, setFilterAnnee] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (event) => {
    event.preventDefault()
    setSearch(event.target.value)
  }

  const handleFilterAuteur = (event) => {
    setFilterAuteur(event.target.value)
  }

  const handleFilterAnnee = (event) => {
    setFilterAnnee(event.target.value)
  }

  // Get unique authors and years for filter dropdowns
  const uniqueAuthors = [...new Set(publications.map((p) => p.auteur))]
  const uniqueYears = [...new Set(publications.map((p) => p.annee))]

  const filteredData = publications.filter(
    (p) =>
      (p.titre.toLowerCase().includes(search.toLowerCase()) || p.auteur.toLowerCase().includes(search.toLowerCase())) &&
      (filterAuteur ? p.auteur === filterAuteur : true) &&
      (filterAnnee ? p.annee === filterAnnee : true),
  )

  const columns = [
    { name: "Auteur", selector: (row) => row.auteur, sortable: true },
    { name: "Titre", selector: (row) => row.titre, sortable: true, grow: 2 },
    { name: "Année de publication", selector: (row) => row.annee, sortable: true },
    {
      name: "Plus de détails",
      cell: () => <button className="btn-voir-plus">Voir plus</button>,
      center: true,
    },
  ]

  return (
    <div className="publications-container">
          <div className="filters2">
                 <div className="search-bar2">
                   <FaSearch className="logo-recherche" />
                   <input type="text" placeholder="Rechercher un chercheur" value={search} onChange={handleSearch} />
                 </div>
                 <button onClick={() => setShowFilters(true)} className="plus" >
                   <FaFilter className="filtree2" /> Plus de filtres
                 </button>
      </div>

      <div className="publications-content">
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
                minHeight: "auto", // Removed fixed height
                backgroundColor: "#fafafa",
                zIndex: "-1",
              },
            },
            rows: {
              style: {
                minHeight: "60px", // Reduced from 70px
                borderRadius: "10px",
                marginTop: "10px", // Reduced from 14px
                fontSize: "15px",
                padding: "2px", // Reduced from 3px
                backgroundColor: "#fafafa",
                border: "1px solid #ccc",
              },
            },
            headCells: {
              style: {
                fontSize: "16px", // Reduced from 18px
                fontWeight: "bold",
                textAlign: "center",
                paddingLeft: "40px",
                backgroundColor: "#fafafa",
                paddingTop: "8px", // Added
                paddingBottom: "8px", // Added
              },
            },
            cells: {
              style: {
                backgroundColor: "#fafafa",
                paddingLeft: "40px",
                paddingRight: "20px",
                paddingTop: "8px", // Added
                paddingBottom: "8px", // Added
              },
            },
            pagination: {
              style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                marginTop: "10px", // Added
                paddingBottom: "5px", // Added
              },
              pageButtonsStyle: {
                backgroundColor: "#f1f1f1",
                border: "1px solid #ccc",
                color: "#333",
                padding: "4px 8px", // Reduced from 5px 10px
                margin: "0 3px", // Reduced from 0 5px
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
          <div className="filter-overlay">
            <div className="filter-modal">
              <button className="close-btn" onClick={() => setShowFilters(false)}>
                ✖
              </button>
              <div className="advanced-filters">
                <h3>Plus de filtre</h3>

                <div className="filter-row">
                  <div className="filter-group">
                    <label>Année de publication</label>
                    <input type="text" placeholder="AAAA" className="year-input" />
                  </div>

                  <div className="filter-group">
                    <label>Période</label>
                    <div className="date-range">
                      <input type="text" placeholder="JJ/MM/AAAA" className="date-input" />
                      <input type="text" placeholder="JJ/MM/AAAA" className="date-input" />
                    </div>
                  </div>
                </div>

                <div className="filter-row">
                  <div className="filter-group">
                    <label>Type de publication</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input type="checkbox" id="conference" />
                        <label htmlFor="conference">Conférence</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="journal" />
                        <label htmlFor="journal">Journal</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="livre" />
                        <label htmlFor="livre">Livre</label>
                      </div>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Classement de la publication</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input type="checkbox" id="core" />
                        <label htmlFor="core">CORE</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="scimago" />
                        <label htmlFor="scimago">Scimago</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="dgrsdt" />
                        <label htmlFor="dgrsdt">DGRSDT</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="qualis" />
                        <label htmlFor="qualis">Qualis</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="autres" />
                        <label htmlFor="autres">Autres</label>
                      </div>
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>Classement</label>
                    <input type="text" placeholder="A,B,1,..." className="ranking-input" />
                  </div>
                </div>

                <div className="filter-row">
                  <div className="filter-group">
                    <label>Périodicité</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input type="checkbox" id="annuel" />
                        <label htmlFor="annuel">Annuel</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="biannuel" />
                        <label htmlFor="biannuel">Biannuel</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="mensuel" />
                        <label htmlFor="mensuel">Mensuel</label>
                      </div>
                    </div>
                  </div>

                 
                </div>

                <div className="filter-row">
                  <div className="filter-group">
                    <label>Thématique</label>
                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input type="checkbox" id="cs" />
                        <label htmlFor="cs">Computer science</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="ai" />
                        <label htmlFor="ai">Artificial intelligence</label>
                      </div>
                      <div className="checkbox-item">
                        <input type="checkbox" id="sv" />
                        <label htmlFor="sv">Science vision</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="filter-actions">
                  <button className="reset-btn1">Réinitialiser</button>
                  <button className="apply-btn1" onClick={() => setShowFilters(false)}>
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Table_pub

