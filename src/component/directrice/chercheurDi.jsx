import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../nav/SidebarDi";
import Topnav from "../nav/Topnav";
import TabsHeader from "../gestionassi/Tabsheader";
import Filters from "../table/Filtre";
import styling from "../gestionassi/chercheur.module.css";
import DeleteConfirmationCard from "../cartes/deletecard";
import axios from "axios";

const Cherch = () => {
  const [chercheurs, setChercheurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [chercheurASupprimer, setChercheurASupprimer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChercheurs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/chercheur/");
        setChercheurs(response.data.data); // Adapté à la structure de votre réponse backend
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChercheurs();
  }, []);

  const handleSearch = (event) => setSearch(event.target.value);

  const handleDelete = (id) => {
    const chercheur = chercheurs.find((c) => c.chercheur_id === id);
    setChercheurASupprimer(chercheur);
  };

  const confirmerSuppression = async () => {
    try {
      await axios.delete(`http://localhost:8000/chercheur/${chercheurASupprimer.chercheur_id}`);
      setChercheurs((prev) => prev.filter((c) => c.chercheur_id !== chercheurASupprimer.chercheur_id));
      setChercheurASupprimer(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setChercheurASupprimer(null);
    }
  };

  const annulerSuppression = () => {
    setChercheurASupprimer(null);
  };

  const filteredData = chercheurs.filter((c) =>
    c.nom_complet.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      name: "Photo", 
      selector: (row) => (
        <img 
          src={row.photo || "https://via.placeholder.com/50"} 
          alt="Profile" 
          className={styling.profilePic} 
        />
      ), 
      width: "100px" 
    },
    { name: "Nom complet", selector: (row) => row.nom_complet, sortable: true },
    {
      name: "Email",
      selector: (row) => (
        <a href={`mailto:${row.Mails}`} className={styling.emailLink}>
          {row.Mails}
        </a>
      ),
      sortable: true,
    },
    { name: "Qualité", selector: (row) => row.Qualité, sortable: true },
    { name: "Équipe", selector: (row) => row.Equipe, sortable: true },
    {
      name: "Plus de détails",
      cell: (row) => (
        <div className={styling.actions}>
          <button 
            className={styling.viewBtn}
            onClick={() => navigate(`/directrice/chercheurDi/${row.chercheur_id}`)}
          >
            Voir Profil
          </button>
          <button 
            className={styling.deleteBtn} 
            onClick={() => handleDelete(row.chercheur_id)}
          >
            Supprimer
          </button>
        </div>
      ),
      width: "240px",
    },
  ];

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
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

      <div className={styling.chercheursContainer}>
        <div className={styling.chercheursContent}>
          <div className={styling.filtersHeader}>
            <div className={styling.searchBar}>
              <FaSearch />
              <input
                type="text"
                placeholder="Rechercher un chercheur"
                value={search}
                onChange={handleSearch}
              />
            </div>
            
            <button className={styling.filteringBtn} onClick={() => setShowFilters(true)}>
              Filtrer
            </button>
            <button 
              className={styling.addBtn} 
              onClick={() => navigate("/ajouter-chercheur", {state: {Sidebar: "directrice"}})} >
              + Ajouter un chercheur
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
                    backgroundColor: "#fafafa",
                    overflowX: "hidden",
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

          <DeleteConfirmationCard
            isVisible={!!chercheurASupprimer}
            chercheur={chercheurASupprimer}
            onConfirm={confirmerSuppression}
            onCancel={annulerSuppression}
            message={'Voulez-vous vraiment supprimer ce chercheur ?'}
          />
        </div>
      </div>
    </>
  );
};

export default Cherch;