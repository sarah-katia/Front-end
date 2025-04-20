import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {  FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../nav/sidebardir";
import Topnav from "../nav/Topnav";
import TabsHeader from "./Tabsheader";
import Filters from "../table/Filtre";
import styling from "./chercheur.module.css";
import DeleteConfirmationCard from "../cartes/deletecard"; // ✅ Nouveau import

const fakeData = [
  { id: 1, photo: "https://via.placeholder.com/50", nom: "Kermi Adel", email: "kermi.adel@example.com", qualite: "Professeur", equipe: "TIIMA" },
  { id: 2, photo: "https://via.placeholder.com/50", nom: "Mouloud Koudil", email: "koudil.mouloud@example.com", qualite: "Professeur", equipe: "CoDesign" },
  { id: 3, photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", email: "bensalem.ahmed@example.com", qualite: "Chercheur", equipe: "IMAGE" },
  { id: 4, photo: "../../assets/Koudil.png", nom: "Toufik Djellal", email: "sofiane.djelloul@example.com", qualite: "Doctorant", equipe: "OPI" },
  { id: 5, photo: "https://via.placeholder.com/50", nom: "Imene Belkacem", email: "imene.belkacem@example.com", qualite: "Doctorante", equipe: "EIAH" },
];

const Cherch = () => {
  const [chercheurs, setChercheurs] = useState(fakeData);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [chercheurASupprimer, setChercheurASupprimer] = useState(null); // ✅ État carte suppression

  const navigate = useNavigate();

  const handleSearch = (event) => setSearch(event.target.value);

  const handleDelete = (id) => {
    console.log("Suppression via carte personnalisée"); 
    const chercheur = chercheurs.find((c) => c.id === id);
    setChercheurASupprimer(chercheur); // ✅ Ouvre la carte
  };

  const confirmerSuppression = () => {
    setChercheurs((prev) => prev.filter((c) => c.id !== chercheurASupprimer.id));
    setChercheurASupprimer(null); // ✅ Ferme la carte
  };

  const annulerSuppression = () => {
    setChercheurASupprimer(null); // ✅ Annule la suppression
  };

  const filteredData = chercheurs.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "Photo", selector: (row) => <img src={row.photo} alt="Profile" className={styling.profilePic} />, width: "100px" },
    { name: "Nom complet", selector: (row) => row.nom, sortable: true },
    {
      name: "Email",
      selector: (row) => (
        <a href={`mailto:${row.email}`} className={styling.emailLink}>
          {row.email}
        </a>
      ),
      sortable: true,
    },
    { name: "Qualité", selector: (row) => row.qualite, sortable: true },
    { name: "Équipe", selector: (row) => row.equipe, sortable: true },
    {
      name: "Plus de détails",
      cell: (row) => (
        <div className={styling.actions}>
          <button className={styling.viewBtn}>Voir Profil</button>
          <button className={styling.deleteBtn} onClick={() => handleDelete(row.id)}>
            Supprimer
          </button>
        </div>
      ),
      width: "240px",
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
            <button className={styling.addBtn} onClick={() => navigate("/ajouter-chercheur")}>
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

          {/* ✅ Carte de confirmation suppression */}
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
