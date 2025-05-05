import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../nav/SidebarDi";
import Topnav from "../nav/Topnav";
import TabsHeader from "../gestionassi/Tabsheader";
import styling from "./assistante.module.css";

const Assi = () => {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/directrice/assistants");
        // Ajoute un champ nom_complet si non présent dans la réponse
        const dataWithFullName = response.data.map(assistant => ({
          ...assistant,
          nom_complet: assistant.nom_complet || `${assistant.prenom || ''} ${assistant.nom || ''}`.trim()
        }));
        setAssistants(dataWithFullName);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = assistants.filter(assistant => {
    const searchTerm = search.toLowerCase();
    return (
      assistant.Mails.toLowerCase().includes(searchTerm) ||
      (assistant.Tél && assistant.Tél.toLowerCase().includes(searchTerm)) ||
      (assistant.nom_complet && assistant.nom_complet.toLowerCase().includes(searchTerm))
    );
  });

  // Pagination logic
  const totalRows = filteredData.length;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
      width: "100px",
    },
    {
      name: "Nom complet",
      selector: (row) => row.nom_complet || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => (
        <a href={`mailto:${row.Mails}`} className={styling.emailLink}>
          {row.Mails}
        </a>
      ),
      sortable: true,
      width: "200px",
    },
    {
      name: "Téléphone",
      selector: (row) => row.Tél || "N/A",
      sortable: true,
      width: "160px",
    },
    {
      name: "Plus de détails",
      cell: (row) => (
        <div className={styling.actions}>
          <button 
            className={styling.viewBtn}
            onClick={() => navigate(`/assistante/${row.id}`)}
          >
            Voir Profil
          </button>
        </div>
      ),
      center: "true",
    },
  ];

  return (
    <>
      <NavBar />
      <Topnav />
      <TabsHeader tabs={[
        { label: "Chercheurs", path: "/directrice/chercheurDi" },
        { label: "Publications", path: "/directrice/publicationDi" },
        { label: "Assistante", path: "/directrice/Assistante" },
      ]} />

      <div className={styling.Container}>
        <div className={styling.Content}>
          <div className={styling.filtersHeader}>
            <div className={styling.searchBar}>
              <FaSearch />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <button 
              className={styling.addBtn} 
              onClick={() => navigate("/AjouterAssis")}
            >
              + Ajouter une assistante
            </button>
          </div>

          <div className={styling.tableContainer}>
            <DataTable
              columns={columns}
              data={currentItems}
              pagination
              paginationTotalRows={totalRows}
              paginationPerPage={perPage}
              paginationDefaultPage={currentPage}
              onChangePage={page => setCurrentPage(page)}
              onChangeRowsPerPage={rowsPerPage => setPerPage(rowsPerPage)}
              paginationRowsPerPageOptions={[10, 25, 50]}
              progressPending={loading}
              noDataComponent="Aucune assistante trouvée"
              customStyles={{
                table: {
                  style: {
                    width: "100%",
                    minHeight: "750px",
                    minWidth: "900px",
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
        </div>
      </div>
    </>
  );
};

export default Assi;