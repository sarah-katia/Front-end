import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch, FaFilter } from "react-icons/fa";
import axios from "axios";

import Filtre from "./Filtre";
import "./Table_chercheur.css";

const Table_chercheur = () => {
  const [chercheurs, setChercheurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterQualite, setFilterQualite] = useState("");
  const [filterEquipe, setFilterEquipe] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState([]); // Pour afficher les filtres actifs

  // Vérifier les API disponibles au chargement
  useEffect(() => {
    checkApiEndpoints();
  }, []);

  // Récupérer les chercheurs lorsque les filtres changent
  useEffect(() => {
    fetchChercheurs();
  }, [perPage, currentPage, search, filterQualite, filterEquipe, advancedFilters]);
  
  // Fonction pour vérifier quelles routes API sont disponibles
  const checkApiEndpoints = async () => {
    try {
      // Liste des routes potentielles à tester, ajout de la route sans 's'
      const potentialRoutes = [
        "http://localhost:8000/chercheur",         // <-- Cette route sans 's' en premier
      ];
      
      for (const route of potentialRoutes) {
        try {
          console.log(`Tentative d'accès à la route: ${route}`);
          const response = await axios.get(route);
          if (response.status === 200) {
            console.log(`✅ Route disponible: ${route}`);
            // Si vous voulez stocker la route fonctionnelle pour une utilisation ultérieure
            window.workingApiRoute = route;
            break;
          }
        } catch (err) {
          console.log(`❌ Route indisponible: ${route}`, err.message);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des points d'API:", error);
    }
  };

  const fetchChercheurs = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * perPage;
      
      // Utiliser la route détectée automatiquement ou la route par défaut sans 's'
      const baseRoute = window.workingApiRoute || "http://localhost:8000/chercheur";
      const searchRoute = `${baseRoute}/search`;
      
      console.log("Tentative de récupération des chercheurs avec la route:", baseRoute);
      
      let response;
      
      // Si une recherche est en cours, essayer d'utiliser l'endpoint de recherche
      if (search || filterQualite || filterEquipe || Object.keys(advancedFilters).length > 0) {
        try {
          // Construire les paramètres de requête
          const params = {
            nom_complet: search || undefined,
            Qualité: filterQualite || undefined,
            Equipe: filterEquipe || undefined,
            limit: perPage,
            offset,
            ...advancedFilters
          };

          console.log("Utilisation de la route de recherche avec params:", params);
          response = await axios.get(searchRoute, { params });
        } catch (searchError) {
          console.log("Route de recherche indisponible, repli sur la route principale");
          // Si la route de recherche échoue, repli sur la route principale avec paramètres
          response = await axios.get(baseRoute, {
            params: {
              search: search || undefined,
              qualite: filterQualite || undefined,
              equipe: filterEquipe || undefined,
              limit: perPage,
              offset,
              ...advancedFilters
            }
          });
        }
      } else {
        // Route principale pour récupérer tous les chercheurs
        response = await axios.get(baseRoute, {
          params: {
            limit: perPage,
            offset
          }
        });
      }
      
      // Vérifier la structure de la réponse et adapter
      console.log("Réponse reçue:", response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        // Format {data: [...], total: n}
        setChercheurs(response.data.data);
        setTotalRows(response.data.total || response.data.data.length);
      } else if (response.data && Array.isArray(response.data)) {
        // Format directement un tableau
        setChercheurs(response.data);
        setTotalRows(response.data.length);
      } else if (response.data && typeof response.data === 'object') {
        // Au cas où les données sont dans un autre format
        const dataArray = response.data.chercheurs || response.data.results || response.data.items || [];
        setChercheurs(Array.isArray(dataArray) ? dataArray : []);
        setTotalRows(response.data.total || response.data.count || dataArray.length || 0);
      } else {
        // Si aucun format reconnu
        console.error("Format de données non reconnu:", response.data);
        setChercheurs([]);
        setTotalRows(0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des chercheurs :", error);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Revenir à la première page lors d'une nouvelle recherche
  };

  const handleFilterQualite = (event) => {
    setFilterQualite(event.target.value);
    setCurrentPage(1);
    
    // Mettre à jour les filtres actifs
    updateActiveFilters('qualite', event.target.value);
  };

  const handleFilterEquipe = (event) => {
    setFilterEquipe(event.target.value);
    setCurrentPage(1);
    
    // Mettre à jour les filtres actifs
    updateActiveFilters('equipe', event.target.value);
  };

  // Fonction pour mettre à jour l'affichage des filtres actifs
  const updateActiveFilters = (type, value) => {
    if (value) {
      // Ajouter ou mettre à jour le filtre
      setActiveFilters(current => {
        const filtered = current.filter(f => f.type !== type);
        return [...filtered, { type, value }];
      });
    } else {
      // Supprimer le filtre si la valeur est vide
      setActiveFilters(current => current.filter(f => f.type !== type));
    }
  };

  // Fonction modifiée pour mapper les filtres du composant Filtre
  // vers les paramètres attendus par l'API
  const applyAdvancedFilters = (filters) => {
    // Transformation des filtres pour correspondre aux noms de paramètres attendus par l'API
    const apiFilters = {};
    const newActiveFilters = [];
    
    // Gestion du H-index (exact, min, max)
    if (filters.hIndexBase && filters.hIndexBase !== "") {
      apiFilters.Hindex_exact = filters.hIndexBase;
      newActiveFilters.push({ type: 'h-index', value: `Exact: ${filters.hIndexBase}` });
    } else {
      if (filters.hIndexMin && filters.hIndexMin !== "") {
        apiFilters.Hindex_min = filters.hIndexMin;
        if (filters.hIndexMax && filters.hIndexMax !== "") {
          newActiveFilters.push({ type: 'h-index', value: `${filters.hIndexMin} - ${filters.hIndexMax}` });
        } else {
          newActiveFilters.push({ type: 'h-index', value: `Min: ${filters.hIndexMin}` });
        }
      }
      if (filters.hIndexMax && filters.hIndexMax !== "") {
        apiFilters.Hindex_max = filters.hIndexMax;
        if (!filters.hIndexMin || filters.hIndexMin === "") {
          newActiveFilters.push({ type: 'h-index', value: `Max: ${filters.hIndexMax}` });
        }
      }
    }
    
    // Gestion de l'établissement d'origine
    if (filters.etablissement && filters.etablissement.length > 0) {
      apiFilters.Etablissement_origine = filters.etablissement.join(',');
      newActiveFilters.push({ type: 'etablissement', value: filters.etablissement.join(', ') });
    }
    
    // Gestion de la qualité
    if (filters.qualite && filters.qualite.length > 0) {
      apiFilters.Qualité = filters.qualite.join(',');
      newActiveFilters.push({ type: 'qualite', value: filters.qualite.join(', ') });
    }
    
    // Gestion du statut
    if (filters.statut && filters.statut.length > 0) {
      apiFilters.Statut = filters.statut.join(',');
      newActiveFilters.push({ type: 'statut', value: filters.statut.join(', ') });
    }
    
    // Gestion de l'équipe
    if (filters.equipe && filters.equipe.length > 0) {
      apiFilters.Equipe = filters.equipe.join(',');
      newActiveFilters.push({ type: 'equipe', value: filters.equipe.join(', ') });
    }
    
    // Gestion du diplôme
    if (filters.diplome && filters.diplome.length > 0) {
      apiFilters.Diplôme = filters.diplome.join(',');
      newActiveFilters.push({ type: 'diplome', value: filters.diplome.join(', ') });
    }
    
    console.log("Filtres avancés transformés:", apiFilters);
    setAdvancedFilters(apiFilters);
    setActiveFilters(newActiveFilters);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const columns = [
    {
      name: "Photo",
      selector: (row) => (
        <img src={row.photo || "https://via.placeholder.com/50"} alt="Profile" className="profile-pic" />
      ),
      width: "140px"
    },
    { 
      name: "Nom complet", 
      selector: (row) => row.nom_complet || row.nom, // Adaptation aux deux formats possibles
      sortable: true 
    },
    { 
      name: "Qualité", 
      selector: (row) => row.Qualité || row.qualite, // Adaptation aux deux formats possibles
      sortable: true 
    },
    { 
      name: "Équipe", 
      selector: (row) => row.Equipe || row.equipe, // Adaptation aux deux formats possibles
      sortable: true 
    },
    {
      name: "Plus de détails",
      cell: (row) => <button className="btn-profile" onClick={() => handleViewProfile(row)}>Voir Profile</button>
    }
  ];

  const handleViewProfile = (chercheur) => {
    // Fonction pour afficher les détails du chercheur
    console.log("Voir le profil de:", chercheur);
    // Vous pouvez implémenter ici une redirection vers la page de profil
    // ou afficher un modal avec les détails
  };

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
              <option value="Enseignant-Chercheur">Enseignant-Chercheur</option>
            </select>
            <select value={filterEquipe} onChange={handleFilterEquipe}>
              <option value="">Équipe</option>
              <option value="CoDesign">CoDesign</option>
              <option value="TIIMA">TIIMA</option>
              <option value="IMAGE">IMAGE</option>
              <option value="OPI">OPI</option>
              <option value="EIAH">EIAH</option>
              <option value="SURES">SURES</option>
              <option value="MSI">MSI</option>
            </select>
            <button onClick={() => setShowFilters(true)}>
              <FaFilter className="filtree" /> Plus de filtres
            </button>
          </div>

          {/* Affichage des filtres actifs */}
          {activeFilters.length > 0 && (
            <div className="active-filters-container">
              <div className="active-filters">
                <span className="active-filters-title">Filtres actifs: </span>
                {activeFilters.map((filter, index) => (
                  <span key={index} className="active-filter-pill">
                    {filter.type === 'h-index' ? 'H-index' : 
                     filter.type === 'etablissement' ? 'Établissement' : 
                     filter.type === 'qualite' ? 'Qualité' : 
                     filter.type === 'statut' ? 'Statut' : 
                     filter.type === 'equipe' ? 'Équipe' : 
                     filter.type === 'diplome' ? 'Diplôme' : filter.type}: {filter.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="chercheurs-content">
            <DataTable
              columns={columns}
              data={chercheurs}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              className="table"
              noDataComponent="Aucun chercheur trouvé"
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