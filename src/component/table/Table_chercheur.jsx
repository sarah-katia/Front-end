import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch, FaFilter } from "react-icons/fa";
import axios from "axios";

import Filtre from "./Filtre";
import "./Table_chercheur.css";

const Table_chercheur = () => {
  const [chercheurs, setChercheurs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterQualite, setFilterQualite] = useState("");
  const [filterEquipe, setFilterEquipe] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});

  useEffect(() => {
    fetchChercheurs();
  }, [search, filterQualite, filterEquipe, advancedFilters]);

  const fetchChercheurs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chercheurs", {
        params: {
          search,
          qualite: filterQualite,
          equipe: filterEquipe,
          ...advancedFilters
        }
      });
      setChercheurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chercheurs :", error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterQualite = (event) => {
    setFilterQualite(event.target.value);
  };

  const handleFilterEquipe = (event) => {
    setFilterEquipe(event.target.value);
  };

  const applyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
    setShowFilters(false);
  };

  const columns = [
    {
      name: "Photo",
      selector: (row) => (
        <img src={row.photo || "https://via.placeholder.com/50"} alt="Profile" className="profile-pic" />
      ),
      width: "140px"
    },
    { name: "Nom complet", selector: (row) => row.nom, sortable: true },
    { name: "Qualité", selector: (row) => row.qualite, sortable: true },
    { name: "Équipe", selector: (row) => row.equipe, sortable: true },
    {
      name: "Plus de détails",
      cell: () => <button className="btn-profile">Voir Profile</button>
    }
  ];

  return (
    <div className="general">
      <div className="right">
        <div className="chercheurs-container">
          <div className="filters">
            <div className="search-bar">
              <FaSearch className="logo-recherche" />
              <input
                type="text"
                placeholder="Rechercher un chercheur"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <select value={filterQualite} onChange={handleFilterQualite}>
              <option value="">Qualité</option>
              <option value="Professeur">Professeur</option>
              <option value="Chercheur">Chercheur</option>
              <option value="Doctorant">Doctorant</option>
              <option value="Maitre_de_conference">Maitre de Conférence</option>
              <option value="Maitre_de_conference_A">Maitre de Conférence A</option>
              <option value="Maitre_de_conference_B">Maitre de Conférence B</option>
              <option value="Maitre_assistant">Maitre assistant</option>
              <option value="Maitre_assistant_A">Maitre assistant A</option>
              <option value="Maitre_assistant_B">Maitre assistant B</option>
            </select>
            <select value={filterEquipe} onChange={handleFilterEquipe}>
              <option value="">Équipe</option>
              <option value="CoDesign">CoDesign</option>
              <option value="TIIMA">TIIMA</option>
              <option value="IMAGE">IMAGE</option>
              <option value="OPI">OPI</option>
              <option value="EIAH">EIAH</option>
              <option value="SURES">SURES</option>
            </select>
            <button onClick={() => setShowFilters(true)}>
              <FaFilter className="filtree" /> Plus de filtres
            </button>
          </div>

          <div className="chercheurs-content">
            <DataTable
              columns={columns}
              data={chercheurs}
              pagination
              className="table"
              customStyles={{
                table: {
                  style: {
                    width: "100%",
                    minHeight: "750px",
                    backgroundColor: "#fafafa",
                    zIndex: "-1"
                  }
                },
                rows: {
                  style: {
                    minHeight: "70px",
                    borderRadius: "10px",
                    marginTop: "14px",
                    fontSize: "15px",
                    padding: "3px",
                    backgroundColor: "#fafafa",
                    border: "1px solid #ccc"
                  }
                },
                headCells: {
                  style: {
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingLeft: "40px",
                    backgroundColor: "#fafafa"
                  }
                },
                cells: {
                  style: {
                    backgroundColor: "#fafafa",
                    paddingLeft: "40px",
                    paddingRight: "20px"
                  }
                },
                pagination: {
                  style: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px"
                  },
                  pageButtonsStyle: {
                    backgroundColor: "#f1f1f1",
                    border: "1px solid #ccc",
                    color: "#333",
                    padding: "5px 10px",
                    margin: "0 5px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    transition: "background-color 0.3s"
                  },
                  activePageStyle: {
                    backgroundColor: "#1976b4",
                    color: "white"
                  },
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
                    maxWidth: "100%"
                  }
                }
              }}
            />

            {showFilters && (
              <div className="filter-overlay">
                <div className="filter-modal2">
                  <button className="close-btn" onClick={() => setShowFilters(false)}>
                    ✖
                  </button>
                  <Filtre onApply={applyAdvancedFilters} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table_chercheur;
