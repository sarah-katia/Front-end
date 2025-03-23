import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaSearch, FaFilter } from "react-icons/fa";
import NavBar from "../nav/Sidebar";
import Topnav from "../nav/Topnav";

import "./Table_chercheur.css"; 

const fakeData = [
  { id: 1, photo: "https://via.placeholder.com/50", nom: "Kermi Adel", qualite: "Professeur", equipe: "TIIMA" },
  { id: 2, photo: "https://via.placeholder.com/50", nom: "Mouloud Koudil", qualite: "Professeur", equipe: "CoDesign" },
  { id: 3, photo: "https://via.placeholder.com/50", nom: "Ahmed Bensalem", qualite: "Chercheur", equipe: "IMAGE" },
  { id: 4, photo: "", nom: "Sofiane Djelloul", qualite: "Doctorant", equipe: "OPI" },
];

/* SI BASE DE DONNÉES */
// useEffect(() => {
//   fetch("URL_DE_VOTRE_API")
//     .then(response => response.json())
//     .then(data => setChercheurs(data))
//     .catch(error => console.error("Erreur :", error));
// }, []);

const Table_chercheur = () => {
  const [chercheurs, setChercheurs] = useState(fakeData);
  const [search, setSearch] = useState("");
  const [filterQualite, setFilterQualite] = useState("");
  const [filterEquipe, setFilterEquipe] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterQualite = (event) => {
    setFilterQualite(event.target.value);
  };

  const handleFilterEquipe = (event) => {
    setFilterEquipe(event.target.value);
  };

  const filteredData = chercheurs.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase()) &&
    (filterQualite ? c.qualite === filterQualite : true) &&
    (filterEquipe ? c.equipe === filterEquipe : true)
  );

  const columns = [
    { name: "Photo", selector: (row) => <img src={row.photo} alt="Profile" className="profile-pic" />, width: "80px" },
    { name: "Nom complet", selector: (row) => row.nom, sortable: true },
    { name: "Qualité", selector: (row) => row.qualite, sortable: true },
    { name: "Équipe", selector: (row) => row.equipe, sortable: true },
    { name: "Plus de détails", cell: () => <button className="btn-profile">Voir Profile</button> },
  ];

  return (
    <div className="chercheurs-container">
      <NavBar />
      <Topnav/>

      <div className="chercheurs-content">
        
        <div className="filters">
          <div className="search-bar">
            <FaSearch />
            <input type="text" placeholder="Rechercher un chercheur" value={search} onChange={handleSearch} />
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
          <button onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Plus de filtres
          </button>
        </div>

        <DataTable columns={columns} data={filteredData} pagination />
      </div>
    </div>
  );
};

export default Table_chercheur;
