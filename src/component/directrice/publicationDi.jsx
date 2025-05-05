import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../nav/SidebarDi";
import Topnav from "../nav/Topnav";
import TabsHeader from "../gestionassi/Tabsheader";
import Filters from "../table/filtrepub";
import styling from "../gestionassi/publication.module.css";
import DeleteConfirmationCard from "../cartes/deletecard";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [publicationASupprimer, setPublicationASupprimer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get("http://localhost:8000/publications/");
        setPublications(response.data.publications || []);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des publications:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const handleSearch = (event) => setSearch(event.target.value);

  const handleDelete = async (id) => {
    try {
      const publication = publications.find((p) => p.publication_id === id);
      setPublicationASupprimer(publication);
    } catch (err) {
      console.error("Erreur lors de la préparation de la suppression:", err);
    }
  };

  const confirmerSuppression = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/publications/${publicationASupprimer.publication_id}/${publicationASupprimer.chercheur_id}`
      );
      setPublications((prev) =>
        prev.filter((p) => p.publication_id !== publicationASupprimer.publication_id)
      );
      setPublicationASupprimer(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setPublicationASupprimer(null);
    }
  };

  const annulerSuppression = () => setPublicationASupprimer(null);

  const filteredData = publications.filter((p) =>
    p.titre_publication?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = (publication) => {
    navigate(`/voirpluspub/${publication.publication_id}`, { 
      state: { 
        publication,
        Sidebar: 'directrice' 
      }
    });
  };
  
  const columns = [
    { 
      name: "Auteur", 
      selector: (row) => row.auteurs || "N/A", 
      sortable: true, 
      width: "160px" 
    },
    { 
      name: "Titre", 
      selector: (row) => row.titre_publication || "N/A", 
      sortable: true, 
      grow: 2, 
      wrap: true 
    },
    { 
      name: "Date", 
      selector: (row) => row.annee || "N/A", 
      sortable: true, 
      width: "100px" 
    },
    { 
      name: "Éditeur", 
      selector: (row) => row.publisher || "N/A", 
      sortable: true, 
      width: "120px" 
    },
    {
      name: "Plus",
      cell: (row) => (
        <div className={styling.actions}>
          <button 
            className={styling.viewBtn}
            onClick={() => handleViewDetails(row)}
          >
            Voir plus
          </button>
          <button 
            className={styling.deleteBtn} 
            onClick={() => handleDelete(row.publication_id)}
          >
            Supprimer
          </button>
        </div>
      ),
      width: "220px",
    },
  ];

  if (loading) {
    return <div className={styling.loading}>Chargement en cours...</div>;
  }

  if (error) {
    return <div className={styling.error}>Erreur: {error}</div>;
  }

  return (
    <>
      <NavBar />
      <Topnav />
      <TabsHeader tabs={[
        { label: "Chercheurs", path: "/directrice/chercheurDi" },
        { label: "Publications", path: "/directrice/publicationDi" },
        { label: "Assistante", path: "/directrice/Assistante" },
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
            <button 
              className={styling.filterBtn} 
              onClick={() => setShowFilters(true)}
            >
              Filtrer
            </button>
          </div>

          <div className={styling.tableContainer}>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50]}
              noDataComponent="Aucune publication trouvée"
              customStyles={{
                table: { 
                  style: { 
                    backgroundColor: "#fafafa", 
                    minHeight: "750px",
                    minWidth: "900px" 
                  } 
                },
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
              onRowClicked={(row) => handleViewDetails(row)} // Optionnel: clic sur toute la ligne
            />
          </div>

          {showFilters && (
            <div className={styling.filterOverlay}>
              <div className={styling.filterModal}>
                <button 
                  className={styling.closeBtn} 
                  onClick={() => setShowFilters(false)}
                >
                  ✖
                </button>
                <Filters 
                  onApply={(filters) => {
                    console.log("Filtres appliqués:", filters);
                    setShowFilters(false);
                  }} 
                />
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