import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../nav/SidebarDi";
import TopNav from "../nav/Topnav";
import styles from "./generer.module.css";

const StatiqueIntervalle = () => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [critere, setCritere] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!critere) {
        alert("Veuillez choisir un critère avant de continuer.");
        return;
      }
    
      // Si le critère inclut "date", vérifier aussi les dates
      if (critere.includes("date") && (!dateDebut || !dateFin)) {
        alert("Veuillez remplir les deux dates.");
        return;
      }

    navigate("/statresults", {
      state: { critere, dateDebut, dateFin },
    });
  };


  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <TopNav />
        <div className={styles.content}>
          <h2>Veuillez choisir un critère:</h2>

          <div className={styles.formSection}>

          <label>
              Critère :
              <select value={critere} onChange={(e) => setCritere(e.target.value)}>
                <option value="">-- Choisir un critère --</option>
                <option value="nombre de publication par equipe">nombre de publication par equipe</option>
                <option value="nombre de publication par date">nombre de publication par date</option>
              </select>
            </label>


            {critere.includes("date") && (
              <>
                <label>
                  Date de début :
                  <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                  />
                </label>

                <label>
                  Date de fin :
                  <input
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </label>
              </>
            )}
          </div>

          <div className={styles.buttonContainer}>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!critere}> 
            suivant --{'>'}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatiqueIntervalle;
