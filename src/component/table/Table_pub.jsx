import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch, FaFilter } from "react-icons/fa";
import axios from "axios";
import "./Table_pub.css";
import Filtrepub from "./filtrepub";
import { useNavigate } from "react-router-dom"; // Importation de useNavigate

const Table_pub = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterAuteur, setFilterAuteur] = useState("");
  const [filterAnnee, setFilterAnnee] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [allPublications, setAllPublications] = useState([]); // Nouvel état pour stocker toutes les publications
  const navigate = useNavigate(); // Hook pour la navigation

  // Vérifier les API disponibles au chargement
  useEffect(() => {
    checkApiEndpoints();
  }, []);

  // Récupérer les publications lorsque les filtres changent
  useEffect(() => {
    if (allPublications.length > 0) {
      // Si nous avons déjà toutes les publications, appliquer juste les filtres
      applyFiltersAndPagination();
    } else {
      // Sinon, récupérer les publications depuis l'API
      fetchPublications();
    }
  }, [perPage, currentPage, search, filterAuteur, filterAnnee, advancedFilters]);
  
  // Fonction pour vérifier quelles routes API sont disponibles
  const checkApiEndpoints = async () => {
    try {
      // Liste des routes potentielles à tester
      const potentialRoutes = [
        "http://localhost:8000/publications/",
      ];
      
      for (const route of potentialRoutes) {
        try {
          console.log(`Tentative d'accès à la route: ${route}`);
          const response = await axios.get(route);
          if (response.status === 200) {
            console.log(`✅ Route disponible: ${route}`);
            // Stocker la route fonctionnelle pour une utilisation ultérieure
            window.workingPublicationApiRoute = route;
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

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Utiliser la route détectée automatiquement ou la route par défaut
      const baseRoute = window.workingPublicationApiRoute || "http://localhost:8000/publications/";
      
      console.log("Tentative de récupération des publications avec la route:", baseRoute);
      
      // Récupérer toutes les publications sans pagination pour s'assurer d'avoir toutes les données
      const response = await axios.get(baseRoute);
      
      console.log("Réponse brute complète:", response);
      console.log("Type de réponse:", typeof response.data);
      console.log("Réponse data:", response.data);
      
      if (Array.isArray(response.data)) {
        console.log("Nombre total de publications reçues (format tableau):", response.data.length);
      } else if (response.data && typeof response.data === 'object') {
        console.log("Structure de l'objet response.data:", Object.keys(response.data).join(', '));
      }
      
      let publicationsData = [];
      
      if (response.data && Array.isArray(response.data)) {
        // Format directement un tableau (comme dans Postman)
        publicationsData = response.data;
        console.log("Données au format tableau. Nombre d'éléments:", publicationsData.length);
      } else if (response.data && Array.isArray(response.data.data)) {
        // Format {data: [...], total: n}
        publicationsData = response.data.data;
        console.log("Données au format {data: [...]}, Nombre d'éléments:", publicationsData.length);
      } else if (response.data && typeof response.data === 'object') {
        // Au cas où les données sont dans un autre format
        const possibleArrayKeys = ['publications', 'results', 'items', 'data', 'content'];
        
        for (const key of possibleArrayKeys) {
          if (response.data[key] && Array.isArray(response.data[key])) {
            publicationsData = response.data[key];
            console.log(`Données trouvées sous la clé '${key}'. Nombre d'éléments:`, publicationsData.length);
            break;
          }
        }
        
        if (publicationsData.length === 0) {
          // Si on n'a pas trouvé de tableau, mais que l'objet est itérable, transformons-le en tableau
          const entries = Object.entries(response.data);
          if (entries.length > 0 && typeof entries[0][1] === 'object') {
            publicationsData = entries.map(([key, value]) => value);
            console.log("Données converties à partir d'un objet. Nombre d'éléments:", publicationsData.length);
          } else {
            throw new Error("Format de données non reconnu dans l'objet response.data");
          }
        }
      } else {
        // Si aucun format reconnu
        throw new Error("Format de données non reconnu: " + JSON.stringify(response.data));
      }
      
      // Afficher les 3 premières publications pour le débogage
      console.log("Échantillon des 3 premières publications:", publicationsData.slice(0, 3));
      
      // MODIFICATION: Supprimer la déduplication et utiliser directement toutes les publications
      console.log(`Total de publications: ${publicationsData.length}`);
      
      // Stocker toutes les publications dans l'état sans déduplication
      setAllPublications(publicationsData);
      
      // Appliquer les filtres et la pagination
      applyFiltersAndPagination(publicationsData);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des publications:", error);
      setApiError(`${error.message}. ${error.response ? `Statut: ${error.response.status}` : ''}`);
      
      // Nous ne montrons plus de données fictives en cas d'erreur
      setPublications([]);
      setTotalRows(0);
      setAllPublications([]);
    } finally {
      setLoading(false);
    }
  };

  // Nouvelle fonction pour appliquer les filtres et la pagination
  const applyFiltersAndPagination = (data = null) => {
    // Utiliser les données fournies ou celles dans l'état
    const sourceData = data || allPublications;
    
    console.log("Application des filtres sur", sourceData.length, "publications");
    
    // Appliquer les filtres côté client
    let filteredData = sourceData;
    
    if (search || filterAuteur || filterAnnee || Object.keys(advancedFilters).length > 0) {
      filteredData = sourceData.filter(pub => {
        // Filtre par texte de recherche (titre ou auteur)
        const matchesSearch = !search || 
          (pub.titre_publication && pub.titre_publication.toLowerCase().includes(search.toLowerCase())) ||
          (pub.auteurs && pub.auteurs.toLowerCase().includes(search.toLowerCase()));
          
        // Filtre par auteur
        const matchesAuteur = !filterAuteur || 
          (pub.auteurs && pub.auteurs.toLowerCase().includes(filterAuteur.toLowerCase()));
          
        // Filtre par année
        const matchesAnnee = !filterAnnee || pub.annee === filterAnnee;
        
        // Filtres avancés
        let matchesAdvanced = true;
        for (const [key, value] of Object.entries(advancedFilters)) {
          if (value && pub[key] !== undefined) {
            if (typeof pub[key] === 'string') {
              matchesAdvanced = matchesAdvanced && pub[key].toLowerCase().includes(value.toLowerCase());
            } else {
              matchesAdvanced = matchesAdvanced && pub[key] === value;
            }
          }
        }
        
        return matchesSearch && matchesAuteur && matchesAnnee && matchesAdvanced;
      });
    }
    
    console.log(`Publications après filtrage: ${filteredData.length}`);
    
    // Mettre à jour le nombre total de lignes
    setTotalRows(filteredData.length);
    
    // Pagination côté client
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    console.log(`Publications affichées (page ${currentPage}): ${paginatedData.length}`);
    
    setPublications(paginatedData);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Revenir à la première page lors d'une nouvelle recherche
  };

  // Mise à jour des filtres actifs
  const updateActiveFilters = (type, value) => {
    if (value) {
      setActiveFilters(current => {
        const filtered = current.filter(f => f.type !== type);
        return [...filtered, { type, value }];
      });
    } else {
      setActiveFilters(current => current.filter(f => f.type !== type));
    }
  };

  // Application des filtres avancés
  const handleApplyFilters = (filters) => {
    const apiFilters = {};
    const newActiveFilters = [];
    
    if (filters.anneePublication) {
      const year = new Date(filters.anneePublication).getFullYear().toString();
      apiFilters.annee = year;
      setFilterAnnee(year);
      newActiveFilters.push({ type: 'année', value: year });
    } else {
      setFilterAnnee("");
    }
    
    if (filters.typePublication) {
      apiFilters.type = filters.typePublication;
      newActiveFilters.push({ type: 'type', value: filters.typePublication });
    }
    
    if (filters.thematique) {
      apiFilters.thematique = filters.thematique;
      newActiveFilters.push({ type: 'thématique', value: filters.thematique });
    }
    
    if (filters.journal) {
      apiFilters.journal = filters.journal;
      newActiveFilters.push({ type: 'journal', value: filters.journal });
    }
    
    if (filters.conference) {
      apiFilters.conference = filters.conference;
      newActiveFilters.push({ type: 'conférence', value: filters.conference });
    }
    
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
    setCurrentPage(1); // Revenir à la première page lors d'un changement de taille
  };

  const handleViewDetails = (publication) => {
    console.log("Redirection vers la page de détails pour:", publication);
    
    // Utiliser publication_id qui est l'identifiant correct dans vos données
    const pubId = publication.publication_id || "detail";
    
    // Naviguer vers la page de détail avec l'ID correct et la publication complète
    navigate(`/voirpluspub/${pubId}`, { state: { publication } });
  };

  // Colonnes optimisées pour un affichage compact
  const columns = [
 
    { 
      name: "Titre", 
      selector: (row) => row.titre_publication, 
      sortable: true,
      wrap: true,
      grow: 2,
    },
    { 
      name: "Année", 
      selector: (row) => row.annee, 
      sortable: true,
      center: true,
      maxWidth: "80px", // Compact pour l'année
    },
    {
      name: "Actions",
      cell: (row) => (
        <button className="btn-voir-plus" onClick={() => handleViewDetails(row)}>
          Voir
        </button>
      ),
      center: true,
      maxWidth: "80px", // Compact pour le bouton
    },
  ];

  // Configuration responsive pour le tableau
  const conditionalRowStyles = [
    {
      when: row => true,
      style: {
        backgroundColor: '#fafafa',
        '&:hover': {
          backgroundColor: '#f5f5f5',
          cursor: 'pointer',
        },
      },
    },
  ];

  return (
    <div className="publications-container">
      <div className="publications-stats" style={{ 
        margin: '10px 0',
        fontSize: '0.9rem',
        color: '#555'
      }}>
        Total des publications: {allPublications.length} | Filtrées: {totalRows}
      </div>
    
      <div className="filters2" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        margin: '10px 0'
      }}>
        <div className="search-bar2" style={{ 
          display: 'flex',
          alignItems: 'center',
          minWidth: '200px',
          flex: '1',
          marginRight: '10px',
          marginBottom: '10px'
        }}>
          <FaSearch className="logo-recherche" />
          <input
            type="text"
            placeholder="Rechercher une publication"
            value={search}
            onChange={handleSearch}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          onClick={() => setShowFilters(true)} 
          className="plus"
          style={{ 
            padding: '8px 15px',
            whiteSpace: 'nowrap'
          }}
        >
          <FaFilter className="filtree2" /> Plus de filtres
        </button>
      </div>

      {/* Filtres actifs */}
      <div className="active-filters" style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
        margin: '0 0 10px 0'
      }}>
        {activeFilters.length > 0 ? (
          activeFilters.map((filter, index) => (
            <span key={index} className="filter-pill" style={{
              backgroundColor: '#f0f0f0',
              padding: '3px 8px',
              borderRadius: '15px',
              fontSize: '0.8rem'
            }}>
              {filter.type}: {filter.value}
            </span>
          ))
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#777' }}>Aucun filtre actif</span>
        )}
      </div>

      {/* Message d'erreur API si présent */}
      {apiError && (
        <div className="api-error" style={{ 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          padding: "6px 10px", 
          borderRadius: "4px", 
          margin: "5px 0", 
          border: "1px solid #f5c6cb",
          fontSize: "0.8rem"
        }}>
          <strong>Erreur:</strong> {apiError}
        </div>
      )}

      <div className="publications-content" style={{ position: "relative" }}>
        <DataTable
          columns={columns}
          data={publications}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[6, 10, 15, 20]}
          className="table"
          noDataComponent="Aucune publication trouvée"
          responsive
          dense
          highlightOnHover
          conditionalRowStyles={conditionalRowStyles}
          customStyles={{
            table: {
              style: {
                width: "100%",
                minHeight: "20rem", // Réduire la hauteur pour un design plus compact
                backgroundColor: "#fafafa",
                zIndex: "1",
              },
            },
            rows: {
              style: {
                minHeight: "45px", // Hauteur réduite
                borderRadius: "4px",
                marginTop: "5px",
                fontSize: "14px", // Police plus petite
                padding: "2px",
                backgroundColor: "#fafafa",
                border: "1px solid #eaeaea", // Bordure plus légère
              },
            },
            headCells: {
              style: {
                fontSize: "14px", // Police plus petite
                fontWeight: "bold",
                textAlign: "center",
                paddingLeft: "10px", // Padding réduit
                backgroundColor: "#fafafa",
                paddingTop: "6px", // Padding réduit
                paddingBottom: "6px", // Padding réduit
              },
            },
            cells: {
              style: {
                backgroundColor: "#fafafa",
                paddingLeft: "10px", // Padding réduit
                paddingRight: "10px", // Padding réduit
                paddingTop: "6px", // Padding réduit
                paddingBottom: "6px", // Padding réduit
              },
            },
            pagination: {
              style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "3px", // Espace réduit
                marginTop: "8px",
                paddingBottom: "5px",
                fontSize: "13px", // Police plus petite
              },
              pageButtonsStyle: {
                backgroundColor: "#f1f1f1",
                border: "1px solid #ddd", // Bordure plus légère
                color: "#333",
                padding: "3px 6px", // Padding réduit
                margin: "0 2px", // Marge réduite
                cursor: "pointer",
                borderRadius: "3px", // Rayon plus petit
                transition: "background-color 0.3s",
              },
              activePageStyle: {
                backgroundColor: "#1976b4",
                color: "white",
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

        {/* Modal de filtres */}
        {showFilters && (
          <div className="filter-overlay" style={{ 
            position: "fixed", // Fixed pour s'assurer qu'il reste visible
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", // Fond semi-transparent
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // S'assurer d'être au-dessus de tout
          }}>
            <div style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              padding: "15px",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => setShowFilters(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>
              <Filtrepub onApply={handleApplyFilters} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table_pub;